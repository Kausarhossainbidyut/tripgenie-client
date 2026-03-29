import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';

export function Contact() {
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '3rem 1.5rem',
      minHeight: 'calc(100vh - 200px)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700, 
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          We'd love to hear from you! Get in touch with our team.
        </p>
      </div>

      {/* Contact Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <ContactCard
          icon={<FiMail size={24} />}
          title="Email Us"
          content="support@tripgenie.com"
          subtext="We'll respond within 24 hours"
          href="mailto:support@tripgenie.com"
        />
        
        <ContactCard
          icon={<FiPhone size={24} />}
          title="Call Us"
          content="+880 1234 567 890"
          subtext="Mon-Fri, 9AM-6PM BDT"
          href="tel:+8801234567890"
        />
        
        <ContactCard
          icon={<FiMapPin size={24} />}
          title="Visit Us"
          content="House #123, Road #45, Dhaka 1212"
          subtext="Bangladesh"
        />
        
        <ContactCard
          icon={<FiClock size={24} />}
          title="Business Hours"
          content="Sunday - Friday"
          subtext="9:00 AM - 6:00 PM BDT"
        />
      </div>

      {/* Contact Form */}
      <div style={{ 
        background: '#ffffff',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '2.5rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 600, 
          color: '#1f2937',
          marginBottom: '1.5rem'
        }}>
          Send us a Message
        </h2>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          alert('Thank you for your message! We will get back to you soon.');
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Full Name *
            </label>
            <input 
              type="text" 
              required
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Email Address *
            </label>
            <input 
              type="email" 
              required
              placeholder="john@example.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Subject *
            </label>
            <select 
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select a subject</option>
              <option value="booking">Booking Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="feedback">Feedback</option>
              <option value="partnership">Partnership</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Message *
            </label>
            <textarea 
              required
              rows={6}
              placeholder="How can we help you?"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FiSend size={20} />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

// Contact Card Component
function ContactCard({ icon, title, content, subtext, href }: { 
  icon: React.ReactNode; 
  title: string; 
  content: string; 
  subtext: string;
  href?: string;
}) {
  const cardContent = (
    <div style={{
      padding: '2rem',
      background: '#ffffff',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        margin: '0 auto 1.5rem',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.75rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '1.125rem', color: '#667eea', fontWeight: 500, marginBottom: '0.5rem' }}>
        {content}
      </p>
      <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
        {subtext}
      </p>
    </div>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: 'none' }}>
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
