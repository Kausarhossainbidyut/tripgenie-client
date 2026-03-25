import { APP_NAME } from '../../../constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white" style={{ borderColor: '#e5e7eb' }}>
      <div className="container py-6">
        <p className="text-center text-sm" style={{ color: '#6b7280' }}>
          &copy; {currentYear} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
