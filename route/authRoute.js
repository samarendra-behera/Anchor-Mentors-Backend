const { 
    sendVerificationCode,
    signup, 
    login, 
    authenticate, 
    changePassword, 
    forgotPassword, 
    resetPassword
} = require('../controller/authController')

const router = require('express').Router();

router.route('/send-code').post(sendVerificationCode);


router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/change-password').post(authenticate, changePassword);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').post(resetPassword);


module.exports = router;