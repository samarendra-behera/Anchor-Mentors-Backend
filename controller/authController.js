const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const user = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
}

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
        confirmPassword: body.confirmPassword
    })

    if (!newUser) {
        return next(new AppError('Failed to create the user', 400))
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
    
    return res.status(201).json({
        status: 'success',
        data: result
    })
});


const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    const result = await user.findOne({ where: { email } })
    
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
    const freshUser = await user.findByPk(tokenDetails.id)
    if (!freshUser){
        return next(new AppError('User not longer exists', 401));
    }
    req.user = freshUser;

    // 4. go to next middleware
    return next();
});

const restrictTo = (...UserType) => {
    const checkPermission = (req, res, next)=> {
        if (!UserType.includes(req.user.userType)){
            return next (new AppError(
                'You do not have permission to perform this action', 
                403
            ))
        }
        return next();
    }

    return checkPermission;
}

module.exports = { signup, login, authenticate, restrictTo };