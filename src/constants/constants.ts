// Application constants

export const APP_NAME = 'TripGenie';
export const APP_VERSION = '1.0.0';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ITEMS: '/items',
  BOOKINGS: '/bookings',
  WISHLIST: '/wishlist',
  PROFILE: '/profile',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

export const API_URL = 'http://localhost:5000/api';
