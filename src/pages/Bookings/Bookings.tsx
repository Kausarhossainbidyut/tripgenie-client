import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { bookingService } from '../../services/booking.service';
import type { Booking, Item } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      if (response.success) {
        setBookings(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const reason = prompt('Please provide a reason for cancellation (optional):');
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      setProcessing(bookingId);
      const response = await bookingService.cancelBooking(bookingId, reason || undefined);
      if (response.success) {
        alert(`Booking cancelled successfully! Refund amount: ৳${response.data.refundAmount}`);
        fetchBookings();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
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
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
        My Bookings
      </h1>

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

      {bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            No bookings yet
          </p>
          <Button onClick={() => window.location.href = '/items'}>
            Browse Destinations
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((booking) => {
            const item = booking.itemId as Item;
            return (
              <div key={booking._id} className="card">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1rem',
                  alignItems: 'start'
                }}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '0.5rem',
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>
                        {item.title}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        📍 {item.location}
                      </p>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      margin: '1rem 0'
                    }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Quantity</p>
                        <p style={{ fontWeight: 600, color: '#111827' }}>{booking.quantity}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Price</p>
                        <p style={{ fontWeight: 700, color: '#111827', fontSize: '1.25rem' }}>
                          ৳{booking.totalPrice}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Status</p>
                        <span style={{ 
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: `${getStatusColor(booking.status)}20`,
                          color: getStatusColor(booking.status),
                        }}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {booking.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(booking._id!)}
                        isLoading={processing === booking._id}
                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                      >
                        Cancel Booking
                      </Button>
                    )}

                    {booking.cancellationReason && (
                      <div style={{ 
                        marginTop: '1rem', 
                        padding: '0.75rem', 
                        backgroundColor: '#fef3c7',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#92400e'
                      }}>
                        <strong>Cancellation Reason:</strong> {booking.cancellationReason}
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
