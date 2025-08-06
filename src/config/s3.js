const AWS = require("aws-sdk");

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create S3 instance
const s3 = new AWS.S3();

// S3 bucket name
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// File size limits (in bytes)
const FILE_LIMITS = {
  // Video files (MP4, WebM, etc.)
  video: {
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
    allowedTypes: [
      "video/mp4",
      "video/webm",
      "video/mov",
      "video/avi",
      "video/mkv",
    ],
  },
  // PDF files
  pdf: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ["application/pdf"],
  },
  // Image files (avatars, thumbnails)
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  },
};

// Upload file to S3
const uploadToS3 = async (file, folder = "uploads") => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location; // Return the S3 URL
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload file to S3");
  }
};

// Delete file from S3
const deleteFromS3 = async (fileUrl) => {
  if (!fileUrl || !fileUrl.includes("amazonaws.com")) {
    return; // Not an S3 URL, skip deletion
  }

  const key = fileUrl.split(".com/")[1];
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
    console.log("File deleted from S3:", key);
  } catch (error) {
    console.error("S3 delete error:", error);
  }
};

// Get file size limit based on file type
const getFileSizeLimit = (mimetype) => {
  if (FILE_LIMITS.video.allowedTypes.includes(mimetype)) {
    return FILE_LIMITS.video.maxSize;
  }
  if (FILE_LIMITS.pdf.allowedTypes.includes(mimetype)) {
    return FILE_LIMITS.pdf.maxSize;
  }
  if (FILE_LIMITS.image.allowedTypes.includes(mimetype)) {
    return FILE_LIMITS.image.maxSize;
  }
  return 10 * 1024 * 1024; // Default 10MB
};

// Check if file type is allowed
const isFileTypeAllowed = (mimetype) => {
  const allTypes = [
    ...FILE_LIMITS.video.allowedTypes,
    ...FILE_LIMITS.pdf.allowedTypes,
    ...FILE_LIMITS.image.allowedTypes,
  ];
  return allTypes.includes(mimetype);
};

module.exports = {
  s3,
  BUCKET_NAME,
  FILE_LIMITS,
  uploadToS3,
  deleteFromS3,
  getFileSizeLimit,
  isFileTypeAllowed,
};
