import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I book a destination or service?",
      answer: "Booking is easy! Browse our destinations on the Items page, select your preferred option, choose your travel dates and number of guests, then click 'Book Now'. You'll receive a confirmation email with all the details."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and online payment methods. All transactions are secured with SSL encryption for your safety."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes! You can cancel or modify your booking from your Bookings page. Cancellation policies vary by destination - please check the specific terms before booking. Refunds are processed within 5-7 business days."
    },
    {
      question: "How do I use the AI Travel Assistant?",
      answer: "Our AI Travel Assistant is available on the AI Chat page. Simply describe your travel preferences, budget, and interests, and our AI will create personalized itinerary recommendations for you."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees! The price you see includes all taxes and standard charges. Any additional services or upgrades will be clearly displayed before you confirm your booking."
    },
    {
      question: "How do I add items to my wishlist?",
      answer: "Click the heart icon on any destination card to add it to your wishlist. You can view and manage your saved items anytime from the Wishlist page."
    },
    {
      question: "Do you provide travel insurance?",
      answer: "Yes, we offer optional travel insurance that covers trip cancellation, medical emergencies, and lost luggage. You can add it during the booking process for peace of mind."
    },
    {
      question: "What if I have issues during my trip?",
      answer: "Our 24/7 support team is always here to help! Contact us via phone (+880 1234 567 890) or email (support@tripgenie.com) for immediate assistance during your trip."
    },
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking at least 2-3 months in advance for popular destinations, especially during peak seasons. However, we also offer last-minute deals for flexible travelers!"
    },
    {
      question: "Do you offer group discounts?",
      answer: "Yes! We offer special discounts for groups of 10 or more travelers. Contact our support team with your requirements, and we'll create a customized package for your group."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely! We use industry-leading security measures to protect your data. Your personal and payment information is encrypted and never shared with third parties without your consent."
    },
    {
      question: "How do I leave a review?",
      answer: "After completing your trip, you'll receive an email invitation to leave a review. You can also submit reviews from the Reviews page to share your experiences with other travelers."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Frequently Asked Questions
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
          Find answers to common questions about TripGenie
        </p>

        {/* Search Bar */}
        <div style={{ 
          position: 'relative', 
          maxWidth: '600px', 
          margin: '0 auto' 
        }}>
          <FiSearch size={20} style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '3rem',
              paddingRight: '1rem',
              paddingBlock: '0.875rem',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          />
        </div>
      </div>

      {/* FAQs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            style={{
              background: '#ffffff',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'left',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              <span style={{ 
                fontSize: '1.125rem', 
                fontWeight: 600, 
                color: '#1f2937' 
              }}>
                {faq.question}
              </span>
              {openIndex === index ? (
                <FiChevronUp size={20} color="#667eea" />
              ) : (
                <FiChevronDown size={20} color="#6b7280" />
              )}
            </button>

            {openIndex === index && (
              <div style={{ 
                padding: '0 1.5rem 1.5rem', 
                color: '#4b5563',
                lineHeight: 1.7
              }}>
                <p style={{ margin: 0 }}>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: '#6b7280'
        }}>
          <p style={{ fontSize: '1.125rem' }}>
            No results found for "{searchTerm}"
          </p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Try searching with different keywords
          </p>
        </div>
      )}

      {/* Still Need Help */}
      <div style={{ 
        marginTop: '4rem',
        textAlign: 'center',
        padding: '3rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '1rem',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem' }}>
          Still Have Questions?
        </h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', opacity: 0.9 }}>
          Our support team is here to help you
        </p>
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
          Contact Support
        </a>
      </div>
    </div>
  );
}
