// Users API services
import api from './api';
import type { User, Booking, ApiResponse } from '../types';

export const userService = {
  /**
   * Get all users (Admin only)
   */
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update user information
   */
  updateUser: async (userId: string, updateData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${userId}`, updateData);
    return response.data;
  },

  /**
   * Delete user (Admin only)
   */
  deleteUser: async (userId: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/users/${userId}`);
    return response.data;
  },

  /**
   * Get user bookings
   */
  getUserBookings: async (userId: string): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get<ApiResponse<Booking[]>>(`/users/${userId}/bookings`);
    return response.data;
  },
};
