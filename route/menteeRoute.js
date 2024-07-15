const { authenticate, restrictTo } = require('../controller/authController');
const { 
    myProfile
} = require('../controller/menteeController')

const router = require('express').Router();

router.route('/my-profile').get(authenticate, restrictTo('mentee'), myProfile);

module.exports = router;