import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, Login, Register, Dashboard } from '../pages';
import { Items } from '../pages/Items/Items';
import { ItemDetail } from '../pages/Items/ItemDetail';
import { Reviews } from '../pages/Reviews/Reviews';
import { Wishlist } from '../pages/Wishlist/Wishlist';
import { Bookings } from '../pages/Bookings/Bookings';
import { AIChat } from '../pages/AIChat/AIChat';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height: '100vh' }}>
        <div className="animate-spin" style={{ 
          width: '2rem', 
          height: '2rem', 
          borderRadius: '50%', 
          border: '4px solid #3b82f6',
          borderTopColor: 'transparent'
        }} />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/items" element={<Items />} />
      <Route path="/items/:itemId" element={<ItemDetail />} />
      <Route path="/items/:itemId/reviews" element={<Reviews />} />
      <Route
        path="/wishlist"
        element={
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <PrivateRoute>
            <Bookings />
          </PrivateRoute>
        }
      />
      <Route path="/ai-chat" element={<AIChat />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
