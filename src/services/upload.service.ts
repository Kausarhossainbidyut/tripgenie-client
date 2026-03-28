// File Upload API services
import api from './api';
import type { UploadResponse, ApiResponse } from '../types';
import axios from 'axios';

// Backend response interface for file uploads
interface UploadApiResponse {
  success: boolean;
  message: string;
  file?: UploadResponse;  // Backend returns 'file' not 'data'
  files?: UploadResponse[]; // For multiple uploads
}

export const uploadService = {
  /**
   * Upload single profile image
   * Endpoint: POST /api/v1/upload/profile
   */
  uploadProfileImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('profile', file);

    const response = await api.post<UploadApiResponse>('/v1/upload/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (!response.data.file || !response.data.file.url) {
      throw new Error('Upload failed - no file URL returned');
    }
    
    return response.data.file;
  },

  /**
   * Upload multiple travel images (up to 5 files)
   * Endpoint: POST /api/v1/upload/travel-images
   */
  uploadTravelImages: async (files: File[]): Promise<UploadResponse[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post<UploadApiResponse>('/v1/upload/travel-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (!response.data.files || !Array.isArray(response.data.files)) {
      throw new Error('Upload failed - no files returned');
    }
    
    return response.data.files;
  },

  /**
   * Upload single item/destination image
   * Uses the same endpoint as profile upload but for item images
   * Endpoint: POST /api/v1/upload/profile
   */
  uploadItemImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('profile', file); // Using 'profile' field as per backend

    try {
      const response = await api.post<UploadApiResponse>('/v1/upload/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Raw upload response:', response);
      console.log('Response file data:', response.data.file);
      
      if (!response.data.file || !response.data.file.url) {
        throw new Error('Upload failed - no URL returned from server');
      }
      
      return response.data.file;
    } catch (error: any) {
      console.error('Upload error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  /**
   * Upload gallery images (multiple images for item gallery)
   * Endpoint: POST /api/v1/upload/travel-images
   */
  uploadItemGallery: async (files: File[]): Promise<UploadResponse[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post<UploadApiResponse>('/v1/upload/travel-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (!response.data.files || !Array.isArray(response.data.files)) {
      throw new Error('Upload failed - no files returned');
    }
    
    return response.data.files;
  },

  /**
   * Delete uploaded image using delete_url
   * Endpoint: DELETE /api/v1/upload/delete?delete_url=...
   */
  deleteImage: async (deleteUrl: string): Promise<UploadApiResponse> => {
    const response = await api.delete<UploadApiResponse>(`/v1/upload/delete?delete_url=${encodeURIComponent(deleteUrl)}`);
    return response.data;
  },

  /**
   * Bulk delete multiple images
   * Deletes multiple images by their delete_urls
   */
  bulkDeleteImages: async (deleteUrls: string[]): Promise<UploadApiResponse[]> => {
    const promises = deleteUrls.map(url => this.deleteImage(url));
    return await Promise.all(promises);
  },
};
