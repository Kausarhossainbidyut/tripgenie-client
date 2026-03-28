// Simple Professional Bookings Section
import { useState, useEffect } from 'react';
import { bookingService } from '../../services/booking.service';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { alert } from '../../utils/sweetAlert';
import type { Booking } from '../../types';
import { FiCalendar, FiDollarSign, FiCheckCircle, FiClock, FiTrash2, FiEye } from 'react-icons/fi';

export function SimpleBookingsSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchBookings();
    fetchAnalytics();
  }, [filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings({
        status: filterStatus === 'all' ? undefined : filterStatus,
      });
      
      if (response.success) {
        const bookingsData = Array.isArray(response.data) ? response.data : (response.data as any).bookings || [];
        setBookings(bookingsData);
      }
    } catch (error: any) {
      console.error('Failed to fetch bookings:', error);
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

  if (loading) {
    return <LoadingSkeleton height={400} />;
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
          Booking Management
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage and track all bookings ({bookings.length} total)
        </p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <AnalyticsCard
            title="Total Revenue"
            value={`৳${analytics.totalRevenue?.toLocaleString() || '0'}`}
            icon={<FiDollarSign size={24} />}
            color="#10b981"
          />
          <AnalyticsCard
            title="Total Bookings"
            value={analytics.totalBookings?.toString() || '0'}
            icon={<FiCalendar size={24} />}
            color="#3b82f6"
          />
          <AnalyticsCard
            title="Confirmed"
            value={analytics.bookingsByStatus?.find((s: any) => s._id === 'confirmed')?.count.toString() || '0'}
            icon={<FiCheckCircle size={24} />}
            color="#10b981"
          />
          <AnalyticsCard
            title="Pending"
            value={analytics.bookingsByStatus?.find((s: any) => s._id === 'pending')?.count.toString() || '0'}
            icon={<FiClock size={24} />}
            color="#f59e0b"
          />
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '0.5rem'
      }}>
        <FilterButton
          label="All Bookings"
          active={filterStatus === 'all'}
          onClick={() => setFilterStatus('all')}
        />
        <FilterButton
          label="Pending"
          active={filterStatus === 'pending'}
          onClick={() => setFilterStatus('pending')}
        />
        <FilterButton
          label="Confirmed"
          active={filterStatus === 'confirmed'}
          onClick={() => setFilterStatus('confirmed')}
        />
        <FilterButton
          label="Cancelled"
          active={filterStatus === 'cancelled'}
          onClick={() => setFilterStatus('cancelled')}
        />
      </div>

      {/* Bookings Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Destination
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                User
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Date
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Quantity
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Total Price
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Status
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <SimpleBookingRow
                key={booking._id}
                booking={booking}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Analytics Card Component
function AnalyticsCard({ title, value, icon, color }: any) {
  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          padding: '0.75rem', 
          borderRadius: '0.5rem', 
          backgroundColor: `${color}20`,
          color: color
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{title}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

// Filter Button Component
function FilterButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.625rem 1.25rem',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: 500,
        backgroundColor: active ? '#3b82f6' : 'transparent',
        color: active ? 'white' : '#6b7280',
        transition: 'all 0.2s'
      }}
    >
      {label}
    </button>
  );
}

// Simple Booking Row Component
function SimpleBookingRow({ booking }: any) {
  const item = booking.itemId || {};
  const user = booking.userId || {};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e' };
      case 'confirmed': return { bg: '#d1fae5', text: '#065f46' };
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const statusColors = getStatusColor(booking.status);

  return (
    <tr style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
      <td style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {item.image && (
            <img 
              src={item.image} 
              alt={item.title}
              style={{ width: '48px', height: '48px', borderRadius: '0.375rem', objectFit: 'cover' }}
            />
          )}
          <div>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>{item.title || 'N/A'}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.location || ''}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '1rem' }}>
        <div style={{ fontWeight: 500, color: '#1f2937' }}>{user.name || 'N/A'}</div>
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user.email || ''}</div>
      </td>
      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        {new Date(booking.createdAt).toLocaleDateString()}
      </td>
      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        {booking.quantity || 'N/A'}
      </td>
      <td style={{ padding: '1rem', fontWeight: 600, color: '#1f2937' }}>
        ৳{booking.totalPrice?.toLocaleString() || '0'}
      </td>
      <td style={{ padding: '1rem' }}>
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: statusColors.bg,
          color: statusColors.text
        }}>
          {booking.status}
        </span>
      </td>
      <td style={{ padding: '1rem' }}>
        <button
          style={{
            padding: '0.375rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            color: '#374151',
            cursor: 'pointer',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <FiEye size={14} /> View
        </button>
      </td>
    </tr>
  );
}
