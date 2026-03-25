import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../ui/Button';
import { APP_NAME } from '../../../constants';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm" style={{ borderColor: '#e5e7eb' }}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6', textDecoration: 'none' }}>
          ✈️ {APP_NAME}
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <Link to="/items" style={{ textDecoration: 'none', color: '#374151', fontSize: '0.875rem', fontWeight: 500 }}>
                Destinations
              </Link>
              <Link to="/ai-chat" style={{ textDecoration: 'none', color: '#374151', fontSize: '0.875rem', fontWeight: 500 }}>
                🤖 AI Chat
              </Link>
              <Link to="/wishlist" style={{ textDecoration: 'none', color: '#374151', fontSize: '0.875rem', fontWeight: 500 }}>
                Wishlist ❤️
              </Link>
              <Link to="/bookings" style={{ textDecoration: 'none', color: '#374151', fontSize: '0.875rem', fontWeight: 500 }}>
                Bookings
              </Link>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Hello, {user?.name}</span>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  {user?.role === 'admin' ? '🔐 Admin Panel' : 'Dashboard'}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/items" style={{ textDecoration: 'none', color: '#374151', fontSize: '0.875rem', fontWeight: 500 }}>
                Destinations
              </Link>
              <Link to="/ai-chat" style={{ textDecoration: 'none', color: '#374151', fontSize: '0.875rem', fontWeight: 500 }}>
                🤖 AI Chat
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-toggle"
          style={{
            display: 'none',
            padding: '0.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.25rem'
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          display: 'none',
          padding: '1rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: 'white'
        }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280', padding: '0.5rem' }}>Hello, {user?.name}</span>
              <Link to="/items" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#374151', padding: '0.5rem', fontWeight: 500 }}>
                Destinations
              </Link>
              <Link to="/ai-chat" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#374151', padding: '0.5rem', fontWeight: 500 }}>
                🤖 AI Chat
              </Link>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#374151', padding: '0.5rem', fontWeight: 500 }}>
                Wishlist ❤️
              </Link>
              <Link to="/bookings" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#374151', padding: '0.5rem', fontWeight: 500 }}>
                Bookings
              </Link>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" style={{ width: '100%' }}>
                  {user?.role === 'admin' ? '🔐 Admin Panel' : 'Dashboard'}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ width: '100%' }}>
                Logout
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/items" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#374151', padding: '0.5rem', fontWeight: 500 }}>
                Destinations
              </Link>
              <Link to="/ai-chat" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#374151', padding: '0.5rem', fontWeight: 500 }}>
                🤖 AI Chat
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" style={{ width: '100%' }}>Login</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" style={{ width: '100%' }}>Register</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
          .mobile-menu {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
