import { FiHelpCircle, FiMail, FiPhone, FiMessageCircle } from 'react-icons/fi';

export function HelpCenter() {
  const helpTopics = [
    {
      icon: <FiHelpCircle size={32} />,
      title: "Getting Started",
      description: "Learn how to use TripGenie and create your first booking",
      link: "/faq"
    },
    {
      icon: <FiMessageCircle size={32} />,
      title: "Booking Support",
      description: "Manage, modify, or cancel your bookings",
      link: "/bookings"
    },
    {
      icon: <FiMail size={32} />,
      title: "Contact Support",
      description: "Get in touch with our customer service team",
      link: "/contact"
    }
  ];

  return (
    <div style={{ 
      maxWidth: '1000px', 
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
          Help Center
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          How can we help you today?
        </p>
      </div>

      {/* Quick Links */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {helpTopics.map((topic, index) => (
          <a
            key={index}
            href={topic.link}
            style={{ textDecoration: 'none' }}
          >
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
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                {topic.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.75rem' }}>
                {topic.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>
                {topic.description}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Common Questions */}
      <div style={{ 
        background: '#ffffff',
        borderRadius: '1rem',
        padding: '2.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '3rem'
      }}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 600, 
          color: '#1f2937',
          marginBottom: '2rem'
        }}>
          Quick Answers
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <QuickAnswer
            question="How do I make a booking?"
            answer="Browse destinations on the Items page, select your preferred option, choose dates and guests, then click 'Book Now'. You'll receive instant confirmation via email."
          />
          
          <QuickAnswer
            question="Can I cancel my booking?"
            answer="Yes! Most bookings offer free cancellation up to 48 hours before check-in. Visit your Bookings page to manage cancellations."
          />
          
          <QuickAnswer
            question="How do I contact customer support?"
            answer="You can reach us via email at support@tripgenie.com, call +880 1234 567 890, or use the contact form on the Contact page."
          />
          
          <QuickAnswer
            question="Is my payment information secure?"
            answer="Absolutely! We use SSL encryption and industry-standard security measures to protect all transactions."
          />
        </div>
      </div>

      {/* Contact CTA */}
      <div style={{ 
        textAlign: 'center',
        padding: '3rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '1rem',
        color: 'white'
      }}>
        <FiMessageCircle size={48} style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem' }}>
          Still Need Help?
        </h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9 }}>
          Our support team is available 24/7 to assist you
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/contact"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: 'white',
              color: '#667eea',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FiMail size={20} style={{ display: 'inline-block', marginRight: '0.5rem' }} />
            Email Us
          </a>
          <a
            href="tel:+8801234567890"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: 600,
              border: '2px solid white',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            <FiPhone size={20} style={{ display: 'inline-block', marginRight: '0.5rem' }} />
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
}

// Quick Answer Component
function QuickAnswer({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: 600, 
        color: '#1f2937',
        marginBottom: '0.5rem'
      }}>
        {question}
      </h3>
      <p style={{ color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
        {answer}
      </p>
    </div>
  );
}
