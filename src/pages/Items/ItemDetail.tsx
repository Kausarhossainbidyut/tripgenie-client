import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { itemService } from '../../services/item.service';
import { bookingService } from '../../services/booking.service';
import { wishlistService } from '../../services/wishlist.service';
import type { Item } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export function ItemDetail() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (itemId) {
      fetchItem();
      checkWishlist();
    }
  }, [itemId]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      if (!itemId) return;
      const response = await itemService.getItemById(itemId);
      if (response.success) {
        setItem(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch item details');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    if (!user || !itemId) return;
    
    try {
      const response = await wishlistService.checkWishlistStatus(itemId);
      if (response.success) {
        setIsInWishlist(response.data.isInWishlist);
      }
    } catch (err) {
      console.error('Failed to check wishlist status:', err);
    }
  };

  const handleBookNow = async () => {
    if (!user || !itemId) {
      alert('Please login to book');
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      const response = await bookingService.createBooking({
        itemId,
        quantity: bookingQuantity,
      });

      if (response.success) {
        alert('Booking created successfully!');
        navigate('/bookings');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user || !itemId) {
      alert('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    try {
      setWishlistLoading(true);
      if (isInWishlist) {
        // Remove from wishlist - need to get wishlist ID first
        const response = await wishlistService.getWishlist();
        const wishlistItem = response.data.find(w => 
          (typeof w.itemId === 'string' && w.itemId === itemId) || 
          (typeof w.itemId !== 'string' && w.itemId._id === itemId)
        );
        if (wishlistItem?._id) {
          await wishlistService.removeFromWishlist(wishlistItem._id);
          alert('Removed from wishlist');
          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        const response = await wishlistService.addToWishlist(itemId);
        if (response.success) {
          alert('Added to wishlist!');
          setIsInWishlist(true);
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleViewReviews = () => {
    if (itemId) {
      navigate(`/items/${itemId}/reviews`);
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

  if (error || !item) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#ef4444', marginBottom: '1rem' }}>
          Item Not Found
        </h2>
        <Button onClick={() => navigate('/items')}>
          Browse Destinations
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/items')}
        style={{ marginBottom: '1rem' }}
      >
        ← Back to Destinations
      </Button>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Image Section */}
        <div>
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: '100%',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
        </div>

        {/* Details Section */}
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: '#111827', 
            marginBottom: '0.5rem' 
          }}>
            {item.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.25rem', color: '#f59e0b' }}>
              ⭐ {item.rating?.toFixed(1) || 'N/A'}
            </span>
            <span style={{ color: '#6b7280' }}>
              ({item.category})
            </span>
          </div>

          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            📍 {item.location}
          </p>

          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
            ৳{item.price}
          </div>

          <p style={{ color: '#374151', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            {item.description}
          </p>

          {/* Availability */}
          <div style={{ 
            padding: '1rem', 
            backgroundColor: item.quantity > 0 ? '#d1fae5' : '#fee2e2',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ 
              fontWeight: 600, 
              color: item.quantity > 0 ? '#059669' : '#dc2626' 
            }}>
              {item.quantity > 0 
                ? `✓ ${item.quantity} spots available` 
                : '✗ Currently unavailable'}
            </p>
          </div>

          {/* Booking Form */}
          {item.quantity > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                Quantity
              </label>
              <select
                value={bookingQuantity}
                onChange={(e) => setBookingQuantity(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                }}
              >
                {Array.from({ length: Math.min(item.quantity, 10) }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
            {item.quantity > 0 && (
              <Button
                onClick={handleBookNow}
                isLoading={bookingLoading}
                size="lg"
                style={{ width: '100%' }}
              >
                🎉 Book Now - ৳{item.price * bookingQuantity}
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleWishlistToggle}
              isLoading={wishlistLoading}
              size="lg"
              style={{ 
                width: '100%',
                color: isInWishlist ? '#ef4444' : '#374151',
                borderColor: isInWishlist ? '#ef4444' : '#d1d5db'
              }}
            >
              {isInWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
            </Button>

            <Button
              variant="ghost"
              onClick={handleViewReviews}
              size="lg"
              style={{ width: '100%' }}
            >
              💬 Read Reviews ({item.rating ? 'See all' : 'Be first'})
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
          Trip Information
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Category</p>
            <p style={{ fontWeight: 600, color: '#111827' }}>{item.category}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Location</p>
            <p style={{ fontWeight: 600, color: '#111827' }}>{item.location}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Price per Person</p>
            <p style={{ fontWeight: 600, color: '#111827' }}>৳{item.price}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Available Spots</p>
            <p style={{ fontWeight: 600, color: item.quantity > 0 ? '#059669' : '#dc2626' }}>
              {item.quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
