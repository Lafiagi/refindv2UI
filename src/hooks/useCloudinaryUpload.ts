import { useState, useCallback } from 'react';
import { uploadToCloudinary } from '../utils/cloudinary';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: {
    public_id: string;
    url: string;
    secure_url: string;
  } | null;
}

interface UseCloudinaryUploadOptions {
  folder?: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export const useCloudinaryUpload = (options: UseCloudinaryUploadOptions = {}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    result: null,
  });

  const uploadImage = useCallback(async (file: File) => {
    try {
      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        result: null,
      });

      // Simulate progress (Cloudinary doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 100);

      const result = await uploadToCloudinary(file, options.folder);

      clearInterval(progressInterval);

      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        result,
      });

      options.onSuccess?.(result);
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        result: null,
      });

      options.onError?.(errorMessage);
      throw error;
    }
  }, [options]);

  const uploadMultiple = useCallback(async (files: File[]) => {
    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        const result = await uploadImage(file);
        results.push(result);
      } catch (error) {
        errors.push({ file: file.name, error });
      }
    }

    return { results, errors };
  }, [uploadImage]);

  const reset = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...uploadState,
    uploadImage,
    uploadMultiple,
    reset,
  };
};

export default useCloudinaryUpload;