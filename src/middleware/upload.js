const multer = require('multer');
const path = require('path');

// Set storage strategy
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/lessons/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = upload;
