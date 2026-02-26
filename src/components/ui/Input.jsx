import React from 'react';

const Input = ({
    label,
    error,
    id,
    ...props
}) => {
    return (
        <div style={{ marginBottom: '1.5rem', width: '100%' }}>
            {label && (
                <label
                    htmlFor={id}
                    style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: 'var(--text)',
                        fontSize: '0.9rem'
                    }}
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius)',
                    border: `2px solid ${error ? 'var(--error)' : 'var(--border)'}`,
                    outline: 'none',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    backgroundColor: 'white'
                }}
                onFocus={(e) => {
                    if (!error) e.target.style.borderColor = 'var(--primary)';
                }}
                onBlur={(e) => {
                    if (!error) e.target.style.borderColor = 'var(--border)';
                }}
                {...props}
            />
            {error && (
                <p style={{
                    color: 'var(--error)',
                    fontSize: '0.8rem',
                    marginTop: '0.25rem',
                    fontWeight: '500'
                }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
