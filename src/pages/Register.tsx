import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { alert } from '../utils/sweetAlert';
import { FiUser, FiMail, FiLock, FiUserPlus, FiLogIn, FiEye, FiEyeOff, FiGlobe, FiCheck } from 'react-icons/fi';

const T = { grad: 'linear-gradient(135deg, #0d9488, #06b6d4)', teal: '#0d9488', cyan: '#06b6d4' };

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      await alert.success('Account Created!', 'Welcome to TripGenie! Please sign in to continue.');
      navigate('/login');
    } catch (err: any) {
      setErrors({ submit: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const pwColors = ['', '#ef4444', '#f59e0b', '#10b981'];
  const pwLabels = ['', 'Weak', 'Good', 'Strong'];

  const Field = ({ id, label, type = 'text', icon, placeholder, value, error, onChange, extra }: any) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', pointerEvents: 'none' }}>{icon}</span>
        <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
          style={{ width: '100%', padding: `0.75rem ${extra ? '3rem' : '1rem'} 0.75rem 2.75rem`, border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`, borderRadius: '12px', fontSize: '0.9375rem', outline: 'none', background: '#f8fafc', transition: 'all 0.2s', fontFamily: 'inherit' }}
          onFocus={e => { e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.1)'; e.currentTarget.style.background = '#fff'; }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? '#ef4444' : '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#f8fafc'; }}
        />
        {extra}
      </div>
      {error && <p style={{ fontSize: '0.8125rem', color: '#ef4444', marginTop: '0.375rem' }}>{error}</p>}
    </div>
  );

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f0fdf4 100%)',
      padding: '2rem 1rem', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(13,148,136,0.12)', boxShadow: '0 20px 60px rgba(13,148,136,0.12), 0 4px 16px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ height: '4px', background: T.grad }} />
          <div style={{ padding: '2.5rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <motion.div whileHover={{ scale: 1.05, rotate: -5 }}
                style={{ width: '56px', height: '56px', borderRadius: '16px', background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(13,148,136,0.35)' }}>
                <FiGlobe size={26} color="white" />
              </motion.div>
              <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>Create account</h1>
              <p style={{ fontSize: '0.9375rem', color: '#64748b' }}>Join TripGenie and start exploring</p>
            </div>

            {/* Perks */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
              {['Free to join', 'AI-powered', 'Instant booking'].map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiCheck size={11} color={T.teal} />
                  </div>
                  {p}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <Field id="name" label="Full name" icon={<FiUser size={16}/>} placeholder="John Doe"
                value={form.name} error={errors.name} onChange={(e: any) => setForm(p => ({ ...p, name: e.target.value }))} />
              <Field id="email" label="Email address" type="email" icon={<FiMail size={16}/>} placeholder="you@example.com"
                value={form.email} error={errors.email} onChange={(e: any) => setForm(p => ({ ...p, email: e.target.value }))} />

              {/* Password with strength */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 6 characters"
                    style={{ width: '100%', padding: '0.75rem 3rem 0.75rem 2.75rem', border: `1.5px solid ${errors.password ? '#ef4444' : '#e2e8f0'}`, borderRadius: '12px', fontSize: '0.9375rem', outline: 'none', background: '#f8fafc', transition: 'all 0.2s', fontFamily: 'inherit' }}
                    onFocus={e => { e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.1)'; e.currentTarget.style.background = '#fff'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.password ? '#ef4444' : '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#f8fafc'; }}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                    {showPw ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                  </button>
                </div>
                {form.password && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '0.25rem' }}>
                      {[1,2,3].map(i => (
                        <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= pwStrength ? pwColors[pwStrength] : '#e2e8f0', transition: 'background 0.3s' }} />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: pwColors[pwStrength], fontWeight: 600 }}>{pwLabels[pwStrength]}</p>
                  </div>
                )}
                {errors.password && <p style={{ fontSize: '0.8125rem', color: '#ef4444', marginTop: '0.375rem' }}>{errors.password}</p>}
              </div>

              {errors.submit && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', fontSize: '0.875rem', color: '#dc2626', marginBottom: '1.25rem' }}>
                  {errors.submit}
                </motion.div>
              )}

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '0.875rem', background: loading ? '#94a3b8' : T.grad, border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, color: 'white', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: loading ? 'none' : '0 6px 20px rgba(13,148,136,0.4)', transition: 'all 0.2s' }}>
                {loading ? (
                  <><div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%' }} /> Creating account...</>
                ) : (
                  <><FiUserPlus size={18}/> Create Account</>
                )}
              </motion.button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9375rem', color: '#64748b' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: T.teal, fontWeight: 700, textDecoration: 'none' }}>
                Sign in <FiLogIn size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
