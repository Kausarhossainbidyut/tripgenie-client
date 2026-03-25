import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardStats } from '../types';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'items', label: 'Destinations', icon: '🌍' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
  ];

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    setSidebarOpen(false);
    // Navigate to respective pages
    if (menuId === 'items') window.location.href = '/items';
    else if (menuId === 'bookings') window.location.href = '/bookings';
    else if (menuId === 'wishlist') window.location.href = '/wishlist';
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', position: 'relative' }}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '80px',
          left: '1rem',
          zIndex: 100,
          padding: '0.5rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          display: 'none'
        }}
        className="mobile-menu-btn"
      >
        ☰
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 40,
            display: 'none'
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease'
        }}
        className="dashboard-sidebar"
      >
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Welcome back,</p>
          <p style={{ fontWeight: 600, color: '#111827' }}>{user?.name}</p>
        </div>

        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: activeMenu === item.id ? '#eff6ff' : 'transparent',
                color: activeMenu === item.id ? '#3b82f6' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <Button variant="outline" onClick={logout} style={{ width: '100%' }}>
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '1rem', backgroundColor: '#f9fafb' }} className="dashboard-main">
        {activeMenu === 'dashboard' && (
          <DashboardContent stats={stats} loading={loading} />
        )}
        {activeMenu === 'items' && <ItemsContent />}
        {activeMenu === 'bookings' && <BookingsContent />}
        {activeMenu === 'wishlist' && <WishlistContent />}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .sidebar-overlay {
            display: block !important;
          }
          .dashboard-sidebar {
            position: fixed;
            left: 0;
            top: 64px;
            bottom: 0;
            z-index: 50;
            transform: translateX(${sidebarOpen ? '0' : '-100%'});
            box-shadow: 2px 0 8px rgba(0,0,0,0.1);
          }
          .dashboard-main {
            padding-left: 4rem !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1023px) {
          .dashboard-sidebar {
            width: 200px;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

function DashboardContent({ stats, loading }: { stats: DashboardStats | null; loading: boolean }) {
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
    <div>
      <h1 style={{ 
        fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', 
        fontWeight: 700, 
        color: '#111827', 
        marginBottom: '1.5rem' 
      }}>
        Dashboard Overview
      </h1>

      {stats ? (
        <>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            marginBottom: '2rem' 
          }}>
            <StatCard title="Total Destinations" value={stats.totalItems.toString()} />
            <StatCard title="Total Bookings" value={stats.totalBookings.toString()} />
            <StatCard title="Pending Bookings" value={stats.pendingBookings.toString()} />
            <StatCard title="Total Revenue" value={`৳${stats.totalRevenue}`} />
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            <h2 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>
              Welcome to Your Dashboard!
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Manage your travel destinations, bookings, and wishlist all in one place. Use the sidebar menu to navigate between different sections.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <ActivityItem text="Explore amazing destinations" time="Always available" />
              <ActivityItem text="Book your dream trips" time="Instant booking" />
              <ActivityItem text="Save favorites to wishlist" time="Easy access" />
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <p style={{ color: '#6b7280', textAlign: 'center' }}>
            Loading dashboard data...
          </p>
        </div>
      )}
    </div>
  );
}

function UsersContent() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
        Users
      </h1>
      <div className="card">
        <p style={{ color: '#6b7280' }}>User management content goes here...</p>
      </div>
    </div>
  );
}

function AnalyticsContent() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
        Analytics
      </h1>
      <div className="card">
        <p style={{ color: '#6b7280' }}>Analytics content goes here...</p>
      </div>
    </div>
  );
}

function SettingsContent() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
        Settings
      </h1>
      <div className="card">
        <p style={{ color: '#6b7280' }}>Settings content goes here...</p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="card">
      <p className="text-sm" style={{ color: '#6b7280' }}>{title}</p>
      <p className="text-2xl font-bold" style={{ color: '#111827' }}>{value}</p>
    </div>
  );
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
      <span style={{ color: '#374151' }}>{text}</span>
      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{time}</span>
    </div>
  );
}

function ItemsContent() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
        Destinations
      </h1>
      <div className="card">
        <p style={{ color: '#6b7280' }}>Navigate to the Destinations page to manage all travel destinations.</p>
        <Button onClick={() => window.location.href = '/items'} style={{ marginTop: '1rem' }}>
          Go to Destinations
        </Button>
      </div>
    </div>
  );
}

function BookingsContent() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
        My Bookings
      </h1>
      <div className="card">
        <p style={{ color: '#6b7280' }}>View and manage all your trip bookings.</p>
        <Button onClick={() => window.location.href = '/bookings'} style={{ marginTop: '1rem' }}>
          View Bookings
        </Button>
      </div>
    </div>
  );
}

function WishlistContent() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
        My Wishlist
      </h1>
      <div className="card">
        <p style={{ color: '#6b7280' }}>Your saved favorite destinations are here.</p>
        <Button onClick={() => window.location.href = '/wishlist'} style={{ marginTop: '1rem' }}>
          View Wishlist
        </Button>
      </div>
    </div>
  );
}
