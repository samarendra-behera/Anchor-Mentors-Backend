const {picUpload} = require('../config/multer');
const { authenticate, restrictTo } = require('../controller/authController');
const { 
    myProfile,
    updateProfile,
    uploadProfilePic,
    uploadWorkExperience,
    uploadEducationExperience,
    uploadAvailability
} = require('../controller/mentorController')

const router = require('express').Router();


router.route('/my-profile').get(authenticate, restrictTo('mentor'), myProfile);
router.route('/update-profile').put(authenticate, restrictTo('mentor'), updateProfile);
router.route('/profile-pic/upload').put(authenticate, restrictTo('mentor'), picUpload.single('profilePic'), uploadProfilePic);
router.route('/work-experience/upload').put(authenticate, restrictTo('mentor'), uploadWorkExperience)
router.route('/education-experience/upload').put(authenticate, restrictTo('mentor'), uploadEducationExperience)
router.route('/availability/upload').put(authenticate, restrictTo('mentor'), uploadAvailability)
module.exports = router;