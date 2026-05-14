import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { APP_NAME } from '../../../constants';
import {
  FiGlobe, FiMapPin, FiMessageSquare, FiHeart, FiCalendar,
  FiLogOut, FiMenu, FiX, FiLogIn, FiUserPlus,
  FiShield, FiHelpCircle, FiChevronDown, FiGrid,
} from 'react-icons/fi';

/* ── animation variants ── */
const dropdownV = {
  hidden:  { opacity: 0, y: -8, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -6, scale: 0.96, transition: { duration: 0.14 } },
};
const drawerV = {
  hidden:  { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
  exit:    { x: '100%', opacity: 0, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
};

const AUTH_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/items',    label: 'Destinations' },
  { to: '/ai-chat',  label: 'AI Chat' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/bookings', label: 'Bookings' },
];
const GUEST_LINKS = [
  { to: '/',        label: 'Home' },
  { to: '/items',   label: 'Destinations' },
  { to: '/ai-chat', label: 'AI Chat' },
  { to: '/help',    label: 'Help' },
];

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen,    setMobileOpen]   = useState(false);
  const [userMenuOpen,  setUserMenuOpen] = useState(false);
  const [scrolled,      setScrolled]     = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location]);

  const isActive = (p: string) =>
    p === '/' ? location.pathname === '/' : location.pathname.startsWith(p);
  const links = isAuthenticated ? AUTH_LINKS : GUEST_LINKS;

  return (
    <>
      {/* ─────────────────────────────────────────
          FLOATING PILL NAVBAR
      ───────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        top: '1.25rem',
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 1rem',
        pointerEvents: 'none',   /* let clicks pass through the wrapper */
      }}>
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0,   opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            padding: '0.375rem 0.5rem',
            /* dark pill container */
            background: scrolled
              ? 'rgba(18, 18, 20, 0.96)'
              : 'rgba(18, 18, 20, 0.82)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: scrolled
              ? '0 8px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)'
              : '0 4px 24px rgba(0,0,0,0.35)',
            transition: 'background 0.3s, box-shadow 0.3s',
            maxWidth: '900px',
            width: '100%',
          }}
        >
          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem' }}
            >
              <div style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(13,148,136,0.5)',
              }}>
                <FiGlobe size={15} color="white" />
              </div>
              <span style={{
                fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ffffff, #a7f3d0)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {APP_NAME}
              </span>
            </motion.div>
          </Link>

          {/* ── Desktop nav links — the pill group ── */}
          <div
            className="hide-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.125rem',
              /* inner dark track */
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '9999px',
              padding: '0.25rem',
            }}
          >
            {links.map((lk, i) => {
              const active = isActive(lk.to);
              return (
                <motion.div
                  key={lk.to}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.15, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={lk.to}
                    style={{
                      display: 'block',
                      padding: '0.45rem 1rem',
                      borderRadius: '9999px',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: active ? 600 : 500,
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      /* active = light pill, inactive = transparent */
                      background: active
                        ? 'rgba(255,255,255,0.92)'
                        : 'transparent',
                      color: active ? '#0f172a' : 'rgba(255,255,255,0.72)',
                      boxShadow: active
                        ? '0 1px 4px rgba(0,0,0,0.18)'
                        : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.95)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.72)';
                      }
                    }}
                  >
                    {lk.label}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ── Right side: auth ── */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserMenuOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.3rem 0.75rem 0.3rem 0.3rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '9999px', cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '0.75rem',
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{
                    fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)',
                    maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <FiChevronDown
                    size={12}
                    color="rgba(255,255,255,0.55)"
                    style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      variants={dropdownV}
                      initial="hidden" animate="visible" exit="exit"
                      style={{
                        position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                        background: 'rgba(18,18,20,0.97)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px', padding: '0.5rem',
                        minWidth: '210px', zIndex: 200,
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                      }}
                    >
                      <div style={{ padding: '0.75rem 1rem 0.625rem' }}>
                        <p style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9375rem', margin: 0 }}>{user?.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: '0.1rem 0 0' }}>{user?.email}</p>
                      </div>
                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 0.5rem 0.375rem' }} />
                      <DDItem to="/dashboard" icon={<FiGrid size={14}/>}  label="Dashboard" />
                      {user?.role === 'admin' && (
                        <DDItem to="/admin" icon={<FiShield size={14}/>} label="Admin Panel" />
                      )}
                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.375rem 0.5rem' }} />
                      <button
                        onClick={logout}
                        style={{
                          width: '100%', background: 'none', border: 'none',
                          padding: '0.6rem 0.875rem', textAlign: 'left',
                          fontSize: '0.875rem', color: '#f87171', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '0.6rem',
                          borderRadius: '10px', fontWeight: 500, transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <FiLogOut size={14}/> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                {/* Sign in — ghost */}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      padding: '0.45rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '9999px',
                      fontSize: '0.875rem', fontWeight: 500,
                      color: 'rgba(255,255,255,0.72)',
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; }}
                  >
                    Sign in
                  </motion.button>
                </Link>

                {/* Get Started — dark solid pill (like "Contact" in the image) */}
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <motion.button
                    whileHover={{ scale: 1.05, background: '#1e293b' }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      padding: '0.5rem 1.125rem',
                      background: '#ffffff',
                      border: 'none',
                      borderRadius: '9999px',
                      fontSize: '0.875rem', fontWeight: 700,
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                      transition: 'all 0.18s',
                    }}
                  >
                    <FiUserPlus size={14}/> Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setMobileOpen(v => !v)}
            className="show-mobile-only"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '9999px', cursor: 'pointer',
              color: 'rgba(255,255,255,0.88)',
            }}
          >
            {mobileOpen ? <FiX size={18}/> : <FiMenu size={18}/>}
          </motion.button>
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────
          MOBILE DRAWER
      ───────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 998,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
              }}
            />
            <motion.div
              variants={drawerV} initial="hidden" animate="visible" exit="exit"
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(300px, 84vw)',
                background: 'rgba(14,14,16,0.98)',
                backdropFilter: 'blur(20px)',
                zIndex: 999, display: 'flex', flexDirection: 'column',
                boxShadow: '-16px 0 48px rgba(0,0,0,0.5)',
                overflowY: 'auto',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* Drawer header */}
              <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg,#0d9488,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiGlobe size={14} color="white"/>
                  </div>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{APP_NAME}</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', padding: '0.375rem', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex' }}
                >
                  <FiX size={16}/>
                </button>
              </div>

              {/* User card */}
              {isAuthenticated && (
                <div style={{ margin: '1rem 1rem 0', padding: '1rem', background: 'rgba(13,148,136,0.1)', borderRadius: '14px', border: '1px solid rgba(13,148,136,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#0d9488,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9375rem', margin: 0 }}>{user?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav links */}
              <div style={{ padding: '1rem', flex: 1 }}>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                  Navigation
                </p>
                {links.map((lk, i) => {
                  const active = isActive(lk.to);
                  return (
                    <motion.div key={lk.to} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 + 0.1 }}>
                      <Link to={lk.to} style={{
                        display: 'flex', alignItems: 'center',
                        padding: '0.75rem 0.875rem', borderRadius: '10px',
                        textDecoration: 'none', marginBottom: '0.2rem',
                        color: active ? '#ffffff' : 'rgba(255,255,255,0.6)',
                        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                        fontWeight: active ? 600 : 500, fontSize: '0.9375rem',
                        transition: 'all 0.15s',
                      }}>
                        {lk.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {isAuthenticated && (
                  <>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '0.75rem 0' }}/>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Account</p>
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.875rem', borderRadius: '10px', textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.9375rem', marginBottom: '0.2rem' }}>
                      <FiGrid size={14} color="rgba(255,255,255,0.3)"/> Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.875rem', borderRadius: '10px', textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.9375rem', marginBottom: '0.2rem' }}>
                        <FiShield size={14} color="rgba(255,255,255,0.3)"/> Admin Panel
                      </Link>
                    )}
                  </>
                )}
              </div>

              {/* Bottom actions */}
              <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#f87171', fontWeight: 600, fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <FiLogOut size={15}/> Sign out
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <button style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <FiLogIn size={15}/> Sign in
                      </button>
                    </Link>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      <button style={{ width: '100%', padding: '0.75rem', background: '#ffffff', border: 'none', borderRadius: '10px', color: '#0f172a', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <FiUserPlus size={15}/> Get Started Free
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer — accounts for floating nav height + top offset */}
      <div style={{ height: '88px' }}/>
    </>
  );
}

/* ── Dropdown item (dark theme) ── */
function DDItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        padding: '0.6rem 0.875rem', borderRadius: '10px',
        textDecoration: 'none', fontSize: '0.875rem',
        fontWeight: 500, color: 'rgba(255,255,255,0.75)',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#ffffff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
    >
      <span style={{ color: 'rgba(255,255,255,0.35)' }}>{icon}</span>
      {label}
    </Link>
  );
}
