import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { reviewService } from '../../services/review.service';
import { itemService } from '../../services/item.service';
import { aiService } from '../../services/ai.service';
import type { Review, Item } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { alert, loading } from '../../utils/sweetAlert';
import { FiStar, FiTrash2, FiMessageSquare, FiSmile } from 'react-icons/fi';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

export function Reviews() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (itemId) {
      fetchReviews();
      fetchItemDetails();
    }
  }, [itemId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      if (!itemId) return;
      const response = await reviewService.getReviewsByItem(itemId);
      if (response.success) {
        setReviews(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchItemDetails = async () => {
    try {
      if (!itemId) return;
      const response = await itemService.getItemById(itemId);
      if (response.success) {
        setItem(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch item details:', err);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || !user) return;

    try {
      setSubmitting(true);
      const response = await reviewService.createReview({
        itemId,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      if (response.success) {
        await alert.success('Review Added!', 'Thank you for sharing your experience');
        setNewReview({ rating: 5, comment: '' });
        setShowForm(false);
        fetchReviews();
      }
    } catch (err: any) {
      await alert.error('Review Failed', err.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const isConfirmed = await alert.deleteConfirm('this review');
    if (!isConfirmed) return;

    try {
      const response = await reviewService.deleteReview(reviewId);
      if (response.success) {
        await alert.success('Review Deleted!', 'The review has been removed successfully');
        fetchReviews();
      }
    } catch (err: any) {
      await alert.error('Delete Failed', err.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleGetAISummary = async () => {
    if (!itemId) return;

    try {
      setLoadingAI(true);
      const response = await aiService.getReviewSummary({ itemId });
      if (response.success) {
        setAiSummary(response.data.summary);
      }
    } catch (err: any) {
      await alert.error('AI Summary Failed', err.response?.data?.message || 'Failed to get AI summary');
    } finally {
      setLoadingAI(false);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
        {/* Header Skeleton */}
        <LoadingSkeleton height={40} width={160} className="mb-4" />
        
        {/* Item Info Skeleton */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <LoadingSkeleton height={24} count={2} className="mb-2" />
          <LoadingSkeleton height={16} width="60%" />
        </div>

        {/* AI Summary Skeleton */}
        {aiSummary && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <LoadingSkeleton height={20} width={120} className="mb-2" />
            <LoadingSkeleton height={16} count={3} />
          </div>
        )}

        {/* Reviews List Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <LoadingSkeleton height={40} width={40} variant="circular" />
                <div style={{ flex: 1 }}>
                  <LoadingSkeleton height={18} width={120} className="mb-2" />
                  <LoadingSkeleton height={14} width={80} />
                </div>
                <LoadingSkeleton height={36} width={80} />
              </div>
              <LoadingSkeleton height={16} count={3} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: '1rem' }}
      >
        ← Back
      </Button>

      {/* Item Info */}
      {item && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '0.5rem',
              }}
            />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
                {item.title}
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                📍 {item.location}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>
                  ⭐ {getAverageRating()}
                </span>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* AI Summary Button */}
      {reviews.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Button
            variant="outline"
            onClick={handleGetAISummary}
            isLoading={loadingAI}
            style={{ width: '100%' }}
          >
            🤖 Get AI Summary of Reviews
          </Button>
          
          {aiSummary && (
            <div className="card" style={{ marginTop: '1rem', backgroundColor: '#eff6ff' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.5rem' }}>
                AI Review Summary
              </h3>
              <p style={{ color: '#1e3a8a', lineHeight: '1.6' }}>{aiSummary}</p>
            </div>
          )}
        </div>
      )}

      {/* Add Review Button */}
      {user ? (
        <Button
          onClick={() => setShowForm(!showForm)}
          style={{ width: '100%', marginBottom: '1.5rem' }}
        >
          {showForm ? 'Cancel' : '✍️ Write a Review'}
        </Button>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
            Login to write a review
          </p>
          <Button onClick={() => navigate('/login')} size="sm">
            Login
          </Button>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleAddReview} className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
            Write Your Review
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
              Rating
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= newReview.rating ? '#f59e0b' : '#d1d5db',
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Your Review"
            placeholder="Share your experience..."
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            required
          />

          <Button type="submit" style={{ width: '100%', marginTop: '1rem' }} isLoading={submitting}>
            Submit Review
          </Button>
        </form>
      )}

      {/* Reviews List */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
          Customer Reviews ({reviews.length})
        </h3>
      </div>

      {reviews.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#6b7280' }}>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((review) => {
            const reviewer = typeof review.userId === 'object' ? review.userId : null;
            return (
              <div key={review._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem', color: '#f59e0b' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                      <span style={{ fontWeight: 600, color: '#111827' }}>
                        {reviewer?.name || 'Anonymous'}
                      </span>
                    </div>
                    {review.createdAt && (
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {(user?.id === review.userId || user?.role === 'admin') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteReview(review._id!)}
                      style={{ color: '#ef4444', borderColor: '#ef4444' }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>{review.comment}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
