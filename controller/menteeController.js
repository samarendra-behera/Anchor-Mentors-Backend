const _ = require('lodash');
const fs = require('fs').promises;

const user = require("../db/models/user");
const mentee = require("../db/models/mentee");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

const myProfile = catchAsync(async (req, res, next) => {
    const { id } = req.user

    currMentee = await mentee.findOne({
        where: { userId: id },
        include: [
            {
                model: user,
                attributes: { exclude: ['password', 'deletedAt', 'resetPasswordToken', 'resetPasswordExpires', 'id'] },
            }
        ],
        attributes: { exclude: ['deletedAt'] }
    });

    let profileData =  currMentee.toJSON()
    const mUser = profileData.user
    delete profileData.user
    profileData = { ...profileData, ...mUser }
    delete mUser
    delete currMentor

    return res.status(200).json({
        status: 'success',
        profileDetails: profileData,
    });
});


const updateProfile = catchAsync(async (req, res, next) => {
    const { id:userId } = req.user

    // Define the updatable fields
    const updatableFields = [
        'joinInspires',
        'startupName',
        'currentStage',
        'fundingStage',
        'aboutStartup',
        'painPointsOfStartup',
        'websiteLink',
        'appLink',
        'industry'
    ];
    // Pick only the fields present in the request body
    const updateFields = _.pick(req.body, updatableFields);

    await mentee.update(updateFields, {
        where: { userId }
    });

    return res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully'
    })
});

const uploadProfilePic = catchAsync(async (req, res, next) => {
    const photo = req.file
    if (!photo) {
        return next(new AppError('Please provide profile pic', 400));
    }

    if (req.user.profilePicPath) {
        await fs.rm(req.user.profilePicPath, { force: true })
    }

    req.user.profilePicPath = photo.path
    await req.user.save();

    return res.status(200).json({
        status: 'success',
        message: 'Profile pic uploaded successfully'
    })
});

const uploadPitchDeck = catchAsync(async (req, res, next) => {
    const doc = req.file
    if (!doc) {
        return next(new AppError('Please provide pitch deck', 400));
    }

    const currMentee = await mentee.findByPk(req.user.id);
    if (currMentee.pitchDeckPath) {
        await fs.rm(currMentee.pitchDeckPath, { force: true })
    }

    currMentee.pitchDeckPath = doc.path
    await currMentee.save();

    return res.status(200).json({
        status: 'success',
        message: 'Pitch deck uploaded successfully'
    })
});

module.exports = {
    myProfile,
    updateProfile,
    uploadProfilePic,
    uploadPitchDeck
}