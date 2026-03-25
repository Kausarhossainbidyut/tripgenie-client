import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { wishlistService } from '../../services/wishlist.service';
import { bookingService } from '../../services/booking.service';
import type { WishlistItem, Item } from '../../types';

export function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      if (response.success) {
        setWishlist(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (wishlistId: string) => {
    if (!confirm('Remove this item from your wishlist?')) return;

    try {
      setProcessing(wishlistId);
      const response = await wishlistService.removeFromWishlist(wishlistId);
      if (response.success) {
        alert('Removed from wishlist!');
        fetchWishlist();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove from wishlist');
    } finally {
      setProcessing(null);
    }
  };

  const handleBookNow = async (itemId: string) => {
    try {
      setProcessing(itemId);
      const response = await bookingService.createBooking({ itemId, quantity: 1 });
      if (response.success) {
        alert('Booking created successfully! Check your bookings.');
        navigate('/bookings');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setProcessing(null);
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
        My Wishlist ❤️
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

      {wishlist.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Your wishlist is empty
          </p>
          <Button onClick={() => navigate('/items')}>
            Browse Destinations
          </Button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem'
        }}>
          {wishlist.map((item) => {
            const wishlistItem = item.itemId as Item;
            return (
              <div key={item._id} className="card" style={{ padding: '0' }}>
                <img
                  src={wishlistItem.image}
                  alt={wishlistItem.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '0.5rem 0.5rem 0 0',
                  }}
                />
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
                    {wishlistItem.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    📍 {wishlistItem.location}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '1rem'
                  }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
                      ৳{wishlistItem.price}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        size="sm"
                        onClick={() => handleBookNow(wishlistItem._id!)}
                        isLoading={processing === wishlistItem._id}
                      >
                        Book Now
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFromWishlist(item._id!)}
                        isLoading={processing === item._id}
                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                      >
                        Remove
                      </Button>
                    </div>
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
