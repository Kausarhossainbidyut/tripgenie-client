import { APP_NAME } from '../../../constants';
import { FiGlobe, FiHeart, FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: '#ffffff',
      marginTop: 'auto'
    }}>
      {/* Main Footer Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        padding: '4rem 1.5rem 3rem 1.5rem'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Section */}
          <div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 700, 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              {APP_NAME}
            </h3>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#94a3b8', 
              lineHeight: 1.7,
              marginBottom: '1.5rem'
            }}>
              Your AI-powered travel companion. Discover amazing destinations, book unforgettable experiences, and create memories that last a lifetime.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <SocialIcon icon={<FiFacebook size={18} />} href="https://facebook.com/tripgenie" aria-label="Facebook" />
              <SocialIcon icon={<FiTwitter size={18} />} href="https://twitter.com/tripgenie" aria-label="Twitter" />
              <SocialIcon icon={<FiInstagram size={18} />} href="https://instagram.com/tripgenie" aria-label="Instagram" />
              <SocialIcon icon={<FiLinkedin size={18} />} href="https://linkedin.com/company/tripgenie" aria-label="LinkedIn" />
              <SocialIcon icon={<FiYoutube size={18} />} href="https://youtube.com/@tripgenie" aria-label="YouTube" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              marginBottom: '1.5rem',
              color: '#ffffff'
            }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/items">Destinations</FooterLink>
              <FooterLink href="/bookings">My Bookings</FooterLink>
              <FooterLink href="/wishlist">Wishlist</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/admin">Admin Panel</FooterLink>
              <FooterLink href="/ai-chat">AI Travel Assistant</FooterLink>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              marginBottom: '1.5rem',
              color: '#ffffff'
            }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/faq">FAQs</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/support">Help Center</FooterLink>
              <FooterLink href="/refund">Refund Policy</FooterLink>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              marginBottom: '1.5rem',
              color: '#ffffff'
            }}>
              Get in Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <ContactItem 
                icon={<FiMail size={18} />} 
                text="support@tripgenie.com" 
                href="mailto:support@tripgenie.com"
              />
              <ContactItem 
                icon={<FiPhone size={18} />} 
                text="+880 1234 567 890" 
                href="tel:+8801234567890"
              />
              <ContactItem 
                icon={<FiMapPin size={18} />} 
                text="House #123, Road #45, Dhaka 1212, Bangladesh" 
              />
              <ContactItem 
                icon={<FiGlobe size={18} />} 
                text="www.tripgenie.com" 
                href="https://www.tripgenie.com"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ 
          height: '1px', 
          background: 'linear-gradient(90deg, transparent 0%, #334155 50%, transparent 100%)',
          marginBottom: '2rem'
        }} />

        {/* Bottom Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#94a3b8',
            margin: 0
          }}>
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#94a3b8',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Made with <FiHeart size={14} style={{ color: '#ef4444' }} /> for travelers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Social Icon Component
function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a 
      href={href}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        transition: 'all 0.3s ease',
        textDecoration: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {icon}
    </a>
  );
}

// Footer Link Component
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href}
      style={{
        fontSize: '0.875rem',
        color: '#94a3b8',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#ffffff';
        e.currentTarget.style.paddingLeft = '0.5rem';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#94a3b8';
        e.currentTarget.style.paddingLeft = '0';
      }}
    >
      <span style={{ 
        width: '6px', 
        height: '6px', 
        borderRadius: '50%', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'inline-block'
      }} />
      {children}
    </a>
  );
}

// Contact Item Component
function ContactItem({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const content = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#94a3b8',
      fontSize: '0.875rem'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'rgba(102, 126, 234, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#667eea'
      }}>
        {icon}
      </div>
      <span>{text}</span>
    </div>
  );

  if (href) {
    return (
      <a 
        href={href}
        style={{ 
          textDecoration: 'none',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#94a3b8';
        }}
      >
        {content}
      </a>
    );
  }

  return content;
}
