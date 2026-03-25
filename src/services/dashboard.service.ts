// Dashboard API services
import api from './api';
import type { DashboardStats, DashboardChartData, ApiResponse } from '../types';

export const dashboardService = {
  /**
   * Get dashboard statistics (Admin only)
   */
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  },

  /**
   * Get chart data for analytics (Admin only)
   */
  getChartData: async (): Promise<ApiResponse<DashboardChartData>> => {
    const response = await api.get<ApiResponse<DashboardChartData>>('/dashboard/chart-data');
    return response.data;
  },
};
