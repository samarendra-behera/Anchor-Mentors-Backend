const _ = require('lodash');

const mentor = require("../db/models/mentor");
const user = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");


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
        'linkedInUrl'
    ];
    // Pick only the fields present in the request body
    const updateFields = _.pick(req.body, updatableFields);
    console.log(updateFields)
    await mentor.update(updateFields, {
        where: { userId: id }
    });


    return res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully'
    })
})


module.exports = {
    myProfile,
    updateProfile
}