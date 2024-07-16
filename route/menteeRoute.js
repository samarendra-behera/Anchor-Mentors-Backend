const {picUpload, pitchDeckUpload} = require('../config/multer');
const { authenticate, restrictTo } = require('../controller/authController');
const { 
    myProfile,
    updateProfile,
    uploadProfilePic,
    uploadPitchDeck
} = require('../controller/menteeController')

const router = require('express').Router();

router.route('/my-profile').get(authenticate, restrictTo('mentee'), myProfile);
router.route('/update-profile').put(authenticate, restrictTo('mentee'), updateProfile);
router.route('/profile-pic/upload').put(authenticate, restrictTo('mentee'), picUpload.single('profilePic'), uploadProfilePic);
router.route('/pitch-deck/upload').put(authenticate, restrictTo('mentee'), pitchDeckUpload.single('pitchDeck'), uploadPitchDeck);

module.exports = router;