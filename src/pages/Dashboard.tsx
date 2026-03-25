import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    setSidebarOpen(false);
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
        {activeMenu === 'dashboard' && <DashboardContent />}
        {activeMenu === 'users' && <UsersContent />}
        {activeMenu === 'analytics' && <AnalyticsContent />}
        {activeMenu === 'settings' && <SettingsContent />}
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

function DashboardContent() {
  return (
    <div>
      <h1 style={{ 
        fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', 
        fontWeight: 700, 
        color: '#111827', 
        marginBottom: '1.5rem' 
      }}>
        Dashboard
      </h1>

      <div style={{ 
        display: 'grid', 
        gap: '1rem', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        marginBottom: '2rem' 
      }}>
        <StatCard title="Total Users" value="1,234" />
        <StatCard title="Active Sessions" value="56" />
        <StatCard title="Revenue" value="$12,345" />
        <StatCard title="Growth" value="+23%" />
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <h2 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>
          Recent Activity
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <ActivityItem text="New user registered" time="2m ago" />
          <ActivityItem text="Payment received" time="15m ago" />
          <ActivityItem text="New order placed" time="1h ago" />
          <ActivityItem text="User updated profile" time="3h ago" />
        </div>
      </div>
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
