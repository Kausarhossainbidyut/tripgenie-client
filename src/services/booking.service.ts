// Bookings API services
import api from './api';
import type { Booking, CreateBookingData, ApiResponse } from '../types';

export const bookingService = {
  /**
   * Create a new booking
   */
  createBooking: async (data: CreateBookingData): Promise<ApiResponse<Booking>> => {
    const response = await api.post<ApiResponse<Booking>>('/bookings', data);
    return response.data;
  },

  /**
   * Get all bookings (Admin sees all, users see their own)
   */
  getAllBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings');
    return response.data;
  },

  /**
   * Get booking by ID
   */
  getBookingById: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Update booking status (Admin only)
   */
  updateBookingStatus: async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<ApiResponse<Booking>> => {
    const response = await api.patch<ApiResponse<Booking>>(`/bookings/${bookingId}`, { status });
    return response.data;
  },

  /**
   * Delete booking (Admin only)
   */
  deleteBooking: async (bookingId: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Cancel booking with automatic stock restore and refund calculation
   */
  cancelBooking: async (bookingId: string, reason?: string): Promise<ApiResponse<{ booking: Booking; refundAmount: number; stockRestored: number }>> => {
    const response = await api.patch<ApiResponse<{ booking: Booking; refundAmount: number; stockRestored: number }>>(`/bookings/${bookingId}/cancel`, { reason });
    return response.data;
  },
};
