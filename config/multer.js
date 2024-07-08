const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const AppError = require('../utils/appError');

const getSetStorageDir = (dir)=>{
    storageDir = path.join(process.cwd(), 'uploads', dir);
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
    }

    return storageDir;
}


// Configure Multer storage
const mentorPicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, getSetStorageDir('profile-pics'));
    },
    filename: (req, file, cb) => {
        const userId = req.user.id; 
        const uniqueName = `${userId}-${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const mentorPitchDeckStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, getSetStorageDir('pitch-decks'));
    },
    filename: (req, file, cb) => {
        const userId = req.user.id; 
        const uniqueName = `${userId}-${uuidv4()}${path.extname(file.originalname)}`; 
        cb(null, uniqueName);
    },
});


// Configure Multer middleware
const mentorPicUpload = multer({
    storage: mentorPicStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new AppError('Only image files are allowed!', 400), false);
        }
    },
});

const mentorPitchDeckUpload = multer({
    storage: mentorPitchDeckStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

module.exports = {mentorPicUpload, mentorPitchDeckUpload};