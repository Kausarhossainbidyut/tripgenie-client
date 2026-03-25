// Reviews API services
import api from './api';
import type { Review, CreateReviewData, ApiResponse } from '../types';

export const reviewService = {
  /**
   * Create a new review
   */
  createReview: async (data: CreateReviewData): Promise<ApiResponse<Review>> => {
    const response = await api.post<ApiResponse<Review>>('/reviews', data);
    return response.data;
  },

  /**
   * Get reviews by item ID
   */
  getReviewsByItem: async (itemId: string): Promise<ApiResponse<Review[]>> => {
    const response = await api.get<ApiResponse<Review[]>>(`/reviews/item/${itemId}`);
    return response.data;
  },

  /**
   * Delete review (owner or admin only)
   */
  deleteReview: async (reviewId: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/reviews/${reviewId}`);
    return response.data;
  },
};
