const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const user = require("../db/models/user");
const mentor = require("../db/models/mentor");
const mentee = require("../db/models/mentee");
const twilioClient = require("../config/twilioClient");
const emailQueue = require("../thirdparty-services/emailQueue");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendOtpQueue = require("../thirdparty-services/sendOtpQueue");
const phoneVerification = require("../db/models/phone_verification");

// Generate Token function
const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
}

const sendVerificationCode = catchAsync(async (req, res, next) => {
    const { phoneNumber } = req.body;

    // Validate and format phone number
    const phoneNumberInstance = parsePhoneNumberFromString(phoneNumber, 'IN');
    if (!phoneNumberInstance || !phoneNumberInstance.isValid()) {
        return next(new AppError('Invalid phone number format', 400));
    }

    const formattedPhoneNumber = phoneNumberInstance.formatInternational();

    // Send verification code
    await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID).verifications.create({
        to: formattedPhoneNumber,
        channel: 'sms'
    })
    // msgData = {
    //     to: formattedPhoneNumber,
    //     channel: 'sms'
    // }
    // sendOtpQueue.add({ msgData })

    // save phone number in database
    await phoneVerification.destroy({ where: { phoneNumber: formattedPhoneNumber, verified: false } })
    await phoneVerification.create({
        phoneNumber: formattedPhoneNumber
    })

    res.status(200).json({
        status: 'success',
        message: `Verification code sent to ${formattedPhoneNumber}`
    });
})


const verifyVerificationCode = catchAsync(async (req, res, next) => {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
        return next(new AppError('Please provide phone number and code', 400))
    }

    // Validate and format phone number
    const phoneNumberInstance = parsePhoneNumberFromString(phoneNumber, 'IN');
    if (!phoneNumberInstance || !phoneNumberInstance.isValid()) {
        return next(new AppError('Invalid phone number format', 400));
    }
    const formattedPhoneNumber = phoneNumberInstance.formatInternational();

    // Verify verification code
    const verification = await phoneVerification.findOne({ where: { phoneNumber: formattedPhoneNumber, verified: false } })
    if (!verification) {
        return next(new AppError('Invalid verification code', 400))
    }

    // twilio verify
    const verificationCheck = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks
        .create({ to: formattedPhoneNumber, code: code });

    if (verificationCheck.status !== 'approved') {
        return next(new AppError('Invalid verification code', 400))
    }

    verification.verified = true
    await verification.save()

    res.status(200).json({
        status: 'success',
        message: 'Verification code verified successfully'
    })

});

const signup = catchAsync(async (req, res, next) => {
    const body = req.body

    if (!['mentor', 'mentee'].includes(body.userType)) {
        return next(new AppError('Invalid user Type', 400))
    }

    const newUser = await user.create({
        userType: body.userType,
        fullName: body.fullName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
        phoneNumber: body.phoneNumber
    })

    if (!newUser) {
        return next(new AppError('Failed to create the user', 400))
    }

    if (newUser.userType === 'mentor') {
        await mentor.create({
            userId: newUser.id
        })
    }

    if (newUser.userType === 'mentee') {
        await mentee.create({
            userId: newUser.id
        })
    }

    const result = newUser.toJSON()

    delete result.password
    delete result.deletedAt
    delete result.resetPasswordToken
    delete result.resetPasswordExpires

    result.token = generateToken({
        id: result.id,
    });

    // email send
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: result.email,
        subject: 'Welcome to Anchor Mentors',
        text: `Hello ${result.fullName},\n\nThank you for signing up with Anchor Mentors.`
    }
    // Add the job to the queue
    emailQueue.add({ mailOptions })

    return res.status(201).json({
        status: 'success',
        data: result
    })
});


const login = catchAsync(async (req, res, next) => {
    const { email, password, userType } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    if (!userType) {
        return next(new AppError('Please provide user type', 400))
    }

    if (!['mentor', 'mentee'].includes(userType)) {
        return next(new AppError('Invalid user type', 400))
    }

    const result = await user.findOne({ where: { email, userType } })

    if (!result || !(await bcrypt.compare(password, result.password))) {
        return next(new AppError('Incorrect email or password', 400))
    }

    const token = generateToken({
        id: result.id,
    });
    return res.json({
        status: 'success',
        token
    })
});

const authenticate = catchAsync(async (req, res, next) => {
    // 1. get the token from header
    let idToken = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        idToken = req.headers.authorization.split(' ')[1];
    }
    if (!idToken) {
        return next(new AppError('Please login to get access', 401));
    }
    // 2. token varification
    const tokenDetails = jwt.verify(idToken, process.env.JWT_SECRET)

    // 3. get the user details from db and add to req object
    const freshUser = await user.findByPk(tokenDetails.id, {
        attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
    })
    if (!freshUser) {
        return next(new AppError('User not longer exists', 401));
    }
    req.user = freshUser;

    // 4. go to next middleware
    return next();
});

const restrictTo = (...UserType) => {
    const checkPermission = (req, res, next) => {
        if (!UserType.includes(req.user.userType)) {
            return next(new AppError(
                'You do not have permission to perform this action',
                403
            ))
        }
        return next();
    }

    return checkPermission;
}

const changePassword = catchAsync(async (req, res, next) => {
    console.log(req.user)
    const { password, confirmPassword } = req.body;


    if (!password || !confirmPassword) {
        return next(new AppError('Please provide password and confirm password', 400))
    }

    req.user.password = password;
    req.user.confirmPassword = confirmPassword;
    await req.user.save();

    return res.status(200).json({
        status: 'success',
        message: 'Password changed successfully'
    })
})

const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new AppError('Please provide email', 400))
    }
    const forgotUser = await user.findOne({ where: { email } })
    if (!forgotUser) {
        return next(new AppError('User not found', 400))
    }

    const resetToken = crypto.randomBytes(30).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 40);

    forgotUser.resetPasswordToken = resetToken;
    forgotUser.resetPasswordExpires = Date.now() + 60 * 2 * 1000;
    await forgotUser.save();

    // reset password email send
    const protocol = req.protocol;
    const clientDomain = process.env.CLIENT_DOMAIN;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: forgotUser.email,
        subject: 'Password Reset Request',
        text: `Hello ${forgotUser.fullName},\n\nYou are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${protocol}://${clientDomain}/reset/${resetToken}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    }

    // Add the job to the queue
    emailQueue.add({ mailOptions })

    return res.status(200).json({
        status: 'success',
        message: 'Password reset email sent successfully'
    })
})

const resetPassword = catchAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    resetToken = req.params.token

    if (!password || !confirmPassword) {
        return next(new AppError('Please provide password and confirm password', 400))
    }

    const resetUser = await user.findOne({ where: { resetPasswordToken: resetToken } })

    if (!resetUser) {
        return next(new AppError('Invalid reset token', 400))
    }

    if (resetUser.resetPasswordExpires < Date.now()) {
        return next(new AppError('Reset token expired', 400))
    }

    resetUser.password = password;
    resetUser.confirmPassword = confirmPassword;
    resetUser.resetPasswordToken = null;
    resetUser.resetPasswordExpires = null;
    await resetUser.save();

    return res.status(200).json({
        status: 'success',
        message: 'Password reset successfully'
    })

})




module.exports = { sendVerificationCode, verifyVerificationCode, signup, login, authenticate, restrictTo, changePassword, forgotPassword, resetPassword };