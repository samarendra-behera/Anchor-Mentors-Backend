const { authenticate, restrictTo } = require('../controller/authController');
const { 
    myProfile,
    updateProfile
} = require('../controller/mentorController')

const router = require('express').Router();


router.route('/my-profile').get(authenticate, restrictTo('mentor'), myProfile);
router.route('/update-profile').put(authenticate, restrictTo('mentor'), updateProfile);
module.exports = router;