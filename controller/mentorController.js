const _ = require('lodash');
const fs = require('fs').promises;

const sequelize = require('../config/database');
const mentor = require("../db/models/mentor");
const { mentorExperience } = require("../db/models/mentor_experience");
const user = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');


const myProfile = catchAsync(async (req, res, next) => {
    const { id } = req.user

    currMentor = await mentor.findOne({
        where: { userId: id },
        include: [
            {
                model: user,
                attributes: { exclude: ['password', 'deletedAt', 'resetPasswordToken', 'resetPasswordExpires', 'id'] },
            }
        ]
    });
    return res.status(200).json({
        status: 'success',
        profileDetails: currMentor,
    });
});


const updateProfile = catchAsync(async (req, res, next) => {
    const { id } = req.user

    // Define the updatable fields
    const updatableFields = [
        'bio',
        'role',
        'location',
        'languages',
        'inspires',
        'experience',
        'linkedInUrl',
        'educationExperienceDescription',
        'pastMentoringExperienceDescription',
        'domainExpertise',
        'menteePersonaForBooking',
    ];
    // Pick only the fields present in the request body
    const updateFields = _.pick(req.body, updatableFields);

    await mentor.update(updateFields, {
        where: { userId: id }
    });

    return res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully'
    })
})

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

    const currMentor = await mentor.findByPk(req.user.id);
    console.log("Mentor ", currMentor)
    if (currMentor.pitchDeckPath) {
        await fs.rm(currMentor.pitchDeckPath, { force: true })
    }

    currMentor.pitchDeckPath = doc.path
    await currMentor.save();

    return res.status(200).json({
        status: 'success',
        message: 'Pitch deck uploaded successfully'
    })
});


const uploadWorkExperience = catchAsync(async (req, res, next) => {
    const { id: mentorId } = req.user
    const workExperience = req.body

    if (!Array.isArray(workExperience) || !workExperience.length) {
        return next(new AppError('Please provide your work experiences', 400));
    }

    expData = []

    for (let exp of workExperience) {
        let { jobTitle, companyName, startDate, endDate, details, isPresentEmployement } = exp

        if (!jobTitle || !companyName || !startDate || isPresentEmployement === undefined) {
            return next(new AppError('Please provide all required fields, [jobTitle, companyName, startDate, isPresentEmployement]', 400));
        }
        if (!isPresentEmployement && !endDate) {
            return next(new AppError('Please provide endDate', 400));
        }
        if (isPresentEmployement && endDate) {
            endDate = null
        }

        expData.push({
            title: jobTitle,
            experienceType: 'Work',
            placeName: companyName,
            startDate: startDate,
            endDate: endDate,
            details: details,
            isPresentEmployement: exp.isPresentEmployement,
            mentorId
        })
    }
    const t = await sequelize.transaction();
    try {
        // delete previous work experiences
        await mentorExperience.destroy({
            where: {
                mentorId,
                experienceType: 'Work'
            },
            transaction: t
        })

        // create new work experiences
        await mentorExperience.bulkCreate(expData, { transaction: t })
        await t.commit();


        return res.status(200).json({
            status: 'success',
            message: 'Work experiences uploaded successfully'
        })
    } catch (err) {
        await t.rollback();
        next(err)
    }
});

const uploadEducationExperience = catchAsync(async (req, res, next) => {
    const { id: mentorId } = req.user
    const educationExperience = req.body

    if (!Array.isArray(educationExperience) || !educationExperience.length) {
        return next(new AppError('Please provide your education experiences', 400));
    }

    expData = []

    for (let exp of educationExperience) {
        let { schoolName, startDate, endDate, details } = exp

        if (!schoolName || !startDate || !endDate) {
            return next(new AppError('Please provide all required fields, [schoolName, startDate, endDate]', 400));
        }

        expData.push({
            experienceType: 'Education',
            placeName: schoolName,
            startDate: startDate,
            endDate: endDate,
            details: details,
            mentorId
        })
    }
    const t = await sequelize.transaction();
    try {
        // delete previous work experiences
        await mentorExperience.destroy({
            where: {
                mentorId,
                experienceType: 'Education'
            },
            transaction: t
        })

        // create new work experiences
        await mentorExperience.bulkCreate(expData, { transaction: t })
        await t.commit();

        return res.status(200).json({
            status: 'success',
            message: 'Education experiences uploaded successfully'
        })
    } catch (err) {
        await t.rollback();
        next(err)
    }
});

module.exports = {
    myProfile,
    updateProfile,
    uploadProfilePic,
    uploadPitchDeck,
    uploadWorkExperience,
    uploadEducationExperience
}