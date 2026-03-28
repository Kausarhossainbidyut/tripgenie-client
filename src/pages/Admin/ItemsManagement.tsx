import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { itemService } from '../../services/item.service';
import { uploadService } from '../../services/upload.service';
import type { Item, ItemFilters } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { alert, loading } from '../../utils/sweetAlert';
import { FiUpload, FiImage, FiTrash2, FiEdit } from 'react-icons/fi';

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
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  const [editUploadingImage, setEditUploadingImage] = useState(false);
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Multiple image upload state
  const [selectedMultipleImages, setSelectedMultipleImages] = useState<File[]>([]);
  const [multipleImagePreviews, setMultipleImagePreviews] = useState<string[]>([]);
  const [uploadingMultipleImages, setUploadingMultipleImages] = useState(false);
  const [uploadedGalleryUrls, setUploadedGalleryUrls] = useState<string[]>([]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      await alert.error('Invalid File', 'Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      await alert.error('File Too Large', 'Maximum file size is 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      
      console.log('Starting upload...', file.name, file.size, file.type);
      
      // Upload item image using dedicated endpoint
      const uploadResult = await uploadService.uploadItemImage(file);
      
      console.log('Upload result:', uploadResult);
      
      // uploadResult is now UploadResponse directly with url property
      if (uploadResult && uploadResult.url) {
        // Set the image URL in the form
        setNewItem(prev => ({ ...prev, image: uploadResult.url }));
        setImagePreview(uploadResult.url);
        setSelectedImage(file);
        await alert.success('Image Uploaded!', 'Image uploaded successfully');
      } else {
        console.error('No URL in upload result');
        throw new Error('Upload failed - no URL returned from server');
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload image';
      
      await alert.error('Upload Failed', errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      await alert.error('Invalid File', 'Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      await alert.error('File Too Large', 'Maximum file size is 5MB');
      return;
    }

    try {
      setEditUploadingImage(true);
      
      // Upload item image using dedicated endpoint
      const uploadResult = await uploadService.uploadItemImage(file);
      
      // uploadResult is now UploadResponse directly with url property
      if (uploadResult && uploadResult.url) {
        // Set the image URL in the editing item
        setEditingItem(prev => prev ? ({ ...prev, image: uploadResult.url }) : null);
        setEditImagePreview(uploadResult.url);
        await alert.success('Image Uploaded!', 'Image uploaded successfully');
      } else {
        throw new Error('Upload failed - no URL returned from server');
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      await alert.error('Upload Failed', err.response?.data?.message || 'Failed to upload image');
    } finally {
      setEditUploadingImage(false);
    }
  };

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    console.log('Files selected for upload:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));

    // Validate all files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        await alert.error('Invalid File', 'Please select image files only');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        await alert.error('File Too Large', `File "${file.name}" exceeds 5MB limit`);
        return;
      }
    }

    // Limit to 5 images as per backend API
    if (files.length > 5) {
      await alert.warning('Too Many Files', 'Maximum 5 images allowed at once');
      files.splice(5); // Keep only first 5
    }

    try {
      setUploadingMultipleImages(true);
      
      console.log('Starting multiple image upload...', files.length, 'files');
      
      // Upload multiple images using travel-images endpoint
      const uploadResults = await uploadService.uploadTravelImages(files);
      
      console.log('Upload results:', uploadResults);
      
      if (uploadResults && uploadResults.length > 0) {
        // Extract URLs from all uploaded images
        const urls = uploadResults.map(result => result.url);
        
        console.log('Extracted URLs:', urls);
        
        // Add to gallery URLs
        setUploadedGalleryUrls(prev => [...prev, ...urls]);
        
        // Create previews for all uploaded images
        const previews = urls;
        setMultipleImagePreviews(prev => [...prev, ...previews]);
        
        await alert.success('Images Uploaded!', `${uploadResults.length} image(s) uploaded successfully`);
      } else {
        console.error('No results returned from upload');
        throw new Error('Upload failed - no images returned');
      }
    } catch (err: any) {
      console.error('Multiple image upload error:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      console.error('Error message:', err.message);
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload images';
      
      await alert.error('Upload Failed', errorMessage);
    } finally {
      setUploadingMultipleImages(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setMultipleImagePreviews(prev => prev.filter((_, i) => i !== index));
    setUploadedGalleryUrls(prev => prev.filter((_, i) => i !== index));
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
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Image Upload</label>
                <div style={{ 
                  border: '2px dashed #d1d5db',
                  borderRadius: '0.375rem',
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: imagePreview ? '#f0fdf4' : '#f9fafb'
                }}>
                  {imagePreview ? (
                    <div>
                      <img 
                        src={imagePreview} 
                        alt="Preview"
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '0.375rem',
                          marginBottom: '1rem'
                        }}
                      />
                      <p style={{ color: '#059669', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                        ✓ Image uploaded successfully
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImagePreview('');
                          setSelectedImage(null);
                          setNewItem(prev => ({ ...prev, image: '' }));
                        }}
                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                      >
                        <FiTrash2 style={{ marginRight: '0.25rem' }} /> Remove
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <FiUpload size={32} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
                      <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>
                        Upload destination image to imgBB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        style={{ display: 'none' }}
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        isLoading={uploadingImage}
                      >
                        <FiUpload style={{ marginRight: '0.5rem' }} />
                        {uploadingImage ? 'Uploading...' : 'Choose Image'}
                      </Button>
                      <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        Max size: 5MB. Formats: JPG, PNG, WebP
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Multiple Image Upload - Gallery */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Gallery Images (Up to 5 images)
                </label>
                <div style={{ 
                  border: '2px dashed #d1d5db',
                  borderRadius: '0.375rem',
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb'
                }}>
                  {multipleImagePreviews.length > 0 ? (
                    <div>
                      <p style={{ color: '#059669', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        ✓ {multipleImagePreviews.length} image(s) uploaded
                      </p>
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '0.75rem',
                        marginBottom: '1rem'
                      }}>
                        {multipleImagePreviews.map((preview, index) => (
                          <div key={index} style={{ position: 'relative' }}>
                            <img 
                              src={preview} 
                              alt={`Gallery ${index + 1}`}
                              style={{ 
                                width: '100%', 
                                height: '120px', 
                                objectFit: 'cover',
                                borderRadius: '0.375rem'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(index)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('multiple-image-upload')?.click()}
                        isLoading={uploadingMultipleImages}
                        disabled={multipleImagePreviews.length >= 5}
                      >
                        <FiUpload style={{ marginRight: '0.5rem' }} />
                        {multipleImagePreviews.length >= 5 ? 'Max Images Reached' : 'Add More Images'}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <FiUpload size={32} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
                      <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>
                        Upload multiple destination images (gallery)
                      </p>
                      <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                        Select up to 5 images at once
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultipleImageUpload}
                        disabled={uploadingMultipleImages}
                        style={{ display: 'none' }}
                        id="multiple-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('multiple-image-upload')?.click()}
                        isLoading={uploadingMultipleImages}
                      >
                        <FiUpload style={{ marginRight: '0.5rem' }} />
                        Choose Multiple Images
                      </Button>
                      <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        Max size: 5MB each. Formats: JPG, PNG, WebP
                      </p>
                    </div>
                  )}
                </div>
              </div>

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
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setImagePreview('');
                    setSelectedImage(null);
                    setMultipleImagePreviews([]);
                    setUploadedGalleryUrls([]);
                  }} 
                  type="button"
                >
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
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Image Upload</label>
                <div style={{ 
                  border: '2px dashed #d1d5db',
                  borderRadius: '0.375rem',
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: editImagePreview || editingItem.image ? '#f0fdf4' : '#f9fafb'
                }}>
                  {(editImagePreview || editingItem.image) ? (
                    <div>
                      <img 
                        src={editImagePreview || editingItem.image} 
                        alt="Current"
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '0.375rem',
                          marginBottom: '1rem'
                        }}
                      />
                      <p style={{ color: '#059669', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                        ✓ Current image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageUpload}
                        disabled={editUploadingImage}
                        style={{ display: 'none' }}
                        id="edit-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('edit-image-upload')?.click()}
                        isLoading={editUploadingImage}
                        style={{ marginRight: '0.5rem' }}
                      >
                        <FiUpload style={{ marginRight: '0.5rem' }} />
                        {editUploadingImage ? 'Uploading...' : 'Change Image'}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <FiUpload size={32} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
                      <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>
                        Upload new destination image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageUpload}
                        disabled={editUploadingImage}
                        style={{ display: 'none' }}
                        id="edit-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('edit-image-upload')?.click()}
                        isLoading={editUploadingImage}
                      >
                        <FiUpload style={{ marginRight: '0.5rem' }} />
                        {editUploadingImage ? 'Uploading...' : 'Choose Image'}
                      </Button>
                      <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        Max size: 5MB. Formats: JPG, PNG, WebP
                      </p>
                    </div>
                  )}
                </div>
              </div>
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
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingItem(null);
                    setEditImagePreview('');
                  }} 
                  type="button"
                >
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
