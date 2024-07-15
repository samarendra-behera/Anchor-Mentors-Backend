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

module.exports = {
    myProfile,
    updateProfile,
}