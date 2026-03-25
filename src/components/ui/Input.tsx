import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, type = 'text', ...props }, ref) => {
    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label style={{ 
            display: 'block', 
            marginBottom: '0.25rem', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            color: '#374151' 
          }}>
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={`input ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        {error && <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
