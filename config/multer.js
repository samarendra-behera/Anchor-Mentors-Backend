const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const AppError = require('../utils/appError');

// Create storage directory if it doesn't exist
const storageDir = path.join(process.cwd(), 'uploads', 'profile-pics');
if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
}


// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storageDir);
    },
    filename: (req, file, cb) => {
        const userId = req.user.id; // Assuming user ID is available in the request
        const uniqueName = `${userId}-${uuidv4()}${path.extname(file.originalname)}`; // Generate unique filename with UUID and preserve file extension
        cb(null, uniqueName);
    },
});


const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new AppError('Only image files are allowed!', 400), false);
        }
    },
});

module.exports = upload;