import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { itemService } from '../../services/item.service';
import { bookingService } from '../../services/booking.service';
import { wishlistService } from '../../services/wishlist.service';
import type { Item, ItemFilters } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { alert } from '../../utils/sweetAlert';
import { FiSearch, FiFilter, FiDollarSign, FiStar, FiMapPin, FiShoppingCart, FiEye, FiImage, FiHeart, FiClock, FiUsers, FiMessageSquare } from 'react-icons/fi';

export function Items() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ItemFilters>({
    search: '',
    category: '',
    priceMin: undefined,
    priceMax: undefined,
    sort: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; totalPages: number } | undefined>();
  const [bookingLoading, setBookingLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchItems();
    if (user) {
      fetchWishlist();
    }
  }, [filters, user]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getAllItems(filters);
      if (response.success) {
        setItems(response.data as Item[]);
        // @ts-ignore - pagination might not exist
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const response = await wishlistService.getWishlist();
      const wishlistItemIds = new Set<string>();
      response.data.forEach((item: any) => {
        const itemId = typeof item.itemId === 'string' ? item.itemId : item.itemId._id;
        wishlistItemIds.add(itemId);
      });
      setWishlistItems(wishlistItemIds);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  const handleWishlistToggle = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      await alert.warning('Login Required', 'Please login to add items to your wishlist');
      navigate('/login');
      return;
    }

    try {
      setWishlistLoading(true);
      const isInWishlist = wishlistItems.has(itemId);
      
      if (isInWishlist) {
        // Remove from wishlist
        const response = await wishlistService.getWishlist();
        const wishlistItem = response.data.find((w: any) => 
          (typeof w.itemId === 'string' && w.itemId === itemId) || 
          (typeof w.itemId !== 'string' && w.itemId._id === itemId)
        );
        if (wishlistItem?._id) {
          await wishlistService.removeFromWishlist(wishlistItem._id);
          setWishlistItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
          });
          await alert.info('Removed from Wishlist', 'This destination has been removed from your wishlist');
        }
      } else {
        // Add to wishlist
        await wishlistService.addToWishlist(itemId);
        setWishlistItems(prev => new Set(prev).add(itemId));
        await alert.success('Added to Wishlist!', 'This destination has been added to your wishlist');
      }
    } catch (err: any) {
      await alert.error('Wishlist Update Failed', err.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleBookNow = async (itemId: string) => {
    if (!user) {
      await alert.warning('Login Required', 'Please login to book a destination');
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      const response = await bookingService.createBooking({
        itemId,
        quantity: 1,
      });

      if (response.success) {
        await alert.success('Booking Created!', 'Your destination has been booked successfully!');
        navigate('/bookings');
      }
    } catch (err: any) {
      await alert.error('Booking Failed', err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ItemFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem' 
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
          Travel Destinations
        </h1>
      </div>
      
      {/* Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <Input
            label="Search"
            placeholder="Search destinations..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <Input
            label="Category"
            placeholder="Filter by category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          />
          <Input
            label="Min Price"
            type="number"
            value={filters.priceMin?.toString() || ''}
            onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            label="Max Price"
            type="number"
            value={filters.priceMax?.toString() || ''}
            onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
          />
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem',
            }}
          >
            <option value="">Sort By</option>
            <option value="price">Price (Low to High)</option>
            <option value="-price">Price (High to Low)</option>
            <option value="rating">Rating (Low to High)</option>
            <option value="-rating">Rating (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
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

      {/* Items Grid */}
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          No destinations found. Create your first destination!
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {items.map((item) => {
              const isInWishlist = wishlistItems.has(item._id!);
              const galleryCount = (item as any).gallery ? (item as any).gallery.length : 0;
              
              return (
              <div key={item._id} className="card" style={{ 
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                backgroundColor: '#ffffff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
              >
                {/* Image Container */}
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  paddingTop: '60%', // Reduced from 66.67% for shorter image
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6'
                }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  
                  {/* Popular Badge */}
                  {item.rating && item.rating >= 4.5 && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.95)',
                      color: 'white',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '2rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                      backdropFilter: 'blur(8px)',
                      zIndex: 10
                    }}>
                      🔥 Top Rated
                    </div>
                  )}
                  
                  {/* Gallery Count Badge */}
                  {galleryCount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '56px',
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      color: 'white',
                      padding: '0.375rem 0.625rem',
                      borderRadius: '2rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      zIndex: 10
                    }}>
                      <FiImage size={14} /> {galleryCount + 1}
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(item._id!, e)}
                    disabled={wishlistLoading}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      transition: 'all 0.2s ease',
                      opacity: wishlistLoading ? 0.7 : 1,
                      zIndex: 10,
                      backdropFilter: 'blur(4px)'
                    }}
                    onMouseEnter={(e) => {
                      if (!wishlistLoading) {
                        e.currentTarget.style.transform = 'scale(1.15) rotate(5deg)';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!wishlistLoading) {
                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                      }
                    }}
                  >
                    <FiHeart size={20} fill={isInWishlist ? '#ef4444' : 'none'} color={isInWishlist ? '#ef4444' : '#6b7280'} />
                  </button>
                </div>
                <div style={{ 
                  padding: '0.75rem', 
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  backgroundColor: '#ffffff'
                }}>
                  {/* Category Badge */}
                  {item.category && (
                    <span style={{
                      padding: '0.2rem 0.45rem',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '0.75rem',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      marginBottom: '0.4375rem',
                      display: 'inline-block',
                      alignSelf: 'flex-start',
                      letterSpacing: '0.02em'
                    }}>
                      {item.category}
                    </span>
                  )}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'start', 
                    marginBottom: '0.4375rem'
                  }}>
                    <h3 style={{ 
                      fontSize: '0.9375rem', 
                      fontWeight: 700, 
                      color: '#111827',
                      margin: 0,
                      lineHeight: 1.25,
                      maxHeight: '2.5rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      letterSpacing: '-0.01em'
                    }}>
                      {item.title}
                    </h3>
                    {item.rating && (
                      <span style={{ 
                        color: '#f59e0b', 
                        fontWeight: 700, 
                        flexShrink: 0, 
                        marginLeft: '0.4375rem',
                        fontSize: '0.75rem',
                        backgroundColor: '#fef3c7',
                        padding: '0.15rem 0.375rem',
                        borderRadius: '0.25rem'
                      }}>
                        ⭐ {item.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '0.75rem', 
                    marginBottom: '0.4375rem', 
                    margin: 0,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}>
                    📍 {item.location}
                  </p>
                  <p style={{ 
                    color: '#4b5563', 
                    fontSize: '0.75rem', 
                    marginBottom: '0.625rem',
                    margin: 0,
                    lineHeight: 1.45,
                    maxHeight: '3.1rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {item.description}
                  </p>
                  {/* Price and Action Section - Separated by black line */}
                  <div style={{ 
                    marginTop: 'auto',
                    borderTop: '2px solid #000000',
                    paddingTop: '0.625rem'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <div>
                        <span style={{ 
                          fontSize: '0.625rem', 
                          color: '#6b7280', 
                          display: 'block',
                          marginBottom: '0.15rem',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>Price</span>
                        <span style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: 800, 
                          color: '#111827',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.15rem',
                          letterSpacing: '-0.02em'
                        }}>
                          <FiDollarSign size={18} />{item.price}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/items/${item._id}`)}
                      style={{ 
                        width: '100%',
                        fontWeight: 600,
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.8125rem',
                        backgroundColor: '#f9fafb',
                        borderColor: '#d1d5db',
                        color: '#374151',
                        transition: 'all 0.2s ease',
                        borderRadius: '0.375rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#111827';
                        e.currentTarget.style.borderColor = '#111827';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.color = '#374151';
                      }}
                    >
                      <FiEye size={13} style={{ marginRight: '0.3125rem' }} /> View Details
                    </Button>
                  </div>
                </div>
              </div>
            );})}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('page', Math.max(1, (filters.page || 1) - 1))}
                disabled={filters.page === 1}
              >
                Previous
              </Button>
              <span style={{ padding: '0.5rem', color: '#6b7280' }}>
                Page {filters.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('page', Math.min(pagination.totalPages, (filters.page || 1) + 1))}
                disabled={filters.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

    </div>
  );
}
