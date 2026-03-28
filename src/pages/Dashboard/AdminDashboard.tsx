import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { dashboardService } from '../../services/dashboard.service';
import { userService } from '../../services/user.service';
import type { DashboardStats, DashboardChartData, User } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { AdminItemsManagement } from '../Admin/ItemsManagement';
import { alert } from '../../utils/sweetAlert';
import { FiUsers, FiCalendar, FiMapPin, FiDollarSign, FiBarChart2, FiEdit2, FiTrash2, FiTrendingUp, FiActivity, FiCheckCircle, FiClock, FiArrowUpRight, FiShield, FiGlobe } from 'react-icons/fi';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

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
      alert.warning('Access denied', 'Admin only.');
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
      <div style={{ padding: '2rem', minHeight: 'calc(100vh - 100px)' }}>
        {/* Dashboard Skeleton */}
        <LoadingSkeleton height={120} className="mb-8" />
        
        {/* Stats Grid Skeleton */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <LoadingSkeleton height={48} width={48} variant="circular" />
                <LoadingSkeleton height={20} width={120} />
              </div>
              <LoadingSkeleton height={40} width={80} className="mb-2" />
              <LoadingSkeleton height={16} width={100} />
            </div>
          ))}
        </div>

        {/* Menu Tabs Skeleton */}
        <LoadingSkeleton height={60} className="mb-8" />
        
        {/* Content Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card">
              <LoadingSkeleton height={24} width={160} className="mb-4" />
              <LoadingSkeleton height={16} count={5} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 100px)',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
      padding: '2rem'
    }}>
      {/* Modern Header */}
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-2rem',
            right: '-2rem',
            width: '10rem',
            height: '10rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-1rem',
            left: '-1rem',
            width: '6rem',
            height: '6rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <FiShield size={32} color="#ffffff" />
                  </div>
                  <div>
                    <h1 style={{ 
                      fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                      fontWeight: 800, 
                      color: '#ffffff',
                      margin: 0,
                      letterSpacing: '-0.02em'
                    }}>
                      Admin Dashboard
                    </h1>
                    <p style={{ 
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.95rem',
                      margin: '0.25rem 0 0 0'
                    }}>
                      Welcome back, {user?.name || 'Admin'}! Manage your platform
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  border: '2px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 600,
                  padding: '0.75rem 1.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                }}
              >
                👤 Switch to User View
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      {stats && (
        <div style={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <ModernStatCard 
            title="Total Users" 
            value={stats.totalUsers.toString()} 
            icon={<FiUsers size={28} />}
            gradient={['#667eea', '#764ba2']}
            trend="+12% from last month"
          />
          <ModernStatCard 
            title="Total Destinations" 
            value={stats.totalItems.toString()} 
            icon={<FiGlobe size={28} />}
            gradient={['#f093fb', '#f5576c']}
            trend="Active listings"
          />
          <ModernStatCard 
            title="Total Bookings" 
            value={stats.totalBookings.toString()} 
            icon={<FiCalendar size={28} />}
            gradient={['#4facfe', '#00f2fe']}
            trend="Lifetime bookings"
          />
          <ModernStatCard 
            title="Total Revenue" 
            value={`৳${stats.totalRevenue.toLocaleString()}`} 
            icon={<FiDollarSign size={28} />}
            gradient={['#43e97b', '#38f9d7']}
            trend="Platform earnings"
          />
          <ModernStatCard 
            title="Pending Bookings" 
            value={stats.pendingBookings.toString()} 
            icon={<FiClock size={28} />}
            gradient={['#fa709a', '#fee140']}
            trend="Awaiting confirmation"
          />
          <ModernStatCard 
            title="Confirmed Bookings" 
            value={stats.confirmedBookings.toString()} 
            icon={<FiCheckCircle size={28} />}
            gradient={['#30cfd0', '#330867']}
            trend="Completed successfully"
          />
        </div>
      )}

      {/* Modern Menu Tabs */}
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto 2rem auto'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          padding: '0.75rem',
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          overflowX: 'auto',
          flexWrap: 'nowrap'
        }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                padding: '0.875rem 1.5rem',
                backgroundColor: activeMenu === item.id ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: activeMenu === item.id ? '#667eea' : '#6b7280',
                transition: 'all 0.3s ease',
                boxShadow: activeMenu === item.id ? '0 4px 15px rgba(102, 126, 234, 0.2)' : 'none',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (activeMenu !== item.id) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      {activeMenu === 'overview' && <OverviewSection stats={stats} chartData={chartData} />}
      {activeMenu === 'users' && <UsersSection users={users} user={user} onRefresh={fetchUsers} />}
      {activeMenu === 'bookings' && <BookingsSection />}
      {activeMenu === 'items' && <AdminItemsManagement />}
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
      alert.warning('Cannot Change Own Role', 'You cannot change your own role. Please ask another admin to do this.');
      return;
    }

    const isConfirmed = await alert.confirm({
      title: 'Change User Role?',
      text: `Are you sure you want to change this user's role to ${newRole}?`,
      confirmButtonText: 'Yes, Change',
      cancelButtonText: 'Cancel'
    });
    
    if (!isConfirmed) return;

    console.log('Changing role for user:', userId, 'to:', newRole);
    
    try {
      setDeleteLoading(true);
      const response = await userService.updateUser(userId, { role: newRole });
      console.log('Response:', response);
      
      if (response.success) {
        alert.success('Role Updated!', `User role has been changed to ${newRole} successfully!`);
        onRefresh();
      } else {
        alert.error('Update Failed', response.message || 'Failed to update user role');
      }
    } catch (err: any) {
      console.error('Role change error:', err);
      alert.error('Update Failed', err.response?.data?.message || err.message || 'Failed to update user role');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const isConfirmed = await alert.deleteConfirm('this user');
    if (!isConfirmed) return;
    
    try {
      setDeleteLoading(true);
      const response = await userService.deleteUser(userId);
      if (response.success) {
        alert.success('User Deleted!', 'The user has been deleted successfully');
        setIsDeleteConfirmOpen(null);
        window.location.reload();
      }
    } catch (err: any) {
      alert.error('Delete Failed', err.response?.data?.message || 'Failed to delete user');
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
                      {user._id && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setIsDeleteConfirmOpen(user._id)}
                          disabled={deleteLoading}
                          style={{ color: '#dc2626', borderColor: '#dc2626' }}
                        >
                          {deleteLoading ? '...' : 'Delete'}
                        </Button>
                      )}
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

// Modern Stat Card Component with Gradient
function ModernStatCard({ 
  title, 
  value, 
  icon, 
  gradient,
  trend 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  gradient: [string, string];
  trend?: string;
}) {
  return (
    <div className="card" style={{ 
      background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: '-2rem',
        right: '-2rem',
        width: '8rem',
        height: '8rem',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </div>
          {trend && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.9)',
              background: 'rgba(255,255,255,0.15)',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.5rem',
              backdropFilter: 'blur(10px)'
            }}>
              <FiTrendingUp size={12} />
              <span>{trend}</span>
            </div>
          )}
        </div>
        
        <h3 style={{ 
          fontSize: '0.875rem', 
          color: 'rgba(255,255,255,0.9)', 
          marginBottom: '0.5rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {title}
        </h3>
        
        <p style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          color: '#ffffff',
          margin: 0,
          lineHeight: 1.2,
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// Legacy StatCard (kept for compatibility)
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
