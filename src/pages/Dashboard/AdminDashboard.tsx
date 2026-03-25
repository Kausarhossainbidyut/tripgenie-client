import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { dashboardService } from '../../services/dashboard.service';
import { userService } from '../../services/user.service';
import type { DashboardStats, DashboardChartData, User } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<DashboardChartData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('overview');

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/dashboard');
      return;
    }
    
    fetchDashboardData();
    fetchUsers();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsResponse = await dashboardService.getStats();
      const chartResponse = await dashboardService.getChartData();
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      if (chartResponse.success) {
        setChartData(chartResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'bookings', label: 'All Bookings', icon: '📅' },
    { id: 'items', label: 'Destinations', icon: '🌍' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
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
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem' 
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>
            🔐 Admin Dashboard
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Manage your entire TripGenie platform
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Switch to User View
        </Button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers.toString()} 
            icon="👥"
            color="#3b82f6"
          />
          <StatCard 
            title="Total Destinations" 
            value={stats.totalItems.toString()} 
            icon="🌍"
            color="#10b981"
          />
          <StatCard 
            title="Total Bookings" 
            value={stats.totalBookings.toString()} 
            icon="📅"
            color="#f59e0b"
          />
          <StatCard 
            title="Total Revenue" 
            value={`৳${stats.totalRevenue.toLocaleString()}`} 
            icon="💰"
            color="#8b5cf6"
          />
          <StatCard 
            title="Pending Bookings" 
            value={stats.pendingBookings.toString()} 
            icon="⏳"
            color="#ef4444"
          />
          <StatCard 
            title="Confirmed Bookings" 
            value={stats.confirmedBookings.toString()} 
            icon="✅"
            color="#059669"
          />
        </div>
      )}

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
      {activeMenu === 'overview' && <OverviewSection stats={stats} chartData={chartData} />}
      {activeMenu === 'users' && <UsersSection users={users} user={user} onRefresh={fetchUsers} />}
      {activeMenu === 'bookings' && <BookingsSection />}
      {activeMenu === 'items' && <ItemsSection />}
      {activeMenu === 'revenue' && <RevenueSection stats={stats} chartData={chartData} />}
    </div>
  );
}

// Section Components

function OverviewSection({ stats, chartData }: { stats: DashboardStats | null; chartData: DashboardChartData | null }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
        Platform Overview
      </h2>
      
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button size="sm">Manage Users</Button>
          <Button size="sm" variant="outline">View All Bookings</Button>
          <Button size="sm" variant="outline">Manage Destinations</Button>
          <Button size="sm" variant="outline">Generate Report</Button>
        </div>
      </div>

      {chartData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
              Bookings by Status
            </h3>
            {chartData.bookingsByStatus.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: index < chartData.bookingsByStatus.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                <span style={{ textTransform: 'capitalize', color: '#374151' }}>{item._id as string}</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{item.count}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
              Users by Role
            </h3>
            {chartData.usersByRole.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: index < chartData.usersByRole.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                <span style={{ textTransform: 'capitalize', color: '#374151' }}>{item._id as string}</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UsersSection({ users, user, onRefresh }: { users: User[]; user: User | null; onRefresh: () => void }) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    // Prevent admin from changing their own role
    if (userId === user?._id) {
      alert('You cannot change your own role. Please ask another admin to do this.');
      return;
    }

    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    console.log('Changing role for user:', userId, 'to:', newRole);
    
    try {
      setDeleteLoading(true);
      const response = await userService.updateUser(userId, { role: newRole });
      console.log('Response:', response);
      
      if (response.success) {
        alert(`User role changed to ${newRole} successfully!`);
        onRefresh();
      } else {
        alert(response.message || 'Failed to update user role');
      }
    } catch (err: any) {
      console.error('Role change error:', err);
      alert(err.response?.data?.message || err.message || 'Failed to update user role');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleteLoading(true);
      const response = await userService.deleteUser(userId);
      if (response.success) {
        alert('User deleted successfully');
        setIsDeleteConfirmOpen(null);
        window.location.reload();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
        User Management ({users.length} users)
      </h2>
      
      <div className="card">
        {users.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No users found</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem', color: '#111827' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {user.avatar && (
                          <img src={user.avatar} alt={user.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                        )}
                        {user.name}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#6b7280' }}>{user.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <select
                        value={user.role === 'admin' ? 'admin' : 'user'}
                        onChange={(e) => handleRoleChange(user._id!, e.target.value as 'user' | 'admin')}
                        disabled={deleteLoading}
                        style={{
                          padding: '0.375rem 0.5rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #d1d5db',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: user.role === 'admin' ? '#dbeafe' : '#f3f4f6',
                          color: user.role === 'admin' ? '#1e40af' : '#374151',
                          cursor: deleteLoading ? 'not-allowed' : 'pointer',
                          outline: 'none',
                        }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setIsDeleteConfirmOpen(user._id)}
                        disabled={deleteLoading}
                        style={{ color: '#dc2626', borderColor: '#dc2626' }}
                      >
                        {deleteLoading ? '...' : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>
              Confirm Deletion
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteConfirmOpen(null)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleDeleteUser(isDeleteConfirmOpen)}
                disabled={deleteLoading}
                style={{ backgroundColor: '#dc2626' }}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingsSection() {
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
        All Bookings Management
      </h2>
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Navigate to bookings page to manage all bookings</p>
        <Button onClick={() => window.location.href = '/bookings'}>View All Bookings</Button>
      </div>
    </div>
  );
}

function ItemsSection() {
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
        Destinations Management
      </h2>
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Manage all travel destinations</p>
        <Button onClick={() => window.location.href = '/items'}>Manage Destinations</Button>
      </div>
    </div>
  );
}

function RevenueSection({ stats, chartData }: { stats: DashboardStats | null; chartData: DashboardChartData | null }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
        Revenue Analytics
      </h2>
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '3rem', fontWeight: 700, color: '#10b981', marginBottom: '0.5rem' }}>
            ৳{stats?.totalRevenue.toLocaleString() || '0'}
          </p>
          <p style={{ color: '#6b7280' }}>Total Revenue</p>
        </div>
        
        {chartData && chartData.bookingsByMonth.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
              Monthly Revenue Trend
            </h3>
            {chartData.bookingsByMonth.slice(-6).map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#374151' }}>
                  {typeof item._id === 'object' ? `Month ${item._id.month}/${item._id.year}` : item._id}
                </span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>৳{item.revenue?.toLocaleString() || '0'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  return (
    <div className="card" style={{ 
      borderLeft: `4px solid ${color}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', fontSize: '4rem', opacity: 0.1 }}>
        {icon}
      </div>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{title}</p>
      <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{value}</p>
    </div>
  );
}
