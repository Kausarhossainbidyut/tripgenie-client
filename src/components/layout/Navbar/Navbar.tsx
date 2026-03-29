import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../ui/Button';
import { APP_NAME } from '../../../constants';
import { 
  FiGlobe, FiMapPin, FiMessageSquare, FiHeart, FiCalendar, 
  FiUser, FiLogOut, FiMenu, FiX, FiLogIn, FiUserPlus, 
  FiChevronDown, FiShield, FiHelpCircle 
} from 'react-icons/fi';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-xl backdrop-blur-md bg-white/98 border-purple-100' : 'shadow-sm bg-white border-gray-200'
    } border-b`} style={{ borderColor: scrolled ? '#e9d5ff' : '#e5e7eb' }}>
      {/* Top notification bar */}
      {scrolled && (
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          width: '100%'
        }} />
      )}
      
      <div className="container flex h-16 items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 800, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        >
          <FiGlobe style={{ 
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }} />
          {APP_NAME}
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {isAuthenticated ? (
            <>
              {/* Navigation Links */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <NavLink to="/items" icon={<FiMapPin size={16} />} label="Destinations" active={isActive('/items')} />
                <NavLink to="/ai-chat" icon={<FiMessageSquare size={16} />} label="AI Chat" active={isActive('/ai-chat')} />
                <NavLink to="/wishlist" icon={<FiHeart size={16} />} label="Wishlist" active={isActive('/wishlist')} />
                <NavLink to="/bookings" icon={<FiCalendar size={16} />} label="Bookings" active={isActive('/bookings')} />
                
                {/* Help Dropdown */}
                <Link to="/help" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#6b7280',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#1f2937';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    <FiHelpCircle size={16} />
                    Help
                  </button>
                </Link>
              </div>

              {/* User Profile Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  <FiUser size={20} />
                </button>
                
                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: 'white',
                      borderRadius: '0.75rem',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      padding: '0.5rem',
                      minWidth: '220px',
                      marginTop: '0.5rem',
                      border: '1px solid #e5e7eb',
                      zIndex: 100
                    }}
                  >
                    <div style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>{user?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{user?.email}</p>
                    </div>
                    <DropdownLink to="/dashboard" label="Dashboard" icon={<FiUser size={16} />} />
                    {user?.role === 'admin' && (
                      <DropdownLink to="/admin" label="Admin Panel" icon={<FiShield size={16} />} />
                    )}
                    <div style={{ height: '1px', background: '#e5e7eb', margin: '0.5rem 0' }} />
                    <button
                      onClick={logout}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        padding: '0.625rem 0.75rem',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        borderRadius: '0.375rem',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Guest Links */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <NavLink to="/items" icon={<FiMapPin size={16} />} label="Destinations" active={isActive('/items')} />
                <NavLink to="/ai-chat" icon={<FiMessageSquare size={16} />} label="AI Chat" active={isActive('/ai-chat')} />
                
                {/* Help Link for Guests */}
                <Link to="/help" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#6b7280',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#1f2937';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    <FiHelpCircle size={16} />
                    Help
                  </button>
                </Link>
              </div>
              
              {/* Auth Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <FiLogIn size={16} /> Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="sm"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    <FiUserPlus size={16} /> Register
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-toggle"
          style={{
            display: 'none',
            padding: '0.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: 'white',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
          }}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          display: 'none',
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: 'white',
          animation: 'slideDown 0.3s ease-out',
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto'
        }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  alignSelf: 'flex-end',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.375rem',
                  padding: '0.5rem',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.5rem',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                }}
              >
                <FiX size={20} />
              </button>
              
              {/* User Info Card */}
              <div style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '0.75rem',
                color: 'white',
                marginBottom: '0.5rem'
              }}>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0 0 0.25rem 0' }}>Welcome back,</p>
                <p style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>{user?.name}</p>
              </div>
              
              <MobileNavLink to="/items" label="Destinations" icon={<FiMapPin size={18} />} />
              <MobileNavLink to="/ai-chat" label="AI Chat" icon={<FiMessageSquare size={18} />} />
              <MobileNavLink to="/wishlist" label="Wishlist" icon={<FiHeart size={18} />} />
              <MobileNavLink to="/bookings" label="Bookings" icon={<FiCalendar size={18} />} />
              
              <div style={{ paddingTop: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support</p>
                <MobileNavLink to="/faq" label="FAQs" icon={<FiHelpCircle size={18} />} />
                <MobileNavLink to="/contact" label="Contact Us" icon={<FiMessageSquare size={18} />} />
                <MobileNavLink to="/help" label="Help Center" icon={<FiHelpCircle size={18} />} />
              </div>
              
              <div style={{ paddingTop: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Dashboard
                  </Button>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', marginTop: '0.5rem' }}>
                    <Button variant="ghost" size="sm" style={{ width: '100%', justifyContent: 'center' }}>
                      🔐 Admin Panel
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { logout(); setMobileMenuOpen(false); }} 
                  style={{ width: '100%', marginTop: '0.75rem', borderColor: '#ef4444', color: '#ef4444' }}
                >
                  <FiLogOut style={{ marginRight: '0.5rem' }} /> Logout
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  alignSelf: 'flex-end',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.375rem',
                  padding: '0.5rem',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.5rem',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                }}
              >
                <FiX size={20} />
              </button>
              
              <MobileNavLink to="/items" label="Destinations" icon={<FiMapPin size={18} />} />
              <MobileNavLink to="/ai-chat" label="AI Chat" icon={<FiMessageSquare size={18} />} />
              
              <div style={{ paddingTop: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support</p>
                <MobileNavLink to="/faq" label="FAQs" icon={<FiHelpCircle size={18} />} />
                <MobileNavLink to="/contact" label="Contact Us" icon={<FiMessageSquare size={18} />} />
                <MobileNavLink to="/help" label="Help Center" icon={<FiHelpCircle size={18} />} />
              </div>
              
              <div style={{ paddingTop: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" style={{ width: '100%', justifyContent: 'center' }}>Login</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', marginTop: '0.5rem' }}>
                  <Button 
                    size="sm" 
                    style={{ 
                      width: '100%', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                  >
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Tablet - Medium screens */
        @media (max-width: 1024px) and (min-width: 769px) {
          .desktop-menu {
            gap: 0.75rem !important;
          }
          .nav-link {
            font-size: 0.8125rem !important;
            padding: 0.375rem 0.5rem !important;
          }
          .help-dropdown {
            right: -50px !important;
          }
        }
        
        /* Mobile - Small screens */
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
          .mobile-menu {
            display: block !important;
          }
          .help-dropdown {
            position: fixed !important;
            left: 1rem !important;
            right: 1rem !important;
            top: auto !important;
            bottom: auto !important;
            min-width: auto !important;
            max-width: 300px !important;
          }
        }
        
        /* Extra small screens */
        @media (max-width: 480px) {
          .container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          nav h1, nav h2, nav h3, nav p, nav span {
            font-size: max(0.875rem, 2.5vw) !important;
          }
        }
      `}</style>
    </nav>
  );
}

// NavLink Component
function NavLink({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link 
      to={to} 
      className="nav-link"
      style={{
        textDecoration: 'none',
        color: active ? '#667eea' : '#374151',
        fontSize: '0.875rem',
        fontWeight: active ? 600 : 500,
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        background: active ? '#eff6ff' : 'transparent',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = '#f9fafb';
          e.currentTarget.style.color = '#1f2937';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#374151';
        }
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

// Dropdown Link Component
function DropdownLink({ to, label, icon }: { to: string; label: string; icon?: React.ReactNode }) {
  return (
    <Link 
      to={to}
      style={{
        textDecoration: 'none',
        padding: '0.625rem 0.75rem',
        fontSize: '0.875rem',
        color: '#374151',
        display: 'flex',
        alignItems: 'center',
        gap: icon ? '0.5rem' : '0',
        borderRadius: '0.375rem',
        transition: 'background 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#f9fafb';
        e.currentTarget.style.color = '#667eea';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'white';
        e.currentTarget.style.color = '#374151';
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

// Mobile Nav Link Component
function MobileNavLink({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <Link 
      to={to}
      onClick={(e) => {
        // Close menu after navigation
      }}
      style={{
        textDecoration: 'none',
        color: '#374151',
        padding: '0.75rem',
        fontSize: '0.9375rem',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderRadius: '0.5rem',
        transition: 'background 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#f9fafb';
        e.currentTarget.style.color = '#667eea';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#374151';
      }}
    >
      {icon}
      {label}
    </Link>
  );
}
