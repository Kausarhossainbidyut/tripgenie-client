// Authentication API services
import api from './api';
import type { User, LoginCredentials, RegisterData, ApiResponse } from '../types';

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/auth/register', data);
    return response.data;
  },

  /**
   * Login user and store tokens
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
    const response = await api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/reset-password', { token, newPassword });
    return response.data;
  },
};
