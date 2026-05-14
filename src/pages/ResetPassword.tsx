import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authService } from '../services/auth.service';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get token from URL query parameter
    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid or missing reset token');
    } else {
      setFormData(prev => ({ ...prev, token }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.resetPassword(formData.token, formData.newPassword);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
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
          Reset Password 🔑
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Enter your new password below
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
            Password Reset Successful!
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Your password has been updated. Redirecting to login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
              New Password
            </label>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
              Confirm Password
            </label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="••••••••"
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
            disabled={loading || !formData.token}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      )}
    </div>
  );
}
