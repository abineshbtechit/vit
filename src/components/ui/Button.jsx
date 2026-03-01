import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  loading = false,
  disabled = false,
  style: externalStyle = {},
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1.5rem',
    fontWeight: '600',
    fontSize: '1rem',
    border: 'none',
    transition: 'all 0.2s ease',
    opacity: loading || disabled ? 0.7 : 1,
    cursor: loading || disabled ? 'not-allowed' : 'pointer',
  };

  const variants = {
    primary: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '50px',
    },
    secondary: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '50px',
    },
    danger: {
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50px',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '2px solid #3b82f6',
      color: '#3b82f6',
      borderRadius: '50px',
    }
  };

  const currentVariant = variants[variant] || variants.primary;

  // Allow external styles for layout only — color is always enforced by variant
  const safeExternalStyle = { ...externalStyle };
  delete safeExternalStyle.backgroundColor;
  delete safeExternalStyle.color;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...baseStyles,
        ...safeExternalStyle,
        ...currentVariant,
      }}
      className={`btn-${variant} ${className}`}
      {...props}
    >
      {loading ? (
        <span style={{
          width: '18px',
          height: '18px',
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
