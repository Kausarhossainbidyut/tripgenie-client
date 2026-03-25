import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login({ email: formData.email, password: formData.password });
      navigate('/dashboard');
    } catch (error: any) {
      setErrors({ submit: error.message || 'Invalid credentials' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '3rem 1rem' }}>
      <div className="card">
        <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem', color: '#111827' }}>
          Welcome Back to TripGenie
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />

          {errors.submit && (
            <p className="text-sm" style={{ color: '#ef4444' }}>{errors.submit}</p>
          )}

          <Button type="submit" style={{ width: '100%' }} isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link 
            to="/forgot-password" 
            style={{ 
              color: '#3b82f6', 
              textDecoration: 'none', 
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <p className="text-center text-sm mt-4" style={{ color: '#6b7280' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
