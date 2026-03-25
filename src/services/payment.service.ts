// Payment API services
import api from './api';
import type { PaymentIntentRequest, PaymentIntentResponse, PaymentStatus, ApiResponse } from '../types';

export const paymentService = {
  /**
   * Create Stripe payment intent
   */
  createPaymentIntent: async (data: PaymentIntentRequest): Promise<ApiResponse<PaymentIntentResponse>> => {
    const response = await api.post<ApiResponse<PaymentIntentResponse>>('/payments/create-intent', data);
    return response.data;
  },

  /**
   * Confirm payment after successful Stripe payment
   */
  confirmPayment: async (paymentIntentId: string): Promise<ApiResponse<{ booking: any; paymentStatus: string }>> => {
    const response = await api.post<ApiResponse<{ booking: any; paymentStatus: string }>>('/payments/confirm', { paymentIntentId });
    return response.data;
  },

  /**
   * Get payment status for a booking
   */
  getPaymentStatus: async (bookingId: string): Promise<ApiResponse<PaymentStatus>> => {
    const response = await api.get<ApiResponse<PaymentStatus>>(`/payments/status/${bookingId}`);
    return response.data;
  },

  /**
   * Process refund for a paid booking (Admin only)
   */
  processRefund: async (bookingId: string): Promise<ApiResponse<{ booking: any; refundId: string; refundAmount: number; status: string }>> => {
    const response = await api.post<ApiResponse<{ booking: any; refundId: string; refundAmount: number; status: string }>>('/payments/refund', { bookingId });
    return response.data;
  },
};
