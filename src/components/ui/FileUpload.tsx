import { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { uploadService } from '../../services/upload.service';
import type { UploadResponse } from '../../types';

interface FileUploadProps {
  onUpload?: (response: UploadResponse) => void;
  onMultipleUpload?: (responses: UploadResponse[]) => void;
  multiple?: boolean;
  accept?: string;
  label?: string;
}

export function FileUpload({ 
  onUpload, 
  onMultipleUpload, 
  multiple = false, 
  accept = 'image/*',
  label = 'Upload Image'
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      
      if (multiple) {
        // Upload multiple files
        const filesArray = Array.from(files);
        const response = await uploadService.uploadTravelImages(filesArray);
        
        if (response.success) {
          const urls = response.data.map(item => item.url);
          setUploadedUrls(prev => [...prev, ...urls]);
          if (onMultipleUpload) {
            onMultipleUpload(response.data);
          }
          alert(`Successfully uploaded ${response.data.length} images!`);
        }
      } else {
        // Upload single file
        const file = files[0];
        const response = await uploadService.uploadProfileImage(file);
        
        if (response.success) {
          setPreview(response.data.url);
          if (onUpload) {
            onUpload(response.data);
          }
          alert('Image uploaded successfully!');
          
          // Show delete URL for reference
          console.log('Delete URL:', response.data.delete_url);
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = (index: number) => {
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
    if (index === 0 && preview) {
      setPreview(null);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        multiple={multiple}
        disabled={uploading}
        style={{ display: 'none' }}
      />

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        isLoading={uploading}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        {uploading ? 'Uploading...' : `📷 ${label}`}
      </Button>

      {/* Single Image Preview */}
      {!multiple && preview && (
        <div style={{ position: 'relative', marginTop: '1rem' }}>
          <img
            src={preview}
            alt="Uploaded preview"
            style={{
              width: '100%',
              maxHeight: '300px',
              objectFit: 'cover',
              borderRadius: '0.5rem',
            }}
          />
          <button
            onClick={() => {
              setPreview(null);
              if (onUpload) {
                // Notify parent that image was removed
              }
            }}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              padding: '0.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Multiple Images Preview */}
      {multiple && uploadedUrls.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          {uploadedUrls.map((url, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                }}
              />
              <button
                onClick={() => handleDeleteImage(index)}
                style={{
                  position: 'absolute',
                  top: '0.25rem',
                  right: '0.25rem',
                  padding: '0.25rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Tips */}
      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        backgroundColor: '#eff6ff',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        color: '#1e40af'
      }}>
        <strong>💡 Tips:</strong>
        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
          <li>Supported formats: JPG, PNG, WebP</li>
          <li>Maximum file size: 5MB</li>
          <li>Images are uploaded to cloud storage</li>
          <li>Save the delete URL for future reference</li>
        </ul>
      </div>
    </div>
  );
}
