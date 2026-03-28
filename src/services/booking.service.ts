// Enhanced Bookings API services with all new features
import api from './api';
import type { Booking, CreateBookingData, ApiResponse } from '../types';

export interface BookingFilters {
  status?: string;
  paymentStatus?: string;
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const bookingService = {
  /**
   * Create a new booking
   */
  createBooking: async (data: CreateBookingData): Promise<ApiResponse<Booking>> => {
    const response = await api.post<ApiResponse<Booking>>('/bookings', data);
    return response.data;
  },

  /**
   * Get all bookings with advanced filters
   */
  getAllBookings: async (filters?: BookingFilters): Promise<ApiResponse<Booking[] | { bookings: Booking[]; total: number; page: number; totalPages: number }>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters?.searchQuery) params.append('searchQuery', filters.searchQuery);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<ApiResponse<Booking[] | { bookings: Booking[]; total: number; page: number; totalPages: number }>>(`/bookings?${params.toString()}`);
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
   * Update payment status (Admin only)
   */
  updatePaymentStatus: async (bookingId: string, paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'): Promise<ApiResponse<Booking>> => {
    const response = await api.patch<ApiResponse<Booking>>(`/bookings/${bookingId}/payment`, { paymentStatus });
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

  /**
   * Bulk update bookings status
   */
  bulkUpdateStatus: async (bookingIds: string[], status: 'pending' | 'confirmed' | 'cancelled'): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.post<ApiResponse<{ count: number }>>('/bookings/bulk/status', { bookingIds, status });
    return response.data;
  },

  /**
   * Bulk delete bookings
   */
  bulkDeleteBookings: async (bookingIds: string[]): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.post<ApiResponse<{ count: number }>>('/bookings/bulk/delete', { bookingIds });
    return response.data;
  },

  /**
   * Export bookings to CSV
   */
  exportToCSV: async (filters?: BookingFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);

    const response = await api.get(`/bookings/export/csv?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data as Blob;
  },

  /**
   * Get booking analytics
   */
  getAnalytics: async (): Promise<ApiResponse<{
    totalRevenue: number;
    totalBookings: number;
    averageBookingValue: number;
    bookingsByStatus: { status: string; count: number }[];
    bookingsByPaymentStatus: { status: string; count: number }[];
    recentBookings: Booking[];
    topDestinations: { itemId: string; title: string; count: number }[];
    monthlyTrend: { month: string; revenue: number; bookings: number }[];
  }>> => {
    const response = await api.get<ApiResponse<any>>('/bookings/analytics');
    return response.data;
  },

  /**
   * Get booking activity timeline
   */
  getActivityTimeline: async (bookingId: string): Promise<ApiResponse<{ action: string; timestamp: string; user: string; details?: any }[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`/bookings/${bookingId}/activity`);
    return response.data;
  },

  /**
   * Send booking confirmation email
   */
  sendConfirmationEmail: async (bookingId: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.post<ApiResponse<{ success: boolean }>>(`/bookings/${bookingId}/email/confirmation`);
    return response.data;
  },
};
