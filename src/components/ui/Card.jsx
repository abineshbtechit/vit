import React from 'react';

const Card = ({ children, title, description, className = '' }) => {
    return (
        <div
            style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius)',
                padding: '2rem',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border)',
                height: '100%'
            }}
            className={className}
        >
            {title && (
                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                    {title}
                </h2>
            )}
            {description && (
                <p style={{
                    color: 'var(--text-muted)',
                    marginBottom: '2rem',
                    fontSize: '0.95rem'
                }}>
                    {description}
                </p>
            )}
            {children}
        </div>
    );
};

export default Card;
