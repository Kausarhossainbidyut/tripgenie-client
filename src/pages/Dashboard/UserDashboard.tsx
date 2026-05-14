import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { bookingService } from '../../services/booking.service';
import { wishlistService } from '../../services/wishlist.service';
import type { Booking, WishlistItem } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('overview');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent bookings
      const bookingsResponse = await bookingService.getAllBookings();
      if (bookingsResponse.success) {
        const data = bookingsResponse.data;
        const bookingsArray = Array.isArray(data) ? data : data.bookings ?? [];
        setRecentBookings(bookingsArray.slice(0, 5)); // Last 5 bookings
      }

      // Fetch wishlist count
      const wishlistResponse = await wishlistService.getWishlist();
      if (wishlistResponse.success) {
        setWishlistCount(wishlistResponse.data.length);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bookings', label: 'My Bookings', icon: '📅' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
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

  return (
    <div style={{ padding: '1rem' }}>
      {/* Welcome Header */}
      <div style={{ 
        marginBottom: '1.5rem',
        padding: '1.5rem',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '0.75rem',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>
          Ready to plan your next adventure?
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <QuickStatCard 
          title="Total Bookings" 
          value={recentBookings.length.toString()} 
          icon="📅"
          onClick={() => setActiveMenu('bookings')}
        />
        <QuickStatCard 
          title="Wishlist Items" 
          value={wishlistCount.toString()} 
          icon="❤️"
          onClick={() => setActiveMenu('wishlist')}
        />
        <QuickStatCard 
          title="Pending" 
          value={recentBookings.filter(b => b.status === 'pending').length.toString()} 
          icon="⏳"
          color="#f59e0b"
        />
        <QuickStatCard 
          title="Completed" 
          value={recentBookings.filter(b => b.status === 'confirmed').length.toString()} 
          icon="✅"
          color="#10b981"
        />
      </div>

      {/* Menu Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '0.5rem'
      }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeMenu === item.id ? '#eff6ff' : 'transparent',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: activeMenu === item.id ? '#3b82f6' : '#6b7280',
              transition: 'all 0.2s',
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      {activeMenu === 'overview' && <OverviewSection bookings={recentBookings} wishlistCount={wishlistCount} />}
      {activeMenu === 'bookings' && <BookingsSection bookings={recentBookings} />}
      {activeMenu === 'wishlist' && <WishlistSection />}
      {activeMenu === 'profile' && <ProfileSection />}
    </div>
  );
}

// Section Components

function OverviewSection({ bookings, wishlistCount }: { bookings: Booking[]; wishlistCount: number }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
        Your Activity Overview
      </h2>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button onClick={() => window.location.href = '/items'}>🌍 Browse Destinations</Button>
          <Button variant="outline" onClick={() => window.location.href = '/ai-chat'}>🤖 Ask AI Assistant</Button>
          <Button variant="outline" onClick={() => window.location.href = '/wishlist'}>❤️ View Wishlist</Button>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
            Recent Bookings
          </h3>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => window.location.href = '/bookings'}
          >
            View All →
          </Button>
        </div>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p style={{ marginBottom: '1rem' }}>No bookings yet</p>
            <Button onClick={() => window.location.href = '/items'}>Start Exploring</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {bookings.slice(0, 3).map((booking) => (
              <div 
                key={booking._id}
                style={{ 
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>
                      {typeof booking.itemId !== 'string' ? booking.itemId.title : 'Destination'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      📍 {typeof booking.itemId !== 'string' ? booking.itemId.location : ''}
                    </p>
                  </div>
                  <span style={{ 
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: booking.status === 'confirmed' ? '#d1fae5' : 
                                   booking.status === 'pending' ? '#fef3c7' : '#fee2e2',
                    color: booking.status === 'confirmed' ? '#059669' : 
                           booking.status === 'pending' ? '#d97706' : '#dc2626',
                  }}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(booking.createdAt!).toLocaleDateString()}
                  </p>
                  <p style={{ fontWeight: 700, color: '#111827' }}>
                    ৳{booking.totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingsSection({ bookings }: { bookings: Booking[] }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
        My Bookings ({bookings.length})
      </h2>
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>View and manage all your trip bookings</p>
        <Button onClick={() => window.location.href = '/bookings'}>Go to Bookings Page</Button>
      </div>
    </div>
  );
}

function WishlistSection() {
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
        My Wishlist
      </h2>
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Your saved favorite destinations</p>
        <Button onClick={() => window.location.href = '/wishlist'}>View Wishlist</Button>
      </div>
    </div>
  );
}

function ProfileSection() {
  const { user } = useAuth();
  
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
        My Profile
      </h2>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'white',
              fontWeight: 700
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>
              {user?.name}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{user?.email}</p>
            <span style={{ 
              marginTop: '0.5rem',
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: '#e5e7eb',
              color: '#374151',
            }}>
              {user?.role || 'User'}
            </span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
            Account Information
          </h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <InfoRow label="Email" value={user?.email || 'N/A'} />
            <InfoRow label="Name" value={user?.name || 'N/A'} />
            <InfoRow label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} />
          </div>
        </div>

        <Button variant="outline" style={{ marginTop: '1.5rem', width: '100%' }}>
          Edit Profile
        </Button>
      </div>
    </div>
  );
}

// Reusable Components

function QuickStatCard({ title, value, icon, onClick, color = '#3b82f6' }: { 
  title: string; 
  value: string; 
  icon: string;
  onClick?: () => void;
  color?: string;
}) {
  return (
    <div 
      className="card" 
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: `4px solid ${color}`,
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{title}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e5e7eb' }}>
      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{label}</span>
      <span style={{ color: '#111827', fontWeight: 500, fontSize: '0.875rem' }}>{value}</span>
    </div>
  );
}
