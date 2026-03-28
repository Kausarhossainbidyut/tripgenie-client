import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { APP_NAME } from '../constants';
import { FiGlobe, FiMessageSquare, FiHeart, FiStar, FiMapPin, FiNavigation } from 'react-icons/fi';

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 style={{ 
        fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', 
        fontWeight: 700, 
        marginBottom: '1rem', 
        color: '#111827' 
      }}>
        Welcome to {APP_NAME} - Your AI Travel Companion
      </h1>
      <p style={{ 
        fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
        marginBottom: '2rem', 
        maxWidth: '42rem', 
        color: '#6b7280',
        padding: '0 1rem'
      }}>
        Discover amazing destinations, book your dream trips, and get AI-powered travel recommendations. 
        Your perfect adventure starts here!
      </p>
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link to="/items">
          <Button size="lg"><FiMapPin style={{ marginRight: '0.5rem' }} /> Explore Destinations</Button>
        </Link>
        <Link to="/ai-chat">
          <Button variant="outline" size="lg"><FiMessageSquare style={{ marginRight: '0.5rem' }} /> Ask AI Assistant</Button>
        </Link>
        <Link to="/register">
          <Button variant="outline" size="lg"><FiGlobe style={{ marginRight: '0.5rem' }} /> Get Started</Button>
        </Link>
      </div>

      {/* Features Section */}
      <div style={{ 
        display: 'grid', 
        marginTop: '4rem', 
        gap: '1.5rem', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        maxWidth: '64rem', 
        width: '100%',
        padding: '0 1rem'
      }}>
        <FeatureCard
          icon={<FiMapPin size={32} color="#3b82f6" />}
          title="Explore Destinations"
          description="Discover amazing places around Bangladesh and beyond. From beaches to mountains, find your perfect getaway."
        />
        <FeatureCard
          icon={<FiMessageSquare size={32} color="#10b981" />}
          title="AI-Powered Recommendations"
          description="Get personalized travel suggestions based on your preferences and budget with our AI assistant."
        />
        <FeatureCard
          icon={<FiHeart size={32} color="#ef4444" />}
          title="Wishlist & Booking"
          description="Save your favorite destinations and book them instantly. Manage all your trips in one place."
        />
        <FeatureCard
          icon={<FiStar size={32} color="#f59e0b" />}
          title="Reviews & Ratings"
          description="Read honest reviews from other travelers and make informed decisions about your trips."
        />
      </div>

      {/* Popular Categories */}
      <div style={{ marginTop: '4rem', width: '100%', maxWidth: '64rem', padding: '0 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
          Popular Categories
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem'
        }}>
          {['Beach', 'Mountain', 'Forest', 'Historical', 'City Tour', 'Adventure'].map((category) => (
            <Link
              key={category}
              to={`/items?category=${encodeURIComponent(category.toLowerCase())}`}
              style={{
                padding: '1.5rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.75rem',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'all 0.2s',
                border: '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>
                {category === 'Beach' && '🏖️'}
                {category === 'Mountain' && '🏔️'}
                {category === 'Forest' && '🌲'}
                {category === 'Historical' && '🏛️'}
                {category === 'City Tour' && '🏙️'}
                {category === 'Adventure' && '🎒'}
              </span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{category}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon?: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
      {icon && <div style={{ marginBottom: '1rem', display: 'inline-block' }}>{icon}</div>}
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>{title}</h3>
      <p style={{ color: '#6b7280' }}>{description}</p>
    </div>
  );
}
