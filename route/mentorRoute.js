const {mentorPicUpload} = require('../config/multer');
const { authenticate, restrictTo } = require('../controller/authController');
const { 
    myProfile,
    updateProfile,
    uploadProfilePic
} = require('../controller/mentorController')

const router = require('express').Router();


router.route('/my-profile').get(authenticate, restrictTo('mentor'), myProfile);
router.route('/update-profile').put(authenticate, restrictTo('mentor'), updateProfile);
router.route('/profile-pic/upload').put(authenticate, restrictTo('mentor'), mentorPicUpload.single('profilePic'), uploadProfilePic);
module.exports = router;