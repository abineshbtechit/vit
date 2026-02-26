import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  loading = false,
  disabled = false,
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius)',
    fontWeight: '600',
    fontSize: '1rem',
    border: 'none',
    transition: 'all 0.2s ease',
    opacity: loading || disabled ? 0.7 : 1,
    cursor: loading || disabled ? 'not-allowed' : 'pointer',
    width: '100%'
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--secondary)',
      color: 'white',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '2px solid var(--primary)',
      color: 'var(--primary)',
    }
  };

  const hoverStyles = {
    primary: 'var(--primary-hover)',
    secondary: 'var(--secondary-hover)',
    outline: 'rgba(0, 82, 204, 0.05)'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...baseStyles,
        ...variants[variant]
      }}
      className={`btn-${variant} ${className}`}
      onMouseOver={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = variant === 'outline' ? hoverStyles.outline : hoverStyles[variant];
        }
      }}
      onMouseOut={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = variants[variant].backgroundColor;
        }
      }}
      {...props}
    >
      {loading ? (
        <span className="spinner" style={{ 
          width: '20px', 
          height: '20px', 
          border: '2px solid rgba(255,255,255,0.3)', 
          borderTop: '2px solid white', 
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          display: 'inline-block'
        }}></span>
      ) : children}
    </button>
  );
};

export default Button;
