// Items/Destinations API services
import api from './api';
import type { Item, ItemFilters, PaginationInfo, ApiResponse } from '../types';

export const itemService = {
  /**
   * Create a new item/destination
   */
  createItem: async (itemData: Partial<Item>): Promise<ApiResponse<Item>> => {
    const response = await api.post<ApiResponse<Item>>('/items', itemData);
    return response.data;
  },

  /**
   * Get all items with search, filter, sort, and pagination
   */
  getAllItems: async (filters?: ItemFilters): Promise<ApiResponse<Item[] & { pagination?: PaginationInfo }>> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priceMin) params.append('priceMin', filters.priceMin.toString());
    if (filters?.priceMax) params.append('priceMax', filters.priceMax.toString());
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<ApiResponse<Item[] & { pagination?: PaginationInfo }>>(`/items?${params.toString()}`);
    return response.data;
  },

  /**
   * Get item by ID
   */
  getItemById: async (itemId: string): Promise<ApiResponse<Item>> => {
    const response = await api.get<ApiResponse<Item>>(`/items/${itemId}`);
    return response.data;
  },

  /**
   * Update item information
   */
  updateItem: async (itemId: string, updateData: Partial<Item>): Promise<ApiResponse<Item>> => {
    const response = await api.patch<ApiResponse<Item>>(`/items/${itemId}`, updateData);
    return response.data;
  },

  /**
   * Delete item
   */
  deleteItem: async (itemId: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/items/${itemId}`);
    return response.data;
  },
};
