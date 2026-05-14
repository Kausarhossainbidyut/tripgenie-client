import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { wishlistService } from '../../services/wishlist.service';
import type { WishlistItem, Item } from '../../types';
import { alert } from '../../utils/sweetAlert';
import { FiHeart, FiTrash2, FiMapPin, FiEye, FiStar } from 'react-icons/fi';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

const T = { grad: 'linear-gradient(135deg, #0d9488, #06b6d4)', teal: '#0d9488' };

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => { fetchWishlist(); }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      if (res.success) setWishlist(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    const ok = await alert.confirm({ title: 'Remove from Wishlist?', text: 'Are you sure?', confirmButtonText: 'Remove', cancelButtonText: 'Cancel' });
    if (!ok) return;
    try {
      setProcessing(id);
      await wishlistService.removeFromWishlist(id);
      setWishlist(p => p.filter(w => w._id !== id));
      await alert.info('Removed', 'Item removed from wishlist');
    } catch (err: any) {
      await alert.error('Error', err.response?.data?.message || 'Failed to remove');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return (
    <div className="page-wrap">
      <LoadingSkeleton height={80} className="mb-8" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ borderRadius: '20px', overflow: 'hidden', background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <LoadingSkeleton height={200} />
            <div style={{ padding: '1.25rem' }}>
              <LoadingSkeleton height={22} className="mb-2" />
              <LoadingSkeleton height={16} width="60%" className="mb-4" />
              <LoadingSkeleton height={40} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 68px)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #042f2e 0%, #0f4c4c 60%, #0c4a6e 100%)', padding: 'clamp(2.5rem,5vw,4rem) 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiHeart size={24} color="#f87171" fill="#f87171" />
              </div>
              <div>
                <h1 style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', margin: 0 }}>My Wishlist</h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9375rem', margin: 0 }}>
                  {wishlist.length} saved destination{wishlist.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="page-wrap">
        {error && (
          <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>{error}</div>
        )}

        {wishlist.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <FiHeart size={36} color="#f87171" />
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Your wishlist is empty</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9375rem' }}>Save destinations you love and come back to them anytime.</p>
            <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/items')}
              style={{ padding: '0.875rem 2rem', background: T.grad, border: 'none', borderRadius: '12px', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 6px 20px rgba(13,148,136,0.35)' }}>
              <FiMapPin size={16} /> Browse Destinations
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <AnimatePresence>
              {wishlist.map((item, i) => {
                const dest = item.itemId as Item;
                return (
                  <FadeUp key={item._id} delay={i * 0.06}>
                    <motion.div whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(0,0,0,0.12)' }} transition={{ duration: 0.3 }}
                      style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                      {/* Image */}
                      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                        <img src={dest.image} alt={dest.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                        {dest.rating && (
                          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.625rem', background: 'rgba(0,0,0,0.7)', borderRadius: '9999px', backdropFilter: 'blur(8px)' }}>
                            <FiStar size={12} color="#fbbf24" fill="#fbbf24" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{dest.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.2rem 0.5rem', background: 'rgba(13,148,136,0.9)', color: 'white', borderRadius: '6px' }}>{dest.category}</span>
                        </div>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemove(item._id!)}
                          disabled={processing === item._id}
                          style={{ position: 'absolute', top: '12px', right: '12px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                          {processing === item._id
                            ? <div className="animate-spin" style={{ width: '14px', height: '14px', border: '2px solid #e2e8f0', borderTopColor: '#ef4444', borderRadius: '50%' }} />
                            : <FiTrash2 size={15} color="#ef4444" />}
                        </motion.button>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.375rem', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{dest.title}</h3>
                        <p style={{ fontSize: '0.8125rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem' }}>
                          <FiMapPin size={13} /> {dest.location}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <p style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>Price</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>৳{dest.price.toLocaleString()}</p>
                          </div>
                          <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(`/items/${dest._id}`)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.125rem', background: T.grad, border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(13,148,136,0.35)' }}>
                            <FiEye size={15} /> View
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </FadeUp>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
