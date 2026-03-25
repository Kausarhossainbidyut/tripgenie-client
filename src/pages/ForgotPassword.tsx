import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/auth.service';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '2rem auto', 
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
          Forgot Password? 🔐
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          No worries! We'll send you reset instructions.
        </p>
      </div>

      {success ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ 
            width: '4rem', 
            height: '4rem', 
            margin: '0 auto 1rem',
            backgroundColor: '#d1fae5', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            ✅
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
            Check Your Email
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <Button onClick={() => window.location.href = '/login'} style={{ width: '100%' }}>
            Back to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <Link 
            to="/login" 
            style={{ 
              display: 'block', 
              textAlign: 'center', 
              color: '#3b82f6', 
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            ← Back to Login
          </Link>
        </form>
      )}
    </div>
  );
}
