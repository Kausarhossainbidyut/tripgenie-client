// AI Features API services
import api from './api';
import type { 
  AIChatRequest, 
  AIChatResponse, 
  AIDescriptionRequest, 
  AIDescriptionResponse,
  AIRecommendationsRequest,
  AIRecommendationsResponse,
  AIReviewSummaryRequest,
  AIReviewSummaryResponse,
  ApiResponse 
} from '../types';

export const aiService = {
  /**
   * Chat with AI travel assistant
   */
  chat: async (data: AIChatRequest): Promise<ApiResponse<AIChatResponse>> => {
    const response = await api.post<ApiResponse<AIChatResponse>>('/ai/chat', data);
    return response.data;
  },

  /**
   * Generate description for a destination
   */
  generateDescription: async (data: AIDescriptionRequest): Promise<ApiResponse<AIDescriptionResponse>> => {
    const response = await api.post<ApiResponse<AIDescriptionResponse>>('/ai/generate-description', data);
    return response.data;
  },

  /**
   * Get AI-powered destination recommendations
   */
  getRecommendations: async (data: AIRecommendationsRequest): Promise<ApiResponse<AIRecommendationsResponse>> => {
    const response = await api.post<ApiResponse<AIRecommendationsResponse>>('/ai/recommendations', data);
    return response.data;
  },

  /**
   * Get AI summary of reviews for an item
   */
  getReviewSummary: async (data: AIReviewSummaryRequest): Promise<ApiResponse<AIReviewSummaryResponse>> => {
    const response = await api.post<ApiResponse<AIReviewSummaryResponse>>('/ai/review-summary', data);
    return response.data;
  },
};
