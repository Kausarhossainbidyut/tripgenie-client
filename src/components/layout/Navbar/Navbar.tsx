import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { APP_NAME } from '../../../constants';
import {
  FiGlobe, FiMapPin, FiMessageSquare, FiHeart, FiCalendar,
  FiLogOut, FiMenu, FiX, FiLogIn, FiUserPlus,
  FiShield, FiHelpCircle, FiChevronDown, FiGrid, FiUser
} from 'react-icons/fi';

/* ── Variants ── */
const dropdownV = {
  hidden:  { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0,   scale: 1, transition: { duration: 0.2, ease: [0.16,1,0.3,1] } },
  exit:    { opacity: 0, y: -8,  scale: 0.95, transition: { duration: 0.14 } },
};
const drawerV = {
  hidden:  { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.32, ease: [0.16,1,0.3,1] } },
  exit:    { x: '100%', opacity: 0, transition: { duration: 0.22, ease: [0.4,0,1,1] } },
};

const AUTH_LINKS = [
  { to: '/items',    icon: <FiMapPin size={15}/>,        label: 'Destinations' },
  { to: '/ai-chat',  icon: <FiMessageSquare size={15}/>, label: 'AI Chat' },
  { to: '/wishlist', icon: <FiHeart size={15}/>,         label: 'Wishlist' },
  { to: '/bookings', icon: <FiCalendar size={15}/>,      label: 'Bookings' },
];
const GUEST_LINKS = [
  { to: '/items',   icon: <FiMapPin size={15}/>,        label: 'Destinations' },
  { to: '/ai-chat', icon: <FiMessageSquare size={15}/>, label: 'AI Chat' },
  { to: '/help',    icon: <FiHelpCircle size={15}/>,    label: 'Help' },
];

/* ── Colour tokens ── */
const C = {
  teal:   '#0d9488',
  tealLt: '#14b8a6',
  tealDk: '#0f766e',
  emerald:'#059669',
  cyan:   '#06b6d4',
  /* scrolled navbar surface */
  navBg:  'rgba(255,255,255,0.92)',
  navBdr: 'rgba(13,148,136,0.15)',
  /* active link */
  active: '#0d9488',
  activeBg: 'rgba(13,148,136,0.09)',
};

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location]);

  const isActive = (p: string) => location.pathname === p;
  const links = isAuthenticated ? AUTH_LINKS : GUEST_LINKS;

  /* text colour adapts: white on dark hero, dark on white bg */
  const textCol  = scrolled ? '#1e293b' : 'rgba(255,255,255,0.92)';
  const mutedCol = scrolled ? '#64748b' : 'rgba(255,255,255,0.65)';

  return (
    <>
      {/* ── Fixed nav bar ── */}
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16,1,0.3,1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          transition: 'background 0.35s, box-shadow 0.35s, border-color 0.35s',
          background:   scrolled ? C.navBg  : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? `1px solid ${C.navBdr}` : '1px solid transparent',
          boxShadow:    scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
        }}
      >
        {/* Teal accent line */}
        {scrolled && (
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2.5px',
              background: `linear-gradient(90deg, ${C.teal}, ${C.cyan}, ${C.emerald})`,
              transformOrigin: 'left',
            }}
          />
        )}

        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem',
          height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <div style={{
                width: '38px', height: '38px', borderRadius: '11px',
                background: `linear-gradient(135deg, ${C.teal}, ${C.cyan})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 14px rgba(13,148,136,0.45)`,
              }}>
                <FiGlobe size={19} color="white" />
              </div>
              <span style={{
                fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em',
                background: scrolled
                  ? `linear-gradient(135deg, ${C.teal}, ${C.cyan})`
                  : 'linear-gradient(135deg, #ffffff, #a7f3d0)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {APP_NAME}
              </span>
            </motion.div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
            {links.map((lk, i) => (
              <motion.div key={lk.to}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 + 0.1, duration: 0.3, ease: [0.16,1,0.3,1] }}
              >
                <NavPill to={lk.to} icon={lk.icon} label={lk.label}
                  active={isActive(lk.to)} scrolled={scrolled}
                  textCol={textCol} activeColor={C.active} activeBg={C.activeBg}
                />
              </motion.div>
            ))}
          </div>

          {/* ── Desktop right ── */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setUserMenuOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.3rem 0.75rem 0.3rem 0.3rem',
                    background: scrolled ? C.activeBg : 'rgba(255,255,255,0.12)',
                    border: `1.5px solid ${scrolled ? C.navBdr : 'rgba(255,255,255,0.25)'}`,
                    borderRadius: '9999px', cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.teal}, ${C.cyan})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '0.8125rem',
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: textCol,
                    maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <FiChevronDown size={13} color={mutedCol}
                    style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div variants={dropdownV} initial="hidden" animate="visible" exit="exit"
                      style={{
                        position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                        background: 'white', borderRadius: '16px', padding: '0.5rem',
                        minWidth: '220px', zIndex: 200,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div style={{ padding: '0.75rem 1rem 0.625rem' }}>
                        <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem', margin: 0 }}>{user?.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.1rem 0 0' }}>{user?.email}</p>
                      </div>
                      <div style={{ height: '1px', background: '#f1f5f9', margin: '0 0.5rem 0.375rem' }} />
                      <DDItem to="/dashboard" icon={<FiGrid size={15}/>}  label="Dashboard"  accent={C.teal} />
                      {user?.role === 'admin' && (
                        <DDItem to="/admin" icon={<FiShield size={15}/>} label="Admin Panel" accent={C.teal} />
                      )}
                      <div style={{ height: '1px', background: '#f1f5f9', margin: '0.375rem 0.5rem' }} />
                      <button onClick={logout}
                        style={{
                          width: '100%', background: 'none', border: 'none',
                          padding: '0.6rem 0.875rem', textAlign: 'left',
                          fontSize: '0.875rem', color: '#ef4444', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '0.6rem',
                          borderRadius: '10px', fontWeight: 500, transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <FiLogOut size={15}/> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{
                      padding: '0.5rem 1.125rem',
                      background: 'transparent',
                      border: `1.5px solid ${scrolled ? 'rgba(13,148,136,0.35)' : 'rgba(255,255,255,0.35)'}`,
                      borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600,
                      color: textCol, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = scrolled ? C.activeBg : 'rgba(255,255,255,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <FiLogIn size={15}/> Sign in
                  </motion.button>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}
                    style={{
                      padding: '0.5rem 1.25rem',
                      background: `linear-gradient(135deg, ${C.teal}, ${C.cyan})`,
                      border: 'none', borderRadius: '10px',
                      fontSize: '0.875rem', fontWeight: 700, color: 'white',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                      boxShadow: `0 4px 16px rgba(13,148,136,0.45)`,
                      transition: 'box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 22px rgba(13,148,136,0.6)`; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 4px 16px rgba(13,148,136,0.45)`; }}
                  >
                    <FiUserPlus size={15}/> Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => setMobileOpen(v => !v)}
            className="show-mobile-only"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '42px', height: '42px',
              background: scrolled ? C.activeBg : 'rgba(255,255,255,0.12)',
              border: `1.5px solid ${scrolled ? C.navBdr : 'rgba(255,255,255,0.28)'}`,
              borderRadius: '11px', cursor: 'pointer', color: textCol,
            }}
          >
            {mobileOpen ? <FiX size={20}/> : <FiMenu size={20}/>}
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div variants={drawerV} initial="hidden" animate="visible" exit="exit"
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(310px, 84vw)', background: 'white',
                zIndex: 999, display: 'flex', flexDirection: 'column',
                boxShadow: '-16px 0 48px rgba(0,0,0,0.18)', overflowY: 'auto',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '1.25rem 1.5rem',
                background: `linear-gradient(135deg, ${C.tealDk}, ${C.teal}, ${C.cyan})`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiGlobe size={20} color="white"/>
                  <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                    {APP_NAME}
                  </span>
                </div>
                <button onClick={() => setMobileOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '8px', padding: '0.375rem', color: 'white', cursor: 'pointer', display: 'flex' }}>
                  <FiX size={18}/>
                </button>
              </div>

              {/* User card */}
              {isAuthenticated && (
                <div style={{ margin: '1rem 1rem 0', padding: '1rem',
                  background: `linear-gradient(135deg, rgba(13,148,136,0.07), rgba(6,182,212,0.07))`,
                  borderRadius: '12px', border: `1px solid rgba(13,148,136,0.15)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%',
                      background: `linear-gradient(135deg, ${C.teal}, ${C.cyan})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem', margin: 0 }}>{user?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Links */}
              <div style={{ padding: '1rem', flex: 1 }}>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                  Navigation
                </p>
                {links.map((lk, i) => (
                  <motion.div key={lk.to}
                    initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link to={lk.to} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 0.875rem', borderRadius: '10px',
                      textDecoration: 'none', marginBottom: '0.2rem',
                      color: isActive(lk.to) ? C.teal : '#374151',
                      background: isActive(lk.to) ? C.activeBg : 'transparent',
                      fontWeight: isActive(lk.to) ? 600 : 500, fontSize: '0.9375rem',
                      transition: 'all 0.15s',
                    }}>
                      <span style={{ color: isActive(lk.to) ? C.teal : '#94a3b8' }}>{lk.icon}</span>
                      {lk.label}
                    </Link>
                  </motion.div>
                ))}

                {isAuthenticated && (
                  <>
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '0.75rem 0' }}/>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                      Account
                    </p>
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.875rem', borderRadius: '10px', textDecoration: 'none', color: '#374151', fontWeight: 500, fontSize: '0.9375rem', marginBottom: '0.2rem' }}>
                      <FiGrid size={15} color="#94a3b8"/> Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.875rem', borderRadius: '10px', textDecoration: 'none', color: '#374151', fontWeight: 500, fontSize: '0.9375rem', marginBottom: '0.2rem' }}>
                        <FiShield size={15} color="#94a3b8"/> Admin Panel
                      </Link>
                    )}
                  </>
                )}
              </div>

              {/* Bottom */}
              <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
                {isAuthenticated ? (
                  <button onClick={() => { logout(); setMobileOpen(false); }}
                    style={{ width: '100%', padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca',
                      borderRadius: '10px', color: '#ef4444', fontWeight: 600, fontSize: '0.9375rem',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <FiLogOut size={16}/> Sign out
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <button style={{ width: '100%', padding: '0.75rem', background: 'transparent',
                        border: `1.5px solid rgba(13,148,136,0.3)`, borderRadius: '10px', color: C.teal,
                        fontWeight: 600, fontSize: '0.9375rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <FiLogIn size={16}/> Sign in
                      </button>
                    </Link>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      <button style={{ width: '100%', padding: '0.75rem',
                        background: `linear-gradient(135deg, ${C.teal}, ${C.cyan})`,
                        border: 'none', borderRadius: '10px', color: 'white',
                        fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        boxShadow: `0 4px 14px rgba(13,148,136,0.4)` }}>
                        <FiUserPlus size={16}/> Get Started Free
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div style={{ height: '68px' }}/>
    </>
  );
}

/* ── NavPill ── */
function NavPill({ to, icon, label, active, scrolled, textCol, activeColor, activeBg }: {
  to: string; icon: React.ReactNode; label: string;
  active: boolean; scrolled: boolean;
  textCol: string; activeColor: string; activeBg: string;
}) {
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: '0.375rem',
      padding: '0.45rem 0.875rem', borderRadius: '9999px',
      textDecoration: 'none', fontSize: '0.875rem',
      fontWeight: active ? 600 : 500,
      color: active ? activeColor : textCol,
      background: active ? activeBg : 'transparent',
      transition: 'all 0.18s',
    }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = scrolled ? activeBg : 'rgba(255,255,255,0.12)';
          e.currentTarget.style.color = scrolled ? activeColor : 'white';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = textCol;
        }
      }}
    >
      {icon}{label}
    </Link>
  );
}

/* ── DropdownItem ── */
function DDItem({ to, icon, label, accent }: { to: string; icon: React.ReactNode; label: string; accent: string }) {
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: '0.625rem',
      padding: '0.6rem 0.875rem', borderRadius: '10px',
      textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#374151',
      transition: 'all 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = `rgba(13,148,136,0.08)`; e.currentTarget.style.color = accent; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}
    >
      <span style={{ color: '#94a3b8' }}>{icon}</span>{label}
    </Link>
  );
}
