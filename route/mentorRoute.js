const {mentorPicUpload, mentorPitchDeckUpload} = require('../config/multer');
const { authenticate, restrictTo } = require('../controller/authController');
const { 
    myProfile,
    updateProfile,
    uploadProfilePic,
    uploadPitchDeck,
    uploadWorkExperience,
    uploadEducationExperience
} = require('../controller/mentorController')

const router = require('express').Router();


router.route('/my-profile').get(authenticate, restrictTo('mentor'), myProfile);
router.route('/update-profile').put(authenticate, restrictTo('mentor'), updateProfile);
router.route('/profile-pic/upload').put(authenticate, restrictTo('mentor'), mentorPicUpload.single('profilePic'), uploadProfilePic);
router.route('/pitch-deck/upload').put(authenticate, restrictTo('mentor'), mentorPitchDeckUpload.single('pitchDeck'), uploadPitchDeck);
router.route('/work-experience/upload').put(authenticate, restrictTo('mentor'), uploadWorkExperience)
router.route('/education-experience/upload').put(authenticate, restrictTo('mentor'), uploadEducationExperience)
module.exports = router;