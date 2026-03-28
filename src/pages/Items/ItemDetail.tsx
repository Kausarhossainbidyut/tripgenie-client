import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { itemService } from '../../services/item.service';
import { bookingService } from '../../services/booking.service';
import { wishlistService } from '../../services/wishlist.service';
import { reviewService } from '../../services/review.service';
import type { Item } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { alert, loading } from '../../utils/sweetAlert';
import { FiHeart, FiShoppingCart, FiEdit, FiTrash2, FiMapPin, FiDollarSign, FiStar, FiMessageSquare, FiEye, FiChevronLeft, FiChevronRight, FiGrid, FiImage, FiCheck, FiX, FiClock, FiUsers, FiTruck, FiCoffee, FiShield, FiPhone, FiMail, FiCalendar, FiDownload, FiShare2 } from 'react-icons/fi';

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
  const [editMode, setEditMode] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Gallery states
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  // Review states
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState({ average: 0, total: 0, distribution: {} });
  
  // Popularity state
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (itemId) {
      fetchItem();
      checkWishlist();
      fetchReviews();
      incrementViewCount();
    }
  }, [itemId]);

  // Initialize gallery when item loads
  useEffect(() => {
    if (item) {
      // Set up gallery images - main image + any additional images
      const images = [item.image];
      // If item has gallery array, add those too
      if ((item as any).gallery && Array.isArray((item as any).gallery)) {
        images.push(...(item as any).gallery);
      }
      setGalleryImages(images);
    }
  }, [item]);

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

  const fetchReviews = async () => {
    if (!itemId) return;
    try {
      const response = await reviewService.getReviewsByItem(itemId);
      if (response.success && response.data) {
        setReviews(response.data);
        
        // Calculate review statistics
        const total = response.data.length;
        const sum = response.data.reduce((acc, review) => acc + review.rating, 0);
        const average = total > 0 ? sum / total : 0;
        
        // Calculate distribution
        const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        response.data.forEach(review => {
          const roundedRating = Math.round(review.rating);
          if (distribution[roundedRating] !== undefined) {
            distribution[roundedRating]++;
          }
        });
        
        setReviewStats({
          average,
          total,
          distribution
        });
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      // Set default values on error
      setReviewStats({ average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
    }
  };

  const incrementViewCount = async () => {
    try {
      // Track view count using localStorage for session-based counting
      const viewedKey = `item_${itemId}_viewed`;
      const hasViewed = localStorage.getItem(viewedKey);
      
      if (!hasViewed) {
        // Mark as viewed in this session
        localStorage.setItem(viewedKey, new Date().toISOString());
        
        // In a real app, you would call an API to increment the view count
        // For now, we'll simulate dynamic data
        const randomViews = Math.floor(Math.random() * 100) + 20; // 20-120 views
        setViewCount(randomViews);
        
        // Optional: Call API to track views (uncomment when backend endpoint is ready)
        // await api.post(`/items/${itemId}/view`);
      } else {
        // Return existing view count from storage or API
        const storedViews = sessionStorage.getItem(`item_${itemId}_views`);
        if (storedViews) {
          setViewCount(parseInt(storedViews));
        } else {
          setViewCount(Math.floor(Math.random() * 50) + 10);
        }
      }
    } catch (err) {
      console.error('Failed to track view:', err);
      setViewCount(0);
    }
  };

  const handleBookNow = async () => {
    if (!user || !itemId) {
      await alert.warning('Login Required', 'Please login to book this destination');
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
        await alert.success('Booking Created!', 'Your destination has been booked successfully!');
        navigate('/bookings');
      }
    } catch (err: any) {
      await alert.error('Booking Failed', err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user || !itemId) {
      await alert.warning('Login Required', 'Please login to add items to your wishlist');
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
          await alert.info('Removed from Wishlist', 'This destination has been removed from your wishlist');
          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        const response = await wishlistService.addToWishlist(itemId);
        if (response.success) {
          await alert.success('Added to Wishlist!', 'This destination has been added to your wishlist');
          setIsInWishlist(true);
        }
      }
    } catch (err: any) {
      await alert.error('Wishlist Update Failed', err.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleViewReviews = () => {
    if (itemId) {
      navigate(`/items/${itemId}/reviews`);
    }
  };

  // Gallery handlers
  const handleNextImage = () => {
    setSelectedImageIndex(prev => (prev + 1) % galleryImages.length);
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const openGalleryModal = () => {
    setShowGalleryModal(true);
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      const response = await itemService.updateItem(itemId!, item);
      if (response.success) {
        await alert.success('Item Updated!', 'The destination information has been updated successfully');
        setEditMode(false);
        fetchItem();
      }
    } catch (err: any) {
      await alert.error('Update Failed', err.response?.data?.message || 'Failed to update item');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    const isConfirmed = await alert.deleteConfirm('this destination');
    if (!isConfirmed) return;
    
    try {
      const response = await itemService.deleteItem(itemId!);
      if (response.success) {
        await alert.success('Item Deleted!', 'The destination has been deleted successfully');
        navigate('/items');
      }
    } catch (err: any) {
      await alert.error('Delete Failed', err.response?.data?.message || 'Failed to delete item');
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
        {/* Enhanced Image Gallery Section */}
        <div>
          {/* Main Image Display */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <img
              src={galleryImages[selectedImageIndex]}
              alt={`View ${selectedImageIndex + 1}`}
              onClick={galleryImages.length > 1 ? openGalleryModal : undefined}
              style={{
                width: '100%',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                cursor: galleryImages.length > 1 ? 'pointer' : 'default',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (galleryImages.length > 1) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
            
            {/* Navigation Arrows for Multiple Images */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePreviousImage}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
                >
                  <FiChevronLeft size={24} />
                </button>
                
                <button
                  onClick={handleNextImage}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
                >
                  <FiChevronRight size={24} />
                </button>
                
                {/* Image Counter */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}>
                  {selectedImageIndex + 1} / {galleryImages.length}
                </div>
                
                {/* View All Button */}
                <button
                  onClick={openGalleryModal}
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    backgroundColor: 'rgba(59, 130, 246, 0.9)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <FiGrid size={16} /> View All ({galleryImages.length})
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(galleryImages.length, 5)}, 1fr)`,
              gap: '0.5rem',
            }}>
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  style={{
                    border: selectedImageIndex === index ? '3px solid #3b82f6' : '2px solid transparent',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: selectedImageIndex === index ? 1 : 0.7,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedImageIndex !== index) {
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '80px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </button>
              ))}
            </div>
          )}
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

          {/* Popularity Indicators */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '1.5rem',
            padding: '0.75rem',
            backgroundColor: '#fef3c7',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <span>🔥 {viewCount} people viewed this today</span>
            <span>⏰ Last booked 2 hours ago</span>
            <span>💚 Added to wishlist {Math.floor(viewCount / 2)} times</span>
          </div>

          {/* What's Included/Excluded */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}>What's Included</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCheck size={18} color='#059669' /> Professional Guide
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCheck size={18} color='#059669' /> Transportation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCheck size={18} color='#059669' /> Entry Fees
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCheck size={18} color='#059669' /> Hotel Pickup
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}>What's Excluded</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiX size={18} color='#dc2626' /> Personal Expenses
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiX size={18} color='#dc2626' /> Travel Insurance
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiX size={18} color='#dc2626' /> Tips & Gratuities
              </div>
            </div>
          </div>

          {/* Suggested Itinerary */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}>Suggested Itinerary</h3>
            <div style={{ 
              borderLeft: '3px solid #3b82f6', 
              paddingLeft: '1rem',
              marginLeft: '0.5rem'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Day 1: Arrival & Check-in</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Morning departure, afternoon arrival, evening welcome dinner</p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Day 2: Full Day Tour</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Visit main attractions, local market tour, cultural experience</p>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Day 3: Departure</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Breakfast and checkout, transfer to airport/station</p>
              </div>
            </div>
          </div>

          {/* Group Information */}
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#eff6ff', 
            borderRadius: '0.5rem', 
            marginBottom: '1.5rem' 
          }}>
            <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiUsers size={20} /> Group Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Max Group Size</p>
                <p style={{ fontWeight: 600, color: '#111827' }}>{item.quantity || 10} people</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Guide</p>
                <p style={{ fontWeight: 600, color: '#111827' }}>Professional Included</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Languages</p>
                <p style={{ fontWeight: 600, color: '#111827' }}>English, Bengali</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Difficulty</p>
                <p style={{ fontWeight: 600, color: '#111827' }}>Easy - Moderate</p>
              </div>
            </div>
          </div>

          {/* Safety Measures */}
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f0fdf4', 
            borderRadius: '0.5rem', 
            marginBottom: '1.5rem' 
          }}>
            <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiShield size={20} /> Safety & Health Measures
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <FiCheck size={16} color='#059669' /> Sanitization protocols
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <FiCheck size={16} color='#059669' /> Social distancing
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <FiCheck size={16} color='#059669' /> First aid kit available
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <FiCheck size={16} color='#059669' /> Vaccinated guides
              </div>
            </div>
          </div>

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

          {/* Action Buttons - Book Now for All Users */}
          <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
            {/* Book Now Button - Show to all users, prompt login if not authenticated */}
            {item.quantity > 0 && (
              <Button
                onClick={handleBookNow}
                isLoading={bookingLoading}
                size="lg"
                style={{ 
                  width: '100%',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  fontWeight: 600
                }}
              >
                <FiShoppingCart size={20} style={{ marginRight: '0.5rem' }} /> Book Now - ৳{item.price * bookingQuantity}
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
              {isInWishlist ? (
                <><FiHeart size={20} style={{ marginRight: '0.5rem' }} /> Remove from Wishlist</>
              ) : (
                <><FiHeart size={20} style={{ marginRight: '0.5rem' }} /> Add to Wishlist</>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleViewReviews}
              size="lg"
              style={{ width: '100%' }}
            >
              <FiMessageSquare size={20} style={{ marginRight: '0.5rem' }} /> {item.rating ? 'Read Reviews' : 'Be first to review'}
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

      {/* Reviews Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
          Guest Reviews ({reviewStats.total})
        </h3>
        
        {/* Rating Summary */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem', 
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: '#f59e0b' }}>
              {reviewStats.average.toFixed(1)}
            </div>
            <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', marginBottom: '0.25rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <FiStar 
                  key={star} 
                  size={20} 
                  fill={star <= Math.round(reviewStats.average) ? '#f59e0b' : 'none'}
                  color='#f59e0b'
                />
              ))}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{reviewStats.total} reviews</div>
          </div>
          
          {/* Rating Distribution */}
          <div style={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map(rating => {
              const count = (reviewStats.distribution as any)[rating] || 0;
              const percentage = reviewStats.total > 0 ? (count / reviewStats.total * 100) : 0;
              return (
                <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', width: '30px' }}>{rating}★</span>
                  <div style={{ flex: 1, height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#f59e0b' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', width: '30px', color: '#6b7280' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((review) => {
            // Handle userId being either a string or User object
            const userName = typeof review.userId === 'string' 
              ? review.userId.split('@')[0] // Use email prefix as name if it's just an ID
              : (review.userId as any)?.name || 'Anonymous';
            
            // Get first letter for avatar
            const initial = userName?.charAt(0)?.toUpperCase() || 'A';
            
            // Format date
            const reviewDate = review.createdAt 
              ? new Date(review.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : 'Recent';
            
            return (
              <div key={review._id || review.id} style={{ 
                padding: '1rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.5rem',
                backgroundColor: '#ffffff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}>
                      {initial}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{userName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{reviewDate}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <FiStar 
                        key={star} 
                        size={16} 
                        fill={star <= review.rating ? '#f59e0b' : 'none'}
                        color='#f59e0b'
                      />
                    ))}
                  </div>
                </div>
                <p style={{ color: '#374151', lineHeight: '1.6', margin: 0 }}>
                  {review.comment}
                </p>
              </div>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          onClick={handleViewReviews}
          style={{ marginTop: '1rem', width: '100%' }}
        >
          View All Reviews
        </Button>
      </div>

      {/* FAQ Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
          Frequently Asked Questions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <details style={{ 
            padding: '1rem', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}>
            <summary style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
              What's the cancellation policy?
            </summary>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.5rem 0 0 0', lineHeight: '1.6' }}>
              Free cancellation up to 24 hours before the trip starts. After that, 50% of the booking amount will be charged.
            </p>
          </details>
          
          <details style={{ 
            padding: '1rem', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}>
            <summary style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
              Is this suitable for children?
            </summary>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.5rem 0 0 0', lineHeight: '1.6' }}>
              Yes! This tour is family-friendly and suitable for children of all ages. We provide child-safe equipment and activities.
            </p>
          </details>
          
          <details style={{ 
            padding: '1rem', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}>
            <summary style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
              What should I bring?
            </summary>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.5rem 0 0 0', lineHeight: '1.6' }}>
              Comfortable walking shoes, sunscreen, hat, camera, light jacket for evenings, and any personal medications.
            </p>
          </details>
          
          <details style={{ 
            padding: '1rem', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}>
            <summary style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
              Do you provide travel insurance?
            </summary>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.5rem 0 0 0', lineHeight: '1.6' }}>
              Travel insurance is not included in the package price. We recommend purchasing separate travel insurance for your protection.
            </p>
          </details>
        </div>
      </div>

      {/* Share & Contact */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {/* Share Buttons */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiShare2 size={20} /> Share This Trip
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="outline" size="sm" style={{ flex: 1 }}>Facebook</Button>
              <Button variant="outline" size="sm" style={{ flex: 1 }}>WhatsApp</Button>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiPhone size={20} /> Need Help?
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiPhone size={16} /> +880-XXX-XXXXXX
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiMail size={16} /> support@tripgenie.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiShield size={16} /> 24/7 Emergency Support
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Gallery Modal */}
      {showGalleryModal && (
        <div 
          onClick={closeGalleryModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '2rem',
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeGalleryModal}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              zIndex: 10000,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ✕
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePreviousImage();
            }}
            style={{
              position: 'absolute',
              left: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              fontSize: '2rem',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          >
            <FiChevronLeft size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
            style={{
              position: 'absolute',
              right: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              fontSize: '2rem',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          >
            <FiChevronRight size={32} />
          </button>

          {/* Main Image - Full Screen */}
          <img
            src={galleryImages[selectedImageIndex]}
            alt={`Gallery view ${selectedImageIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100vh',
              objectFit: 'contain',
              borderRadius: '0.5rem',
            }}
          />

          {/* Thumbnail Strip at Bottom */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '1rem',
            backdropFilter: 'blur(8px)',
          }}>
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(index);
                }}
                style={{
                  border: selectedImageIndex === index ? '3px solid #3b82f6' : '2px solid transparent',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: selectedImageIndex === index ? 1 : 0.6,
                  width: '80px',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (selectedImageIndex !== index) {
                    e.currentTarget.style.opacity = '1';
                  }
                }}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '60px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Image Counter */}
          <div style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '1.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            backdropFilter: 'blur(4px)',
          }}>
            {selectedImageIndex + 1} / {galleryImages.length} images
          </div>
        </div>
      )}
    </div>
  );
}
