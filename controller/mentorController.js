const _ = require('lodash');
const fs = require('fs').promises;
const { Op } = require('sequelize')

const sequelize = require('../config/database');
const mentor = require("../db/models/mentor");
const mentorExperience = require("../db/models/mentor_experience");
const mentorQuestion = require("../db/models/mentor_question");
const mentorAvailability = require("../db/models/mentor_availability");
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
        ],
        attributes: { exclude: ['deletedAt'] }
    });

    let profileData = currMentor.toJSON()
    const mUser = profileData.user
    delete profileData.user
    profileData = { ...profileData, ...mUser }
    delete mUser
    delete currMentor

    // get work experiences
    const workExps = await mentorExperience.findAll({
        where: {
            mentorId: id,
            experienceType: 'Work'
        },
        attributes: [
            'startDate',
            'endDate',
            'details',
            'isPresentEmployement',
            [sequelize.col('placeName'), 'companyName'],
            [sequelize.col('title'), 'jobTitle']
        ]
    })
    const workExpsData = workExps.map(exp => exp.toJSON());


    // get education experiences
    const educationExps = await mentorExperience.findAll({
        where: {
            mentorId: id,
            experienceType: 'Education'
        },
        attributes: [
            'startDate',
            'endDate',
            'details',
            [sequelize.col('placeName'), 'schoolName'],
        ]
    })
    const educationExpsData = educationExps.map(exp => exp.toJSON());



    profileData.workExperience = workExpsData;
    profileData.educationExperience = educationExpsData;

    // clean up
    delete workExps, educationExps, workExpsData, educationExpsData


    // get availability
    const availabilities = await mentorAvailability.findAll({
        where: {
            mentorId: id
        },
        attributes: ['dayName', 'startTime', 'endTime'],
    })
    let availabilitiesData = []
    for (let availability of availabilities) {
        availabilitiesData.push()
    }

    return res.status(200).json({
        status: 'success',
        profileDetails: profileData,
    });
});


const updateProfile = catchAsync(async (req, res, next) => {
    const { id } = req.user

    // Define the updatable fields
    const updatableFields = [
        'bio',
        'role',
        'startWorking',
        'location',
        'languages',
        'inspires',
        'experience',
        'linkedInUrl',
        'educationExperienceDescription',
        'pastMentoringExperienceDescription',
        'domainExpertise',
        'menteePersonaForBooking',
        'isProfileComplete',
        'needPitchDeck',
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

    req.user.profilePicPath = `/uploads/${process.env.PIC_DIR}/${photo.filename}`
    await req.user.save();

    return res.status(200).json({
        status: 'success',
        message: 'Profile pic uploaded successfully'
    })
});


// const uploadPitchDeck = catchAsync(async (req, res, next) => {
//     const doc = req.file
//     if (!doc) {
//         return next(new AppError('Please provide pitch deck', 400));
//     }

//     const currMentor = await mentor.findByPk(req.user.id);
//     if (currMentor.pitchDeckPath) {
//         await fs.rm(currMentor.pitchDeckPath, { force: true })
//     }

//     currMentor.pitchDeckPath = `/uploads/${process.env.PITCH_DIR}/${doc.filename}`
//     await currMentor.save();

//     return res.status(200).json({
//         status: 'success',
//         message: 'Pitch deck uploaded successfully'
//     })
// });


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

const addNewQuestion = catchAsync(async (req, res, next) => {
    const { id: mentorId } = req.user
    const { question } = req.body

    if (!question) {
        return next(new AppError('Please provide your question', 400));
    }

    await mentorQuestion.create({
        question,
        mentorId
    })

    return res.status(200).json({
        status: 'success',
        message: 'Question added successfully'
    })
});

const allQuestions = catchAsync(async (req, res, next) => {
    const { id: mentorId } = req.user
    const questions = await mentorQuestion.findAll({
        where: {
            mentorId
        },
        attributes: { exclude: ['mentorId'] }
    })
    return res.status(200).json({
        status: 'success',
        questions
    })
});

const getQuestion = catchAsync(async (req, res, next) => {
    const { id: mentorId } = req.user
    const { questionId } = req.params
    const question = await mentorQuestion.findOne({
        where: {
            mentorId,
            id: questionId
        }
    })

    if (!question) {
        return next(new AppError('Question not found', 404));
    }
    
    return res.status(200).json({
        status: 'success',
        question
    })
});

const editQuestion = catchAsync(async (req, res, next) => {
    const { id: mentorId } = req.user
    const { question } = req.body
    const { questionId } = req.params

    if (!question) {
        return next(new AppError('Please provide your question', 400));
    }

    let oldQuestion = await mentorQuestion.findOne(
        {
            where: {
                mentorId,
                id: questionId
            }
        }
    )

    if (!oldQuestion) {
        return next(new AppError('Question not found', 404));
    }
    
    oldQuestion.question = question
    await oldQuestion.save()

    return res.status(200).json({
        status: 'success',
        message: 'Question updated successfully'
    })
});

const removeQuestion = catchAsync(async (req, res, next) => {
    const { id: mentorId } = req.user
    const { questionId } = req.params
    
    let question = await mentorQuestion.findOne(
        {
            where: {
                mentorId,
                id: questionId
            }
        }
    )
    if (!question) {
        return next(new AppError('Question not found', 404));
    }

    await question.destroy()

    return res.status(200).json({
        status: 'success',
        message: 'Question removed successfully'
    })
});

const uploadAvailability = catchAsync(async (req, res, next) => {
    const { id: mentorId } = req.user
    const availabilities = req.body
    if (!Array.isArray(availabilities) || !availabilities.length) {
        return next(new AppError('Please provide your availabilities', 400));
    }

    let allAvailabilities = []
    let entryDayNames = []
    const t = await sequelize.transaction();
    try {
        for (let day of availabilities) {
            let { startTime, endTime, dayName } = day

            if (!startTime || !endTime || !dayName) {
                return next(new AppError('Please provide all required fields, [startTime, endTime, dayName]', 400));
            }

            entryDayNames.push(dayName)
            allAvailabilities.push({
                startTime,
                endTime,
                dayName,
                mentorId
            })
        }

        // delete previous availabilities
        await mentorAvailability.destroy({
            where: {
                mentorId,
                dayName: { [Op.in]: entryDayNames }
            },
            transaction: t
        })

        // create new availabilities
        await mentorAvailability.bulkCreate(allAvailabilities, { transaction: t })
        await t.commit();

        return res.status(200).json({
            status: 'success',
            message: 'Availability uploaded successfully'
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
    uploadWorkExperience,
    uploadEducationExperience,
    addNewQuestion,
    allQuestions,
    getQuestion,
    editQuestion,
    removeQuestion, 
    uploadAvailability
}