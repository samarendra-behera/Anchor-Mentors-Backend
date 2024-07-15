const { authenticate, restrictTo } = require('../controller/authController');
const { 
    myProfile,
    updateProfile
} = require('../controller/menteeController')

const router = require('express').Router();

router.route('/my-profile').get(authenticate, restrictTo('mentee'), myProfile);
router.route('/update-profile').put(authenticate, restrictTo('mentee'), updateProfile);

module.exports = router;