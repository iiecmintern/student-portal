// File upload utilities for handling large files and S3 uploads

// File size limits (in bytes)
export const FILE_LIMITS = {
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
    label: "2GB",
  },
  // PDF files
  pdf: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ["application/pdf"],
    label: "100MB",
  },
  // Image files (avatars, thumbnails)
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    label: "10MB",
  },
};

// Get file size limit based on file type
export const getFileSizeLimit = (mimetype: string): number => {
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
export const isFileTypeAllowed = (mimetype: string): boolean => {
  const allTypes = [
    ...FILE_LIMITS.video.allowedTypes,
    ...FILE_LIMITS.pdf.allowedTypes,
    ...FILE_LIMITS.image.allowedTypes,
  ];
  return allTypes.includes(mimetype);
};

// Validate file before upload
export const validateFile = (
  file: File,
): { isValid: boolean; error?: string } => {
  // Check file type
  if (!isFileTypeAllowed(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Supported types: ${Object.values(
        FILE_LIMITS,
      )
        .map((limit) => limit.allowedTypes.join(", "))
        .join(", ")}`,
    };
  }

  // Check file size
  const maxSize = getFileSizeLimit(file.type);
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  return { isValid: true };
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Get upload progress for large files
export const createUploadProgressHandler = (
  onProgress: (progress: number) => void,
) => {
  return (progressEvent: any) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total,
    );
    onProgress(percentCompleted);
  };
};

// Create FormData with proper headers for large files
export const createUploadFormData = (
  file: File,
  additionalData?: Record<string, any>,
) => {
  const formData = new FormData();
  formData.append("file", file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  return formData;
};

// Upload file with progress tracking
export const uploadFileWithProgress = async (
  url: string,
  file: File,
  token: string,
  onProgress?: (progress: number) => void,
  additionalData?: Record<string, any>,
) => {
  const formData = createUploadFormData(file, additionalData);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: onProgress
      ? createUploadProgressHandler(onProgress)
      : undefined,
    timeout: 300000, // 5 minutes timeout for large files
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
};
