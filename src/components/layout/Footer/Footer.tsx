import { APP_NAME } from '../../../constants';
import { FiGlobe, FiHeart } from 'react-icons/fi';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white" style={{ borderColor: '#e5e7eb' }}>
      <div className="container py-6">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '0.5rem',
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          <FiGlobe size={16} />
          <p style={{ margin: 0, textAlign: 'center' }}>
            &copy; {currentYear} {APP_NAME}. Made with <FiHeart size={14} style={{ display: 'inline-block', color: '#ef4444' }} /> for travelers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
