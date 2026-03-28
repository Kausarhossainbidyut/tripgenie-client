// TypeScript type definitions

export interface User {
  _id?: string;
  id?: string;
  email: string;
  name: string;
  role?: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    zipCode?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  avatar?: string;
}

// Item/Destination types
export interface Item {
  _id?: string;
  title: string;
  description: string;
  image: string;
  gallery?: string[]; // Multiple images array (backend field name)
  images?: string[]; // Alias for backward compatibility
  price: number;
  rating?: number;
  location: string;
  category: string;
  quantity: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemFilters {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Booking types
export interface Booking {
  _id?: string;
  userId: string;
  itemId: string | Item; // Can be string (backend reference) or populated Item object
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  refundStatus?: 'none' | 'pending' | 'completed';
  refundAmount?: number;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingData {
  itemId: string;
  quantity: number;
}

// Review types
export interface Review {
  _id?: string;
  rating: number;
  comment: string;
  userId: string | User;
  itemId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewData {
  rating: number;
  comment: string;
  itemId: string;
}

// Wishlist types
export interface WishlistItem {
  _id?: string;
  userId: string;
  itemId: string | Item;
  createdAt?: string;
  updatedAt?: string;
}

// AI types
export interface AIChatRequest {
  message: string;
}

export interface AIChatResponse {
  reply: string;
  userMessage: string;
}

export interface AIDescriptionRequest {
  title: string;
}

export interface AIDescriptionResponse {
  title: string;
  description: string;
}

export interface AIRecommendationsRequest {
  budget?: number;
  location?: string;
  preferences?: string;
}

export interface AIRecommendationsResponse {
  budget?: number;
  location?: string;
  preferences?: string;
  recommendations: string;
}

export interface AIReviewSummaryRequest {
  itemId: string;
}

export interface AIReviewSummaryResponse {
  itemId: string;
  itemTitle: string;
  totalReviews: number;
  averageRating: string;
  summary: string;
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  totalItems: number;
  totalBookings: number;
  totalReviews: number;
  totalRevenue: number;
  pendingBookings: number;
  confirmedBookings: number;
}

export interface ChartDataItem {
  _id: { year?: number; month?: number } | string;
  count: number;
  revenue?: number;
}

export interface DashboardChartData {
  bookingsByMonth: ChartDataItem[];
  bookingsByStatus: ChartDataItem[];
  usersByRole: ChartDataItem[];
  itemsByCategory: ChartDataItem[];
}

// File upload types
export interface UploadResponse {
  url: string;
  delete_url: string;
  thumb_url: string;
  filename: string;
  size: number;
  mimetype: string;
}

// Payment types
export interface PaymentIntentRequest {
  bookingId: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface PaymentStatus {
  bookingId: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentIntentId?: string;
  totalPrice: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}
