const { signup, login, authenticate, changePassword} = require('../controller/authController')

const router = require('express').Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/change-password').post(authenticate, changePassword);


module.exports = router;