// Enhanced Bookings Section Component - Displays ALL user and item data
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { bookingService } from '../../services/booking.service';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { alert } from '../../utils/sweetAlert';
import type { Booking } from '../../types';
import { 
  FiUsers, FiCalendar, FiMapPin, FiDollarSign, FiCheckCircle, FiClock, FiX, 
  FiEye, FiTrash2, FiPhone, FiMail, FiFilter, FiSearch
} from 'react-icons/fi';

export function EnhancedBookingsSection() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchBookings();
    fetchAnalytics();
  }, [filterStatus, searchQuery, dateFrom, dateTo]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings({
        status: filterStatus === 'all' ? undefined : filterStatus,
        searchQuery: searchQuery || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      
      if (response.success) {
        const bookingsData = Array.isArray(response.data) ? response.data : (response.data as any).bookings || [];
        setBookings(bookingsData);
      }
    } catch (error: any) {
      console.error('Failed to fetch bookings:', error);
      await alert.error('Error', error.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await bookingService.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await bookingService.exportToCSV({
        status: filterStatus === 'all' ? undefined : filterStatus,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      await alert.success('Export Successful', 'Bookings exported to CSV successfully!');
    } catch (error: any) {
      await alert.error('Export Failed', error.message || 'Failed to export CSV');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBookings.size === 0) {
      await alert.warning('No Selection', 'Please select bookings to delete');
      return;
    }

    const isConfirmed = await alert.confirm({
      title: 'Bulk Delete',
      text: `Are you sure you want to delete ${selectedBookings.size} bookings? This cannot be undone.`,
      confirmButtonText: 'Yes, Delete All',
      cancelButtonText: 'Cancel'
    });

    if (!isConfirmed) return;

    try {
      const response = await bookingService.bulkDeleteBookings(Array.from(selectedBookings));
      if (response.success) {
        await alert.success('Deleted!', `${response.data.count} bookings deleted successfully`);
        setSelectedBookings(new Set());
        fetchBookings();
      }
    } catch (error: any) {
      await alert.error('Delete Failed', error.message || 'Failed to delete bookings');
    }
  };

  const toggleSelectBooking = (bookingId: string) => {
    const newSelected = new Set(selectedBookings);
    if (newSelected.has(bookingId)) {
      newSelected.delete(bookingId);
    } else {
      newSelected.add(bookingId);
    }
    setSelectedBookings(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedBookings.size === bookings.length) {
      setSelectedBookings(new Set());
    } else {
      setSelectedBookings(new Set(bookings.map(b => b._id)));
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '1rem' }}>
        <LoadingSkeleton height={200} className="mb-4" />
        <LoadingSkeleton height={100} className="mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton key={i} height={120} className="mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '1rem' }}>
      {/* Analytics Dashboard */}
      {analytics && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <AnalyticsCard
            title="Total Revenue"
            value={`৳${analytics.totalRevenue?.toLocaleString() || '0'}`}
            icon={<FiDollarSign size={32} />}
            gradient={['#43e97b', '#38f9d7']}
            trend={analytics.averageBookingValue ? `Avg: ৳${Math.round(analytics.averageBookingValue)}` : ''}
          />
          <AnalyticsCard
            title="Total Bookings"
            value={analytics.totalBookings?.toString() || '0'}
            icon={<FiCalendar size={32} />}
            gradient={['#667eea', '#764ba2']}
            trend={`${analytics.recentBookings?.length || 0} recent`}
          />
          <AnalyticsCard
            title="Confirmed"
            value={analytics.bookingsByStatus?.find((s: any) => s._id === 'confirmed')?.count.toString() || '0'}
            icon={<FiCheckCircle size={32} />}
            gradient={['#30cfd0', '#330867']}
            trend="Successful bookings"
          />
          <AnalyticsCard
            title="Pending"
            value={analytics.bookingsByStatus?.find((s: any) => s._id === 'pending')?.count.toString() || '0'}
            icon={<FiClock size={32} />}
            gradient={['#fa709a', '#fee140']}
            trend="Awaiting action"
          />
        </div>
      )}

      {/* Header with Actions */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ color: 'white' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'white' }}>
              📅 Booking Management
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              Complete booking overview with full details ({bookings.length} bookings)
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {selectedBookings.size > 0 && (
              <Button
                variant="ghost"
                onClick={handleBulkDelete}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.3)',
                  color: 'white',
                  border: '2px solid rgba(239, 68, 68, 0.5)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <FiTrash2 size={18} /> Delete ({selectedBookings.size})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiFilter /> Advanced Filters
          </span>
          {showFilters ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {showFilters && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Status Filter
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem'
                }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">⏳ Pending</option>
                <option value="confirmed">✅ Confirmed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <FiSearch style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            size: 20
          }} />
          <input
            type="text"
            placeholder="Search by user name, email, destination title, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 3rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedBookings.size > 0 && (
        <div style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '2px solid #3b82f6'
        }}>
          <span style={{ fontWeight: 600, color: '#1e40af' }}>
            ✓ {selectedBookings.size} booking(s) selected
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button size="sm" variant="outline" onClick={() => setSelectedBookings(new Set())}>
              <FiX size={16} /> Deselect All
            </Button>
            <Button size="sm" onClick={handleBulkDelete} style={{ backgroundColor: '#dc2626' }}>
              <FiTrash2 size={16} /> Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <FiCalendar size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>No bookings found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ 
                  backgroundColor: '#f9fafb',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>
                    <input
                      type="checkbox"
                      checked={selectedBookings.size === bookings.length && bookings.length > 0}
                      onChange={toggleSelectAll}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>User Details</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Destination Info</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Pricing</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <EnhancedBookingRow
                    key={booking._id}
                    booking={booking}
                    index={index}
                    isSelected={selectedBookings.has(booking._id)}
                    onToggleSelect={() => toggleSelectBooking(booking._id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Analytics Card Component
function AnalyticsCard({ title, value, icon, gradient, trend }: any) {
  return (
    <div className="card" style={{
      background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'white' }}>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          backdropFilter: 'blur(10px)'
        }}>
          {icon}
        </div>
        {trend && (
          <div style={{
            fontSize: '0.75rem',
            background: 'rgba(255,255,255,0.15)',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <FiTrendingUp size={12} style={{ marginRight: '0.25rem' }} />
            {trend}
          </div>
        )}
      </div>
      <h3 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem', fontWeight: 500 }}>
        {title}
      </h3>
      <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white', margin: 0 }}>
        {value}
      </p>
    </div>
  );
}

// Enhanced Booking Row Component - Shows ALL data
function EnhancedBookingRow({ booking, index, isSelected, onToggleSelect }: any) {
  const [showDetails, setShowDetails] = useState(false);
  
  const user = booking.userId || {};
  const item = booking.itemId || {};
  const details = booking.bookingDetails || {};

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' };
      case 'confirmed': return { bg: '#d1fae5', text: '#065f46', border: '#34d399' };
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b', border: '#f87171' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
    }
  };

  const getPaymentStatusColors = (status: string) => {
    switch (status) {
      case 'paid': return { bg: '#d1fae5', text: '#065f46', border: '#34d399' };
      case 'pending': return { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' };
      case 'failed': return { bg: '#fee2e2', text: '#991b1b', border: '#f87171' };
      case 'refunded': return { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
    }
  };

  const statusColors = getStatusColors(booking.status);
  const paymentColors = getPaymentStatusColors(booking.paymentStatus);

  return (
    <>
      <tr 
        style={{ 
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: isSelected ? '#eff6ff' : (index % 2 === 0 ? 'white' : '#f9fafb'),
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = '#eff6ff';
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9fafb';
        }}
      >
        <td style={{ padding: '1rem' }}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </td>
        
        {/* User Details Column */}
        <td style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 600
              }}>
                {user.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>
                {user.name || 'Unknown User'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FiMail size={12} /> {user.email || 'N/A'}
              </div>
              {user.phone && (
                <div style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FiPhone size={12} /> {user.phone}
                </div>
              )}
            </div>
          </div>
          {user.role && (
            <span style={{
              fontSize: '0.7rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px',
              backgroundColor: user.role === 'admin' ? '#dbeafe' : '#f3f4f6',
              color: user.role === 'admin' ? '#1e40af' : '#374151',
              fontWeight: 600,
              display: 'inline-block'
            }}>
              👑 {user.role.toUpperCase()}
            </span>
          )}
        </td>

        {/* Destination Info Column */}
        <td style={{ padding: '1rem' }}>
          {item.image && (
            <img 
              src={item.image} 
              alt={item.title}
              style={{ width: '80px', height: '60px', borderRadius: '0.5rem', objectFit: 'cover', marginBottom: '0.5rem' }}
            />
          )}
          <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
            {item.title || 'Unknown Destination'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
            <FiMapPin size={12} /> {item.location || 'N/A'}
          </div>
          {item.rating && (
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <FiStar size={12} fill="#f59e0b" /> {item.rating} ({item.reviews || 0} reviews)
            </div>
          )}
        </td>

        {/* Pricing Column */}
        <td style={{ padding: '1rem' }}>
          <div style={{ fontWeight: 700, color: '#10b981', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
            ৳{booking.totalPrice?.toLocaleString() || '0'}
          </div>
          {details.perNightPrice && (
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              ৳{details.perNightPrice.toLocaleString()} / night
            </div>
          )}
          {details.nights && (
            <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <FiCalendar size={12} /> {details.nights} night(s)
            </div>
          )}
        </td>

        {/* Status Column */}
        <td style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: statusColors.bg,
              color: statusColors.text,
              border: `1px solid ${statusColors.border}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginBottom: '0.25rem'
            }}>
              {booking.status === 'pending' && '⏳'}
              {booking.status === 'confirmed' && '✅'}
              {booking.status === 'cancelled' && '❌'}
              {booking.status}
            </span>
          </div>
          <div>
            <span style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.65rem',
              fontWeight: 600,
              backgroundColor: paymentColors.bg,
              color: paymentColors.text,
              border: `1px solid ${paymentColors.border}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              💳 {booking.paymentStatus || 'pending'}
            </span>
          </div>
        </td>

        {/* Actions Column */}
        <td style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: '#eff6ff',
                color: '#3b82f6',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <FiEye size={14} /> {showDetails ? 'Hide' : 'View'}
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {showDetails && (
        <tr>
          <td colSpan={6} style={{ padding: '0' }}>
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
              borderTop: '2px solid #e5e7eb'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '1.5rem'
              }}>
                {/* Complete User Information */}
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '1rem', textTransform: 'uppercase' }}>
                    👤 Complete User Information
                  </h4>
                  <div className="card" style={{ padding: '1rem' }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Full Name</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{user.name || 'N/A'}</div>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Email Address</div>
                      <div style={{ color: '#3b82f6' }}>{user.email || 'N/A'}</div>
                    </div>
                    {user.phone && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Phone Number</div>
                        <div style={{ color: '#111827' }}>{user.phone}</div>
                      </div>
                    )}
                    {user.address && (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Address</div>
                        <div style={{ color: '#111827' }}>
                          {user.address.street}<br />
                          {user.address.city}, {user.address.zipCode}<br />
                          {user.address.country}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Complete Destination Information */}
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '1rem', textTransform: 'uppercase' }}>
                    🏨 Destination Details
                  </h4>
                  <div className="card" style={{ padding: '1rem' }}>
                    {item.description && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Description</div>
                        <div style={{ color: '#111827', fontSize: '0.875rem', lineHeight: '1.6' }}>{item.description}</div>
                      </div>
                    )}
                    {item.amenities && item.amenities.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Amenities</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {item.amenities.map((amenity: string, idx: number) => (
                            <span key={idx} style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: '#eff6ff',
                              color: '#3b82f6',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}>
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.features && item.features.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Features</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {item.features.map((feature: string, idx: number) => (
                            <span key={idx} style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: '#f0fdf4',
                              color: '#16a34a',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}>
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Timeline & Policies */}
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '1rem', textTransform: 'uppercase' }}>
                    📋 Booking Information
                  </h4>
                  <div className="card" style={{ padding: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Booking Date</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>
                        {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </div>
                    </div>
                    {item.checkInTime && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Check-in Time</div>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{item.checkInTime}</div>
                      </div>
                    )}
                    {item.checkOutTime && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Check-out Time</div>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{item.checkOutTime}</div>
                      </div>
                    )}
                    {item.cancellationPolicy && (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Cancellation Policy</div>
                        <div style={{ 
                          padding: '0.5rem', 
                          backgroundColor: item.cancellationPolicy === 'flexible' ? '#d1fae5' : '#fee2e2',
                          color: item.cancellationPolicy === 'flexible' ? '#065f46' : '#991b1b',
                          borderRadius: '0.5rem',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}>
                          {item.cancellationPolicy === 'flexible' ? '✓ Flexible' : '✗ Strict'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Host Contact Information */}
              {item.host && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '1rem', textTransform: 'uppercase' }}>
                    📞 Host Contact Information
                  </h4>
                  <div className="card" style={{ padding: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      {item.host.name && (
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Host Name</div>
                          <div style={{ fontWeight: 600, color: '#111827' }}>{item.host.name}</div>
                        </div>
                      )}
                      {item.host.phone && (
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Host Phone</div>
                          <div style={{ color: '#111827' }}>{item.host.phone}</div>
                        </div>
                      )}
                      {item.host.email && (
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Host Email</div>
                          <div style={{ color: '#3b82f6' }}>{item.host.email}</div>
                        </div>
                      )}
                      {item.contact && (
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Property Contact</div>
                          <div style={{ color: '#111827' }}>{item.contact}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
