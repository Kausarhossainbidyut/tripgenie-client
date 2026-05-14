import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../../constants';
import {
  FiGlobe, FiHeart, FiMail, FiPhone, FiMapPin,
  FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube,
  FiArrowRight
} from 'react-icons/fi';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #0f0c29 0%, #1a1040 100%)',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative orbs */}
      <div style={{
        position: 'absolute', top: '-100px', left: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', right: '-80px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top gradient line */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #0d9488, #06b6d4, #10b981, transparent)',
      }} />

      {/* Newsletter strip */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '2.5rem 1.5rem',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
              Get travel inspiration in your inbox
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              Weekly destination guides, deals, and AI travel tips.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                padding: '0.625rem 1rem',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.875rem',
                outline: 'none',
                minWidth: '220px',
              }}
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.625rem 1.25rem',
                background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                border: 'none', borderRadius: '10px',
                fontSize: '0.875rem', fontWeight: 600, color: 'white',
                cursor: 'pointer',
              }}
            >
              Subscribe <FiArrowRight size={14} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem 3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiGlobe size={18} color="white" />
              </div>
              <span style={{
                fontSize: '1.375rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #5eead4, #67e8f9)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.03em',
              }}>
                {APP_NAME}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
              Your AI-powered travel companion. Discover amazing destinations, book unforgettable experiences, and create memories that last a lifetime.
            </p>
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              {[
                { icon: <FiFacebook size={16} />, href: '#' },
                { icon: <FiTwitter size={16} />,  href: '#' },
                { icon: <FiInstagram size={16} />, href: '#' },
                { icon: <FiLinkedin size={16} />,  href: '#' },
                { icon: <FiYoutube size={16} />,   href: '#' },
              ].map((s, i) => (
                <motion.a
                  key={i}
                  href={s.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  style={{
                    width: '36px', height: '36px', borderRadius: '9px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #0d9488, #06b6d4)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              Explore
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/items', label: 'Destinations' },
                { to: '/ai-chat', label: 'AI Assistant' },
                { to: '/bookings', label: 'My Bookings' },
                { to: '/wishlist', label: 'Wishlist' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map(link => <FooterLink key={link.to} {...link} />)}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { to: '/contact', label: 'Contact Us' },
                { to: '/faq', label: 'FAQs' },
                { to: '/help', label: 'Help Center' },
                { to: '/terms', label: 'Terms of Service' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/refund', label: 'Refund Policy' },
              ].map(link => <FooterLink key={link.to} {...link} />)}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              Get in Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: <FiMail size={15} />, text: 'support@tripgenie.com', href: 'mailto:support@tripgenie.com' },
                { icon: <FiPhone size={15} />, text: '+880 1234 567 890', href: 'tel:+8801234567890' },
                { icon: <FiMapPin size={15} />, text: 'Dhaka 1212, Bangladesh' },
                { icon: <FiGlobe size={15} />, text: 'www.tripgenie.com', href: 'https://www.tripgenie.com' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'rgba(13,148,136,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#5eead4', flexShrink: 0, marginTop: '1px',
                  }}>
                    {item.icon}
                  </div>
                  {item.href ? (
                    <a href={item.href} style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', lineHeight: 1.5, transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            &copy; {year} {APP_NAME}. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            Made with <FiHeart size={12} style={{ color: '#f43f5e' }} /> for travelers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      style={{
        fontSize: '0.875rem',
        color: 'rgba(255,255,255,0.5)',
        textDecoration: 'none',
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'white';
        e.currentTarget.style.paddingLeft = '0.375rem';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
        e.currentTarget.style.paddingLeft = '0';
      }}
    >
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'linear-gradient(135deg, #0d9488, #06b6d4)', display: 'inline-block', flexShrink: 0 }} />
      {label}
    </Link>
  );
}
