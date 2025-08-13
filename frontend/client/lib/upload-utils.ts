import { UploadProgressData } from '@/components/UploadProgress';

export interface FileUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  chunkSize?: number;
}

export const FILE_LIMITS = {
  video: {
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
    allowedTypes: ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/mkv'],
    chunkSize: 5 * 1024 * 1024, // 5MB chunks
  },
  pdf: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['application/pdf'],
    chunkSize: 1 * 1024 * 1024, // 1MB chunks
  },
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    chunkSize: 512 * 1024, // 512KB chunks
  },
};

export const validateFile = (file: File, config: FileUploadConfig): string | null => {
  // Check file size
  if (file.size > config.maxSize) {
    const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(0);
    return `File size exceeds ${maxSizeMB}MB limit`;
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    return `File type ${file.type} is not allowed`;
  }

  return null;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const calculateUploadSpeed = (
  uploadedBytes: number,
  totalBytes: number,
  startTime: number
): number => {
  const elapsedTime = (Date.now() - startTime) / 1000; // seconds
  if (elapsedTime === 0) return 0;
  return uploadedBytes / elapsedTime;
};

export const estimateTimeRemaining = (
  uploadedBytes: number,
  totalBytes: number,
  speed: number
): number => {
  if (speed === 0) return 0;
  const remainingBytes = totalBytes - uploadedBytes;
  return remainingBytes / speed;
};

export const createUploadProgress = (
  file: File,
  uploadedBytes: number = 0,
  status: UploadProgressData['status'] = 'uploading',
  error?: string
): UploadProgressData => {
  const percentage = file.size > 0 ? (uploadedBytes / file.size) * 100 : 0;
  
  return {
    percentage,
    uploadedBytes,
    totalBytes: file.size,
    speed: 0,
    timeRemaining: 0,
    status,
    fileName: file.name,
    error,
  };
};

export const updateUploadProgress = (
  currentProgress: UploadProgressData,
  uploadedBytes: number,
  startTime: number
): UploadProgressData => {
  const speed = calculateUploadSpeed(uploadedBytes, currentProgress.totalBytes, startTime);
  const timeRemaining = estimateTimeRemaining(uploadedBytes, currentProgress.totalBytes, speed);
  const percentage = (uploadedBytes / currentProgress.totalBytes) * 100;

  return {
    ...currentProgress,
    percentage,
    uploadedBytes,
    speed,
    timeRemaining,
  };
};

export const getFileTypeConfig = (file: File): FileUploadConfig => {
  if (FILE_LIMITS.video.allowedTypes.includes(file.type)) {
    return FILE_LIMITS.video;
  }
  if (FILE_LIMITS.pdf.allowedTypes.includes(file.type)) {
    return FILE_LIMITS.pdf;
  }
  if (FILE_LIMITS.image.allowedTypes.includes(file.type)) {
    return FILE_LIMITS.image;
  }
  
  // Default config
  return {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [],
    chunkSize: 1 * 1024 * 1024, // 1MB
  };
};

export const createFormDataWithProgress = (
  file: File,
  additionalData: Record<string, any> = {}
): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add additional data
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  return formData;
};

export const uploadFileWithProgress = async (
  url: string,
  formData: FormData,
  onProgress: (progress: UploadProgressData) => void,
  onCancel?: () => void
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const startTime = Date.now();
    
    // Get file from FormData
    const file = formData.get('file') as File;
    if (!file) {
      reject(new Error('No file found in FormData'));
      return;
    }
    
    // Initialize progress
    let progress: UploadProgressData = createUploadProgress(file);
    onProgress(progress);
    
    // Progress handler
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        progress = updateUploadProgress(progress, event.loaded, startTime);
        onProgress(progress);
      }
    });
    
    // Load handler
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          progress.status = 'complete';
          onProgress(progress);
          resolve(response);
        } catch (error) {
          progress.status = 'error';
          progress.error = 'Invalid response format';
          onProgress(progress);
          reject(new Error('Invalid response format'));
        }
      } else {
        progress.status = 'error';
        progress.error = `Upload failed: ${xhr.status} ${xhr.statusText}`;
        onProgress(progress);
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });
    
    // Error handler
    xhr.addEventListener('error', () => {
      progress.status = 'error';
      progress.error = 'Network error occurred';
      onProgress(progress);
      reject(new Error('Network error occurred'));
    });
    
    // Abort handler
    xhr.addEventListener('abort', () => {
      progress.status = 'cancelled';
      onProgress(progress);
      reject(new Error('Upload cancelled'));
    });
    
    // Set up cancel handler
    if (onCancel) {
      const originalCancel = onCancel;
      onCancel = () => {
        xhr.abort();
        originalCancel();
      };
    }
    
    // Open and send request
    xhr.open('POST', url);
    
    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    
    xhr.send(formData);
  });
};
