import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { APP_NAME } from '../constants';
import { 
  FiGlobe, FiMessageSquare, FiHeart, FiStar, FiMapPin, FiNavigation,
  FiCheck, FiArrowRight, FiUsers, FiCalendar, FiShield, FiZap
} from 'react-icons/fi';

export function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '6rem 1.5rem 4rem',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
            fontWeight: 800, 
            marginBottom: '1.5rem', 
            color: 'white',
            lineHeight: 1.1,
            textShadow: '0 2px 20px rgba(0,0,0,0.2)'
          }}>
            Discover Your Next
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Adventure</span>
          </h1>
          
          <p style={{ 
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)', 
            marginBottom: '2.5rem', 
            maxWidth: '700px',
            margin: '0 auto 2.5rem',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.7
          }}>
            AI-powered travel planning meets seamless booking. 
            Explore breathtaking destinations, get personalized recommendations, 
            and create unforgettable memories.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '4rem'
          }}>
            <Link to="/items">
              <Button 
                size="lg"
                style={{
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  padding: '1.25rem 2.5rem',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                }}
              >
                <FiMapPin style={{ marginRight: '0.5rem', marginTop: '-2px' }} /> 
                Explore Destinations
              </Button>
            </Link>
            <Link to="/ai-chat">
              <Button 
                variant="outline" 
                size="lg"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem 2.5rem',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.borderColor = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
              >
                <FiMessageSquare style={{ marginRight: '0.5rem', marginTop: '-2px' }} /> 
                Ask AI Assistant
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '2rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <StatItem number="500+" label="Destinations" />
            <StatItem number="10K+" label="Happy Travelers" />
            <StatItem number="24/7" label="AI Support" />
            <StatItem number="4.9★" label="Average Rating" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '6rem 1.5rem',
        background: '#ffffff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 800, 
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Why Choose {APP_NAME}?
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need for the perfect trip, powered by AI
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem'
          }}>
            <FeatureCardModern
              icon={<FiMapPin size={32} color="#667eea" />}
              title="Explore Destinations"
              description="Discover amazing places around Bangladesh and beyond. From Cox's Bazar to Sylhet, find your perfect getaway."
              color="#667eea"
            />
            <FeatureCardModern
              icon={<FiMessageSquare size={32} color="#10b981" />}
              title="AI-Powered Planning"
              description="Get personalized travel suggestions based on your preferences, budget, and travel dates."
              color="#10b981"
            />
            <FeatureCardModern
              icon={<FiHeart size={32} color="#ef4444" />}
              title="Easy Booking"
              description="Save your favorite destinations and book them instantly. Manage all your trips in one place."
              color="#ef4444"
            />
            <FeatureCardModern
              icon={<FiStar size={32} color="#f59e0b" />}
              title="Verified Reviews"
              description="Read honest reviews from verified travelers and make informed decisions."
              color="#f59e0b"
            />
            <FeatureCardModern
              icon={<FiShield size={32} color="#8b5cf6" />}
              title="Secure Payments"
              description="Your transactions are protected with bank-level security and encryption."
              color="#8b5cf6"
            />
            <FeatureCardModern
              icon={<FiZap size={32} color="#06b6d4" />}
              title="Instant Confirmation"
              description="Get immediate booking confirmation with e-tickets sent to your email."
              color="#06b6d4"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: '6rem 1.5rem',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 800, 
              color: '#111827',
              marginBottom: '1rem'
            }}>
              How It Works
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              Book your dream trip in 3 simple steps
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            position: 'relative'
          }}>
            <StepCard
              number="1"
              title="Search"
              description="Browse hundreds of destinations and filter by your preferences"
              icon={<FiMapPin size={24} />}
            />
            <StepCard
              number="2"
              title="Plan"
              description="Get AI recommendations and customize your itinerary"
              icon={<FiMessageSquare size={24} />}
            />
            <StepCard
              number="3"
              title="Book"
              description="Complete secure booking and receive instant confirmation"
              icon={<FiCheck size={24} />}
            />
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section style={{
        padding: '6rem 1.5rem',
        background: '#ffffff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 800, 
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Explore by Category
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              Find experiences that match your style
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {[
              { name: 'Beach', emoji: '🏖️', color: '#0ea5e9' },
              { name: 'Mountain', emoji: '🏔️', color: '#8b5cf6' },
              { name: 'Forest', emoji: '🌲', color: '#10b981' },
              { name: 'Historical', emoji: '🏛️', color: '#f59e0b' },
              { name: 'City Tour', emoji: '🏙️', color: '#667eea' },
              { name: 'Adventure', emoji: '🎒', color: '#ef4444' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/items?category=${encodeURIComponent(category.name.toLowerCase())}`}
                style={{
                  padding: '2rem 1.5rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '1rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  border: `2px solid ${category.color}20`,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `${category.color}30`;
                  e.currentTarget.style.borderColor = category.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = `${category.color}20`;
                }}
              >
                <span style={{ 
                  fontSize: '3rem', 
                  display: 'block', 
                  marginBottom: '0.75rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}>
                  {category.emoji}
                </span>
                <span style={{ 
                  fontWeight: 700, 
                  color: '#111827',
                  fontSize: '1.125rem'
                }}>
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Link to="/items">
              <Button 
                size="lg"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                View All Destinations <FiArrowRight style={{ marginLeft: '0.5rem', display: 'inline-block' }} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '6rem 1.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            fontWeight: 800, 
            color: 'white',
            marginBottom: '1.5rem'
          }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '2.5rem',
            lineHeight: 1.7
          }}>
            Join thousands of happy travelers who discovered their perfect adventures with TripGenie
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Link to="/register">
              <Button 
                size="lg"
                style={{
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  padding: '1.25rem 3rem',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Get Started Free <FiArrowRight style={{ marginLeft: '0.5rem', display: 'inline-block' }} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Modern Feature Card Component
function FeatureCardModern({ icon, title, description, color }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: string;
}) {
  return (
    <div style={{
      padding: '2rem',
      background: '#ffffff',
      borderRadius: '1.5rem',
      border: `2px solid ${color}15`,
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = `0 12px 24px ${color}20`;
      e.currentTarget.style.borderColor = color;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
      e.currentTarget.style.borderColor = `${color}15`;
    }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '1rem',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        {icon}
      </div>
      <h3 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 700, 
        marginBottom: '0.75rem',
        color: '#111827'
      }}>
        {title}
      </h3>
      <p style={{ 
        color: '#6b7280',
        lineHeight: 1.7,
        fontSize: '0.9375rem'
      }}>
        {description}
      </p>
    </div>
  );
}

// Step Card Component
function StepCard({ number, title, description, icon }: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div style={{
      textAlign: 'center',
      position: 'relative',
      zIndex: 20
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        margin: '0 auto 1.5rem',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'white',
          border: '3px solid #667eea',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          color: '#667eea',
          fontSize: '0.875rem'
        }}>
          {number}
        </div>
        {icon}
      </div>
      <h3 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 700, 
        marginBottom: '0.75rem',
        color: '#111827'
      }}>
        {title}
      </h3>
      <p style={{ 
        color: '#6b7280',
        lineHeight: 1.7,
        maxWidth: '300px',
        margin: '0 auto'
      }}>
        {description}
      </p>
    </div>
  );
}

// Stat Item Component
function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
        fontWeight: 800,
        color: 'white',
        marginBottom: '0.25rem',
        textShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        {number}
      </div>
      <div style={{
        fontSize: '0.875rem',
        color: 'rgba(255,255,255,0.8)',
        fontWeight: 500
      }}>
        {label}
      </div>
    </div>
  );
}
