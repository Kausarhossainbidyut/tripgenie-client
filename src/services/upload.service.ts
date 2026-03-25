// File Upload API services
import api from './api';
import type { UploadResponse, ApiResponse } from '../types';

export const uploadService = {
  /**
   * Upload single profile image
   */
  uploadProfileImage: async (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append('profile', file);

    const response = await api.post<ApiResponse<UploadResponse>>('/v1/upload/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Upload multiple travel images
   */
  uploadTravelImages: async (files: File[]): Promise<ApiResponse<UploadResponse[]>> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post<ApiResponse<UploadResponse[]>>('/v1/upload/travel-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete uploaded image using delete_url
   */
  deleteImage: async (deleteUrl: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/v1/upload/delete?delete_url=${encodeURIComponent(deleteUrl)}`);
    return response.data;
  },
};
