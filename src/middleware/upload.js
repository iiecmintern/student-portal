const multer = require("multer");
const path = require("path");
const {
  uploadToS3,
  getFileSizeLimit,
  isFileTypeAllowed,
} = require("../config/s3");

// Environment-based storage configuration
const isProduction = process.env.NODE_ENV === "production";

// Local storage configuration
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Memory storage for S3 uploads (we'll upload to S3 from memory)
const memoryStorage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  if (!isFileTypeAllowed(file.mimetype)) {
    return cb(new Error("File type not allowed"), false);
  }
  cb(null, true);
};

// Create multer instance based on environment
const createMulterInstance = (fieldName, maxFiles = 1) => {
  const storage = isProduction ? memoryStorage : localStorage;

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: (req, file) => getFileSizeLimit(file.mimetype),
      files: maxFiles,
    },
  }).single(fieldName);
};

// Middleware for course thumbnails
const uploadCourseThumbnail = createMulterInstance("thumbnail");

// Middleware for lesson attachments
const uploadLessonAttachments = multer({
  storage: isProduction ? memoryStorage : localStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: (req, file) => getFileSizeLimit(file.mimetype),
    files: 10, // Allow up to 10 files per lesson
  },
}).array("attachments", 10);

// Middleware for user avatars
const uploadAvatar = createMulterInstance("avatar");

// Middleware for lesson content (videos, PDFs)
const uploadLessonContent = createMulterInstance("content");

// Process uploaded files (convert local paths to S3 URLs in production)
const processUploadedFile = async (req, res, next) => {
  if (!req.file && !req.files) {
    return next();
  }

  try {
    if (isProduction) {
      // Upload to S3 in production
      if (req.file) {
        const s3Url = await uploadToS3(req.file, req.uploadFolder || "uploads");
        req.file.url = s3Url;
        req.file.filename = req.file.originalname; // Keep original name for reference
      }

      if (req.files) {
        for (let file of req.files) {
          const s3Url = await uploadToS3(file, req.uploadFolder || "uploads");
          file.url = s3Url;
          file.filename = file.originalname;
        }
      }
    } else {
      // In development, use local paths
      if (req.file) {
        req.file.url = `/uploads/${req.file.filename}`;
      }
      if (req.files) {
        req.files.forEach((file) => {
          file.url = `/uploads/${file.filename}`;
        });
      }
    }

    next();
  } catch (error) {
    console.error("File processing error:", error);
    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message,
    });
  }
};

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Please check file size limits.",
        limits: {
          video: "2GB",
          pdf: "100MB",
          image: "10MB",
        },
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files uploaded.",
      });
    }
  }

  if (error.message === "File type not allowed") {
    return res.status(400).json({
      success: false,
      message: "File type not allowed. Please check supported formats.",
      allowedTypes: {
        video: ["MP4", "WebM", "MOV", "AVI", "MKV"],
        pdf: ["PDF"],
        image: ["JPEG", "PNG", "GIF", "WebP"],
      },
    });
  }

  next(error);
};

module.exports = {
  uploadCourseThumbnail,
  uploadLessonAttachments,
  uploadAvatar,
  uploadLessonContent,
  processUploadedFile,
  handleUploadError,
  isProduction,
};
