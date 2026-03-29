import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { bookingService } from '../../services/booking.service';
import { itemService } from '../../services/item.service';
import type { Booking, Item } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { alert } from '../../utils/sweetAlert';
import { FiCalendar, FiMapPin, FiDollarSign, FiXCircle, FiCheckCircle, FiClock, FiPackage, FiUser, FiChevronRight } from 'react-icons/fi';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

export function Bookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [items, setItems] = useState<Map<string, Item>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch item details for bookings that only have itemId as string
  useEffect(() => {
    const fetchMissingItems = async () => {
      const itemIdsToFetch: string[] = [];
      
      bookings.forEach(booking => {
        if (typeof booking.itemId === 'string') {
          const existingItem = items.get(booking.itemId);
          // Only fetch if we haven't tried to fetch this item before
          if (!existingItem && !itemIdsToFetch.includes(booking.itemId)) {
            itemIdsToFetch.push(booking.itemId);
          }
        }
      });
      
      if (itemIdsToFetch.length > 0) {
        try {
          const promises = itemIdsToFetch.map(id => itemService.getItemById(id));
          const results = await Promise.allSettled(promises);
          
          const newItems = new Map(items);
          results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              const response = result.value;
              // Only cache if API returned successful response with data
              if (response?.success && response.data) {
                newItems.set(itemIdsToFetch[index], response.data);
              } else {
                // Item not found (404) - mark as fetched but unavailable
                // This is expected for deleted items, so just skip silently
              }
            } else {
              // Handle failed promise (network error, etc.)
              // Check if it's a 404 error (item deleted) - don't log as error
              const isNotFound = result.reason?.response?.status === 404;
              if (!isNotFound) {
                console.error(`Failed to fetch item ${itemIdsToFetch[index]}:`, result.reason.message);
              }
              // For 404s, just skip - item was deleted, which is normal
            }
          });
          
          setItems(newItems);
        } catch (err: any) {
          // This shouldn't normally happen since we use Promise.allSettled
          // But if it does, only log if it's not a 404
          const isNotFound = err?.response?.status === 404;
          if (!isNotFound) {
            console.error('Error fetching items:', err.message);
          }
        }
      }
    };
    
    if (bookings.length > 0) {
      fetchMissingItems();
    }
  }, [bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      console.log('📋 Bookings API Response:', response);
      
      if (response.success) {
        // Handle both array and object responses
        const bookingsData = Array.isArray(response.data) ? response.data : (response.data as any).bookings || [];
        setBookings(bookingsData);
        console.log('✅ Bookings data set:', bookingsData);
        console.log('📊 Number of bookings:', bookingsData.length);
        if (bookingsData.length > 0) {
          console.log('🔍 First booking structure:', JSON.stringify(bookingsData[0], null, 2));
        }
      }
    } catch (err: any) {
      console.error('❌ Bookings fetch error:', err);
      console.error('Error details:', err.response?.data);
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    if (filterStatus === 'all') return bookings;
    return bookings.filter(booking => booking.status === filterStatus);
  };

  const handleCancelBooking = async (bookingId: string) => {
    const isConfirmed = await alert.confirm({
      title: 'Cancel Booking?',
      text: 'Are you sure you want to cancel this booking?',
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No'
    });
    
    if (!isConfirmed) return;
    
    const reason = prompt('Please provide a reason for cancellation (optional):');

    try {
      setProcessing(bookingId);
      const response = await bookingService.cancelBooking(bookingId, reason || undefined);
      if (response.success) {
        await alert.success('Booking Cancelled!', `Refund amount: ৳${response.data.refundAmount}`);
        fetchBookings();
      }
    } catch (err: any) {
      await alert.error('Cancellation Failed', err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <FiCheckCircle size={18} />;
      case 'pending':
        return <FiClock size={18} />;
      case 'cancelled':
        return <FiXCircle size={18} />;
      default:
        return <FiPackage size={18} />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStats = () => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const totalSpent = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    return { total, confirmed, pending, cancelled, totalSpent };
  };

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2rem',
        minHeight: 'calc(100vh - 100px)'
      }}>
        {/* Header Skeleton */}
        <LoadingSkeleton height={120} className="mb-8" />
        
        {/* Stats Cards Skeleton */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <LoadingSkeleton height={40} width={40} variant="circular" />
                <LoadingSkeleton height={20} width={120} />
              </div>
              <LoadingSkeleton height={40} width={80} className="mb-2" />
              <LoadingSkeleton height={16} width={100} />
            </div>
          ))}
        </div>

        {/* Filter Tabs Skeleton */}
        <LoadingSkeleton height={50} className="mb-8" />

        {/* Booking Cards Skeleton */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: '0' }}>
              <LoadingSkeleton height={180} />
              <div style={{ padding: '1.25rem' }}>
                <LoadingSkeleton height={28} count={2} className="mb-2" />
                <LoadingSkeleton height={20} width="60%" className="mb-2" />
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.875rem',
                  marginBottom: '1.25rem'
                }}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j}>
                      <LoadingSkeleton height={14} width={60} className="mb-2" />
                      <LoadingSkeleton height={24} width={80} />
                    </div>
                  ))}
                </div>
                <LoadingSkeleton height={40} count={2} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = getStats();
  const filteredBookings = getFilteredBookings();

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '2rem',
      minHeight: 'calc(100vh - 100px)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Header Section */}
      <div style={{ 
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2.5rem',
        borderRadius: '1.5rem',
        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50px',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%'
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            marginBottom: '0.75rem',
            letterSpacing: '-0.03em',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}>
            My Bookings
          </h1>
          <p style={{ 
            fontSize: '1.0625rem', 
            opacity: 0.95,
            fontWeight: 400,
            maxWidth: '600px'
          }}>
            Manage your travel adventures and reservations
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          padding: '1.75rem',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #3b82f6, #2563eb)'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              padding: '0.875rem', 
              backgroundColor: '#eff6ff', 
              borderRadius: '0.875rem',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiPackage size={24} />
            </div>
            <span style={{ fontSize: '0.9375rem', color: '#6b7280', fontWeight: 600 }}>Total Bookings</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{stats.total}</div>
          <div style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.5rem' }}>All time bookings</div>
        </div>

        <div style={{
          padding: '1.75rem',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #f59e0b, #d97706)'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              padding: '0.875rem', 
              backgroundColor: '#fffbeb', 
              borderRadius: '0.875rem',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiClock size={24} />
            </div>
            <span style={{ fontSize: '0.9375rem', color: '#6b7280', fontWeight: 600 }}>Pending</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{stats.pending}</div>
          <div style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.5rem' }}>Awaiting confirmation</div>
        </div>

        <div style={{
          padding: '1.75rem',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #10b981, #059669)'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              padding: '0.875rem', 
              backgroundColor: '#ecfdf5', 
              borderRadius: '0.875rem',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiCheckCircle size={24} />
            </div>
            <span style={{ fontSize: '0.9375rem', color: '#6b7280', fontWeight: 600 }}>Confirmed</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{stats.confirmed}</div>
          <div style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.5rem' }}>Ready to explore</div>
        </div>

        <div style={{
          padding: '1.75rem',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #ef4444, #dc2626)'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              padding: '0.875rem', 
              backgroundColor: '#fef2f2', 
              borderRadius: '0.875rem',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiDollarSign size={24} />
            </div>
            <span style={{ fontSize: '0.9375rem', color: '#6b7280', fontWeight: 600 }}>Total Spent</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>৳{stats.totalSpent.toLocaleString()}</div>
          <div style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.5rem' }}>Total investment</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ 
        display: 'inline-flex', 
        gap: '0.75rem', 
        marginBottom: '2rem',
        padding: '0.5rem',
        backgroundColor: '#f9fafb',
        borderRadius: '1rem',
        border: '1px solid #e5e7eb',
        flexWrap: 'wrap'
      }}>
        {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: filterStatus === status ? '#ffffff' : 'transparent',
              color: filterStatus === status ? '#111827' : '#6b7280',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
              boxShadow: filterStatus === status ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (filterStatus !== status) {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#111827';
              }
            }}
            onMouseLeave={(e) => {
              if (filterStatus !== status) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {filterStatus === status && (
              <div style={{
                position: 'absolute',
                bottom: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '4px',
                height: '4px',
                backgroundColor: '#667eea',
                borderRadius: '50%'
              }} />
            )}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fee2e2', 
          borderRadius: '0.5rem', 
          color: '#dc2626',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {filteredBookings.length === 0 ? (
        <div className="card" style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          backgroundColor: '#f9fafb',
          borderRadius: '1rem'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 1.5rem',
            backgroundColor: '#e5e7eb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280'
          }}>
            <FiPackage size={40} />
          </div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            No bookings found
          </h3>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.9375rem', 
            marginBottom: '1.5rem',
            maxWidth: '400px',
            margin: '0 auto 1.5rem'
          }}>
            {filterStatus !== 'all' 
              ? `No ${filterStatus} bookings at the moment` 
              : "You haven't made any bookings yet. Start exploring amazing destinations!"}
          </p>
          {filterStatus === 'all' && (
            <Button 
              onClick={() => window.location.href = '/items'}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                fontWeight: 600,
                padding: '0.75rem 2rem'
              }}
            >
              Browse Destinations
            </Button>
          )}
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {bookings.map((booking) => {
            // Get item data - either from itemId object or fetched data
            const item = typeof booking.itemId === 'string' 
              ? items.get(booking.itemId)
              : booking.itemId;
            
            // Check if item is still loading
            if (!item && typeof booking.itemId === 'string' && !items.has(booking.itemId)) {
              return (
                <div key={booking._id} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1.25rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid #e5e7eb',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  color: '#6b7280',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px'
                }}>
                  <div className="animate-spin" style={{ 
                    width: '2.5rem', 
                    height: '2.5rem', 
                    borderRadius: '50%', 
                    border: '3px solid #e5e7eb',
                    borderTopColor: '#667eea',
                    marginBottom: '1rem'
                  }} />
                  <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>Loading destination...</p>
                </div>
              );
            }
            
            // Item was fetched but not found (deleted)
            if (!item) {
              return (
                <div key={booking._id} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1.25rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '2px solid #fbbf24',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '200px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                  }}></div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '0.75rem',
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))'
                  }}>⚠️</div>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 700, 
                    color: '#92400e',
                    marginBottom: '0.5rem'
                  }}>
                    Destination Unavailable
                  </h3>
                  <p style={{ 
                    fontSize: '0.8125rem', 
                    color: '#78350f',
                    marginBottom: '1rem',
                    lineHeight: 1.5
                  }}>
                    This destination may have been removed or deleted.
                  </p>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#92400e',
                    padding: '0.5rem 0.875rem',
                    backgroundColor: '#fef3c7',
                    borderRadius: '0.5rem',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    display: 'inline-block'
                  }}>
                    📋 ID: {booking._id}
                  </div>
                </div>
              );
            }
            
            return (
              <div key={booking._id} style={{
                backgroundColor: '#ffffff',
                borderRadius: '1.25rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
              }}
              >
                {/* Top accent bar based on status */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: booking.status === 'confirmed' ? 'linear-gradient(90deg, #10b981, #059669)' :
                            booking.status === 'pending' ? 'linear-gradient(90deg, #f59e0b, #d97706)' :
                            'linear-gradient(90deg, #ef4444, #dc2626)'
                }}></div>

                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Image Section */}
                  {item.image && (
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '180px',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          transition: 'transform 0.5s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                      {/* Status Badge Overlay */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        color: '#ffffff',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '1.5rem',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </div>
                      
                      {/* Price Tag Overlay */}
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        color: '#111827',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.75rem',
                        fontSize: '0.9375rem',
                        fontWeight: 800,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <FiDollarSign size={14} />
                        ৳{booking.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {/* Content Section */}
                  <div style={{ 
                    flex: 1, 
                    padding: '1.25rem'
                  }}>
                    {/* Header */}
                    <div style={{ marginBottom: '1rem' }}>
                      {item && item.title ? (
                        <>
                          <h3 style={{ 
                            fontSize: '1.125rem', 
                            fontWeight: 700, 
                            color: '#111827',
                            marginBottom: '0.5rem',
                            lineHeight: 1.3,
                            letterSpacing: '-0.02em'
                          }}>
                            {item.title}
                          </h3>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.375rem',
                            color: '#6b7280',
                            fontSize: '0.8125rem',
                            marginBottom: '0.375rem'
                          }}>
                            <FiMapPin size={16} />
                            <span style={{ fontWeight: 500 }}>{item.location || 'Location not specified'}</span>
                          </div>
                          {item.category && (
                            <div style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.625rem',
                              backgroundColor: '#eff6ff',
                              color: '#2563eb',
                              borderRadius: '1rem',
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                              marginTop: '0.5rem'
                            }}>
                              {item.category}
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{ 
                          padding: '0.875rem', 
                          backgroundColor: '#fef3c7', 
                          borderRadius: '0.5rem',
                          color: '#92400e',
                          fontSize: '0.8125rem',
                          fontWeight: 600
                        }}>
                          ⚠️ Info unavailable
                        </div>
                      )}
                    </div>

                    {/* Info Grid */}
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.875rem',
                      marginBottom: '1.25rem'
                    }}>
                      <div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.375rem',
                          marginBottom: '0.25rem',
                          fontSize: '0.6875rem',
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontWeight: 600
                        }}>
                          <FiPackage size={14} />
                          Qty
                        </div>
                        <div style={{ 
                          fontSize: '1rem', 
                          fontWeight: 700, 
                          color: '#111827'
                        }}>
                          {booking.quantity}
                        </div>
                      </div>

                      <div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.375rem',
                          marginBottom: '0.25rem',
                          fontSize: '0.6875rem',
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontWeight: 600
                        }}>
                          <FiDollarSign size={14} />
                          Total
                        </div>
                        <div style={{ 
                          fontSize: '1.125rem', 
                          fontWeight: 800, 
                          color: '#111827',
                          letterSpacing: '-0.02em'
                        }}>
                          ৳{booking.totalPrice.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.375rem',
                          marginBottom: '0.25rem',
                          fontSize: '0.6875rem',
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontWeight: 600
                        }}>
                          <FiCalendar size={14} />
                          Date
                        </div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          color: '#374151'
                        }}>
                          {formatDate(booking.createdAt)}
                        </div>
                      </div>

                      <div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.375rem',
                          marginBottom: '0.25rem',
                          fontSize: '0.6875rem',
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontWeight: 600
                        }}>
                          <FiCheckCircle size={14} />
                          Payment
                        </div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700,
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.375rem',
                          backgroundColor: booking.paymentStatus === 'paid' ? '#d1fae5' : 
                                          booking.paymentStatus === 'pending' ? '#fef3c7' : '#fee2e2',
                          color: booking.paymentStatus === 'paid' ? '#059669' :
                                 booking.paymentStatus === 'pending' ? '#d97706' : '#dc2626',
                          display: 'inline-block'
                        }}>
                          {booking.paymentStatus?.toUpperCase() || 'PENDING'}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ 
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      marginTop: '0.75rem'
                    }}>
                      {booking.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(booking._id!)}
                          isLoading={processing === booking._id}
                          style={{ 
                            color: '#ef4444', 
                            borderColor: '#ef4444',
                            backgroundColor: '#fef2f2',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            padding: '0.5rem 0.875rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ef4444';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fef2f2';
                            e.currentTarget.style.color = '#ef4444';
                          }}
                        >
                          <FiXCircle size={14} style={{ marginRight: '0.25rem' }} />
                          Cancel
                        </Button>
                      )}

                      {booking.status === 'confirmed' && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.375rem 0.625rem',
                          backgroundColor: '#d1fae5',
                          borderRadius: '0.375rem',
                          color: '#059669',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          <FiCheckCircle size={14} />
                          Confirmed
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (item._id) {
                            navigate(`/items/${item._id}`);
                          } else {
                            alert.error('Error', 'Destination information not available');
                          }
                        }}
                        disabled={!item._id}
                        style={{
                          color: item._id ? '#3b82f6' : '#9ca3af',
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                          padding: '0.5rem 0.75rem',
                          marginLeft: 'auto',
                          cursor: item._id ? 'pointer' : 'not-allowed'
                        }}
                      >
                        View
                        <FiChevronRight size={14} style={{ marginLeft: '0.25rem' }} />
                      </Button>
                    </div>

                    {/* Cancellation Reason */}
                    {booking.cancellationReason && (
                      <div style={{ 
                        marginTop: '1.25rem', 
                        padding: '1rem', 
                        backgroundColor: '#fef3c7',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#92400e',
                        border: '1px solid #fde68a'
                      }}>
                        <div style={{ fontWeight: 700, marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FiClock size={16} />
                          Cancellation Reason
                        </div>
                        {booking.cancellationReason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
