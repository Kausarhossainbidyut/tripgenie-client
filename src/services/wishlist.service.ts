// Wishlist API services
import api from './api';
import type { WishlistItem, ApiResponse } from '../types';

export const wishlistService = {
  /**
   * Add item to wishlist
   */
  addToWishlist: async (itemId: string): Promise<ApiResponse<WishlistItem>> => {
    const response = await api.post<ApiResponse<WishlistItem>>('/wishlist', { itemId });
    return response.data;
  },

  /**
   * Get user's wishlist
   */
  getWishlist: async (): Promise<ApiResponse<WishlistItem[]>> => {
    const response = await api.get<ApiResponse<WishlistItem[]>>('/wishlist');
    return response.data;
  },

  /**
   * Check if item is in wishlist
   */
  checkWishlistStatus: async (itemId: string): Promise<ApiResponse<{ isInWishlist: boolean; wishlistId: string }>> => {
    const response = await api.get<ApiResponse<{ isInWishlist: boolean; wishlistId: string }>>(`/wishlist/check/${itemId}`);
    return response.data;
  },

  /**
   * Remove item from wishlist
   */
  removeFromWishlist: async (wishlistId: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/wishlist/${wishlistId}`);
    return response.data;
  },
};
