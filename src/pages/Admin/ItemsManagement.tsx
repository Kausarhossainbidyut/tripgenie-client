import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { itemService } from '../../services/item.service';
import type { Item, ItemFilters } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { alert, loading } from '../../utils/sweetAlert';

export function AdminItemsManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ItemFilters>({
    search: '',
    category: '',
    priceMin: undefined,
    priceMax: undefined,
    sort: '',
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; totalPages: number } | undefined>();
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
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
      setIsLoading(true);
      const response = await itemService.getAllItems(filters);
      if (response.success) {
        setItems(response.data as Item[]);
        // @ts-ignore - pagination might not exist
        setPagination(response.pagination || response.meta);
      }
    } catch (err: any) {
      console.error('Failed to fetch items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loading.show('Creating destination...');
      const response = await itemService.createItem(newItem);
      if (response.success) {
        alert.success('Destination created successfully!');
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
      loading.hide();
    } catch (err: any) {
      loading.hide();
      alert.error('Failed to create destination', err.response?.data?.message);
    }
  };

  const handleUpdateItem = async (itemId: string, updateData: Partial<Item>) => {
    try {
      loading.show('Updating destination...');
      const response = await itemService.updateItem(itemId, updateData);
      if (response.success) {
        alert.success('Destination updated successfully!');
        setEditingItem(null);
        fetchItems();
      }
      loading.hide();
    } catch (err: any) {
      loading.hide();
      alert.error('Failed to update destination', err.response?.data?.message);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const confirmed = await alert.deleteConfirm('this destination');
    if (!confirmed) return;

    try {
      loading.show('Deleting destination...');
      const response = await itemService.deleteItem(itemId);
      if (response.success) {
        alert.success('Destination deleted successfully!');
        fetchItems();
      }
      loading.hide();
    } catch (err: any) {
      loading.hide();
      alert.error('Failed to delete destination', err.response?.data?.message);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (!user || user.role !== 'admin') {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Access denied. Admin only.</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
          Manage Destinations
        </h2>
        <Button onClick={() => setShowCreateForm(true)}>
          + Add New Destination
        </Button>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem'
      }}>
        <Input
          placeholder="Search destinations..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
        <Input
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        />
        <Input
          type="number"
          placeholder="Min Price"
          value={filters.priceMin?.toString() || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, priceMin: Number(e.target.value) }))}
        />
        <Input
          type="number"
          placeholder="Max Price"
          value={filters.priceMax?.toString() || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, priceMax: Number(e.target.value) }))}
        />
        <select
          value={filters.sort || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
          style={{
            padding: '0.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db',
            fontSize: '0.875rem',
          }}
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Rating: High to Low</option>
        </select>
      </div>

      {/* Create Item Form */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
              Create New Destination
            </h3>
            <form onSubmit={handleCreateItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                label="Title"
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <Input
                label="Image URL"
                value={newItem.image}
                onChange={(e) => setNewItem(prev => ({ ...prev, image: e.target.value }))}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  type="number"
                  label="Price (৳)"
                  value={newItem.price}
                  onChange={(e) => setNewItem(prev => ({ ...prev, price: Number(e.target.value) }))}
                  required
                />
                <Input
                  type="number"
                  label="Quantity Available"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  type="number"
                  label="Rating (0-5)"
                  value={newItem.rating}
                  onChange={(e) => setNewItem(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  min="0"
                  max="5"
                  step="0.1"
                />
                <Input
                  label="Location"
                  value={newItem.location}
                  onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
              <Input
                label="Category"
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Hill Station, Beach, Historical Site"
                required
              />
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={() => setShowCreateForm(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={updateLoading}>
                  {updateLoading ? 'Creating...' : 'Create Destination'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Image</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Title</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Location</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Category</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Price</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Rating</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Quantity</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  Loading destinations...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  No destinations found
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <img 
                      src={item.image} 
                      alt={item.title}
                      style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '0.25rem' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 500 }}>{item.title}</td>
                  <td style={{ padding: '0.75rem', color: '#6b7280' }}>{item.location}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#059669' }}>৳{item.price}</td>
                  <td style={{ padding: '0.75rem', color: '#f59e0b' }}>⭐ {item.rating?.toFixed(1)}</td>
                  <td style={{ padding: '0.75rem', color: item.quantity > 0 ? '#059669' : '#ef4444' }}>
                    {item.quantity} available
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingItem(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteItem(item._id!)}
                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.5rem',
          marginTop: '1.5rem'
        }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <span style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#3b82f6', 
            color: 'white',
            borderRadius: '0.375rem',
            fontWeight: 600
          }}>
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
              Edit Destination
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateItem(editingItem._id!, editingItem);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                label="Title"
                value={editingItem.title}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                required
              />
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <Input
                label="Image URL"
                value={editingItem.image}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, image: e.target.value }) : null)}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  type="number"
                  label="Price (৳)"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, price: Number(e.target.value) }) : null)}
                  required
                />
                <Input
                  type="number"
                  label="Quantity Available"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, quantity: Number(e.target.value) }) : null)}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  type="number"
                  label="Rating (0-5)"
                  value={editingItem.rating}
                  onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, rating: Number(e.target.value) }) : null)}
                  min="0"
                  max="5"
                  step="0.1"
                />
                <Input
                  label="Location"
                  value={editingItem.location}
                  onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, location: e.target.value }) : null)}
                  required
                />
              </div>
              <Input
                label="Category"
                value={editingItem.category}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                required
              />
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={() => setEditingItem(null)} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={updateLoading}>
                  {updateLoading ? 'Updating...' : 'Update Destination'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
