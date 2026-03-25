import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { APP_NAME } from '../constants';

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 style={{ 
        fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', 
        fontWeight: 700, 
        marginBottom: '1rem', 
        color: '#111827' 
      }}>
        Welcome to {APP_NAME}
      </h1>
      <p style={{ 
        fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
        marginBottom: '2rem', 
        maxWidth: '42rem', 
        color: '#6b7280',
        padding: '0 1rem'
      }}>
        A production-ready React starter template with TypeScript, Tailwind CSS, 
        and React Router. Build modern web applications faster.
      </p>
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link to="/register">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" size="lg">Sign In</Button>
        </Link>
      </div>

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
          title="TypeScript"
          description="Type-safe code with excellent developer experience"
        />
        <FeatureCard
          title="Tailwind CSS"
          description="Utility-first CSS framework for rapid UI development"
        />
        <FeatureCard
          title="React Router"
          description="Declarative routing for React applications"
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="card">
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>{title}</h3>
      <p style={{ color: '#6b7280' }}>{description}</p>
    </div>
  );
}
