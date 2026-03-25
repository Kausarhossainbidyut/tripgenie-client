# 🚀 TripGenie Client - Quick Start Guide

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js installed (v18 or higher)
- ✅ Backend server running on `http://localhost:5000`
- ✅ All dependencies installed

---

## 📦 Installation

### 1. Install Dependencies

```bash
cd tripgenie-client
npm install
```

This will install:
- React 18
- React Router DOM
- Axios
- TypeScript
- Vite
- Tailwind CSS
- And other required dependencies

---

## 🏃‍♂️ Running the Application

### Step 1: Start Backend Server

First, make sure your backend is running:

```bash
cd ../tripgenie-backend
npm run dev
```

The backend should be running on: **http://localhost:5000**

### Step 2: Start Frontend Client

In a new terminal:

```bash
cd tripgenie-client
npm run dev
```

The frontend will start on: **http://localhost:5173** (or another port if 5173 is busy)

---

## 🎯 Testing the Application

### 1. Create an Account

1. Navigate to `http://localhost:5173`
2. Click "Get Started" or go to `/register`
3. Fill in the registration form:
   - Name: Your full name
   - Email: Valid email address
   - Password: At least 6 characters
4. Click "Create Account"
5. You'll be redirected to login

### 2. Login

1. Go to `/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the dashboard

### 3. Explore Destinations

1. Click "Destinations" in the navbar
2. Browse all available destinations
3. Use search and filters to find specific places
4. Try creating a new destination:
   - Click "Add New Destination"
   - Fill in the form
   - Submit

### 4. Use Wishlist

1. While browsing destinations, click "Add to Wishlist" (you'll need to implement this button)
2. Go to "Wishlist ❤️" from navbar
3. View your saved destinations
4. Book directly from wishlist or remove items

### 5. Make a Booking

1. Go to any destination
2. Click "Book Now"
3. View your bookings in "Bookings" section
4. Cancel a booking if needed (with reason)

### 6. Dashboard

1. Go to Dashboard from navbar
2. View real-time statistics:
   - Total destinations
   - Total bookings
   - Pending bookings
   - Total revenue

---

## 🔧 Configuration

### Environment Variables

If you need to change the API URL, update:

`src/constants/constants.ts`

```typescript
export const API_URL = 'http://localhost:5000/api';
```

For production, change this to your backend URL.

---

## 📱 Features Overview

### Public Routes (No Login Required)
- Home page
- Destinations browse
- Login
- Register

### Protected Routes (Login Required)
- Wishlist
- Bookings
- Dashboard
- Create/Edit/Delete operations

---

## 🐛 Troubleshooting

### Backend Not Responding

**Error**: "Network Error" or CORS issues

**Solution**:
1. Check if backend is running: `http://localhost:5000`
2. Verify CORS is enabled in backend
3. Check console for error messages

### Login Fails

**Error**: "Invalid credentials" when credentials are correct

**Solution**:
1. Verify backend database has users
2. Check JWT_SECRET in backend .env matches
3. Clear localStorage and try again

### Token Issues

**Error**: Constant logouts or 401 errors

**Solution**:
1. Check token refresh endpoint is working
2. Verify JWT_EXPIRES_IN in backend config
3. Clear browser cache and localStorage

### Port Already in Use

**Error**: EADDRINUSE - Port 5173 already in use

**Solution**:
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change Vite port in vite.config.ts
server: { port: 3000 }
```

---

## 📊 Sample Test Data

### Create a Test Destination

Use this sample data to create your first destination:

```json
{
  "title": "Cox's Bazar Beach",
  "description": "World's longest natural sea beach with beautiful sunsets",
  "image": "https://example.com/coxs-bazar.jpg",
  "price": 5000,
  "rating": 4.5,
  "location": "Cox's Bazar, Bangladesh",
  "category": "Beach",
  "quantity": 10
}
```

### Test User Account

If your backend has seed data:
- Email: `test@example.com`
- Password: `123456`

Or register a new account!

---

## 🎨 UI Components Used

- **Button** - Reusable button component
- **Input** - Form input with label and error
- **Card** - Card container for content
- **Navbar** - Responsive navigation bar
- **Footer** - Page footer

---

## 📝 Code Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context (Auth)
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── routes/         # Route configuration
├── services/       # API service layer
├── types/          # TypeScript types
├── utils/          # Utility functions
└── constants/      # App constants
```

---

## 🔐 Authentication Flow

1. **Register** → Creates account in backend
2. **Login** → Receives access & refresh tokens
3. **Store** → Tokens saved in localStorage
4. **Auto-refresh** → Access token refreshed automatically
5. **Logout** → Tokens cleared, redirect to login

---

## 🌟 Key Features

### Search & Filter
- Search by title/description
- Filter by category
- Price range filter
- Sort by price or rating

### Pagination
- Configurable items per page
- Previous/Next navigation
- Page numbers display

### Booking System
- Instant booking creation
- Automatic price calculation
- Status tracking (pending/confirmed/cancelled)
- Cancellation with refund

### Wishlist
- Save favorite destinations
- Quick access to liked items
- Book directly from wishlist

---

## 📞 Need Help?

1. Check browser console for errors
2. Verify backend logs
3. Review API documentation
4. Check network tab for failed requests

---

## 🎉 Enjoy Using TripGenie!

Your AI-powered travel companion is ready to use. Start exploring amazing destinations today! ✈️🌍

---

**Last Updated**: March 25, 2026  
**Version**: 1.0.0
