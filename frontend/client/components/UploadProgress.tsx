import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export interface UploadProgressData {
  percentage: number;
  uploadedBytes: number;
  totalBytes: number;
  speed: number; // bytes per second
  timeRemaining: number; // seconds
  status: 'uploading' | 'processing' | 'complete' | 'error' | 'cancelled';
  fileName: string;
  error?: string;
}

interface UploadProgressProps {
  upload: UploadProgressData;
  onCancel?: () => void;
  onRetry?: () => void;
  showDetails?: boolean;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  upload,
  onCancel,
  onRetry,
  showDetails = true,
}) => {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatSpeed = (bytesPerSecond: number): string => {
    return `${formatBytes(bytesPerSecond)}/s`;
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusIcon = () => {
    switch (upload.status) {
      case 'uploading':
        return <Upload className="h-4 w-4 animate-pulse" />;
      case 'processing':
        return <Clock className="h-4 w-4 animate-spin" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-gray-500" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (upload.status) {
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (upload.status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'complete':
        return 'Upload Complete';
      case 'error':
        return 'Upload Failed';
      case 'cancelled':
        return 'Upload Cancelled';
      default:
        return 'Ready';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="font-medium text-sm truncate max-w-48">
              {upload.fileName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor()}>
              {getStatusText()}
            </Badge>
            {upload.status === 'uploading' && onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            {upload.status === 'error' && onRetry && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className="h-6 px-2 text-xs"
              >
                Retry
              </Button>
            )}
          </div>
        </div>

        <Progress 
          value={upload.percentage} 
          className="mb-2"
        />

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            {formatBytes(upload.uploadedBytes)} / {formatBytes(upload.totalBytes)}
          </span>
          <span>{upload.percentage.toFixed(1)}%</span>
        </div>

        {showDetails && upload.status === 'uploading' && (
          <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
            <span>Speed: {formatSpeed(upload.speed)}</span>
            <span>ETA: {formatTime(upload.timeRemaining)}</span>
          </div>
        )}

        {upload.status === 'error' && upload.error && (
          <div className="mt-2 text-xs text-red-600">
            Error: {upload.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
