import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { itemService } from '../../services/item.service';
import { EditItemModal } from '../../components/ui/EditItemModal';
import type { Item, ItemFilters } from '../../types';

export function Items() {
  const navigate = useNavigate();
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Item>>({
    title: '',
    description: '',
    image: '',
    price: 0,
    rating: 0,
    location: '',
    category: '',
    quantity: 0,
  });

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

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await itemService.createItem(newItem);
      if (response.success) {
        alert('Item created successfully!');
        setShowCreateForm(false);
        fetchItems();
        setNewItem({
          title: '',
          description: '',
          image: '',
          price: 0,
          rating: 0,
          location: '',
          category: '',
          quantity: 0,
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create item');
    }
  };

  const handleUpdateItem = async (itemId: string, updateData: Partial<Item>) => {
    try {
      setUpdateLoading(true);
      const response = await itemService.updateItem(itemId, updateData);
      if (response.success) {
        alert('Item updated successfully!');
        setEditingItem(null);
        fetchItems();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update item');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await itemService.deleteItem(itemId);
      if (response.success) {
        alert('Item deleted successfully!');
        fetchItems();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete item');
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
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Add New Destination'}
        </Button>
      </div>

      {/* Create Item Form */}
      {showCreateForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>
            Create New Destination
          </h2>
          <form onSubmit={handleCreateItem} className="space-y-4">
            <Input
              label="Title"
              placeholder="Destination name"
              value={newItem.title}
              onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <Input
              label="Description"
              placeholder="Describe this destination"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              required
            />
            <Input
              label="Image URL"
              placeholder="https://..."
              value={newItem.image}
              onChange={(e) => setNewItem(prev => ({ ...prev, image: e.target.value }))}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Input
                label="Price (BDT)"
                type="number"
                value={newItem.price?.toString()}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: Number(e.target.value) }))}
                required
              />
              <Input
                label="Location"
                placeholder="Where is it located?"
                value={newItem.location}
                onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                required
              />
              <Input
                label="Category"
                placeholder="e.g., Beach, Mountain"
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                required
              />
              <Input
                label="Quantity Available"
                type="number"
                value={newItem.quantity?.toString()}
                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                required
              />
            </div>
            <Button type="submit" style={{ width: '100%' }}>
              Create Destination
            </Button>
          </form>
        </div>
      )}

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
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
                      ৳{item.price}
                    </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/items/${item._id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItem(item._id!)}
                          style={{ color: '#ef4444', borderColor: '#ef4444' }}
                        >
                          Delete
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

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdateItem}
          loading={updateLoading}
        />
      )}
    </div>
  );
}
