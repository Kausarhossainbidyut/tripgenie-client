import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { itemService } from '../../services/item.service';
import { bookingService } from '../../services/booking.service';
import type { Item, ItemFilters } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { alert } from '../../utils/sweetAlert';
import { FiSearch, FiFilter, FiDollarSign, FiStar, FiMapPin, FiShoppingCart, FiEye } from 'react-icons/fi';

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

  useEffect(() => {
    fetchItems();
  }, [filters]);

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
            {items.map((item) => (
              <div key={item._id} className="card" style={{ padding: '0' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '0.5rem 0.5rem 0 0',
                  }}
                />
                <div style={{ padding: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'start', 
                    marginBottom: '0.5rem' 
                  }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>
                      {item.title}
                    </h3>
                    {item.rating && (
                      <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                        ⭐ {item.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    📍 {item.location}
                  </p>
                  <p style={{ color: '#374151', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    {item.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '1rem'
                  }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FiDollarSign size={20} />{item.price}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {/* Show Book Now button only for regular users (not admins) */}
                      {user && user.role !== 'admin' && (
                        <Button
                          size="sm"
                          onClick={() => handleBookNow(item._id!)}
                          isLoading={bookingLoading}
                          disabled={!item.quantity || item.quantity === 0}
                          style={{ 
                            backgroundColor: item.quantity > 0 ? '#3b82f6' : '#9ca3af',
                            color: 'white',
                            border: 'none'
                          }}
                        >
                          <FiShoppingCart size={16} style={{ marginRight: '0.25rem' }} /> Book Now
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/items/${item._id}`)}
                        style={{ flex: 1 }}
                      >
                        <FiEye size={16} style={{ marginRight: '0.25rem' }} /> View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
