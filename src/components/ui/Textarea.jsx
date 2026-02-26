import React from 'react';

const Textarea = ({
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
            <textarea
                id={id}
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius)',
                    border: `2px solid ${error ? 'var(--error)' : 'var(--border)'}`,
                    outline: 'none',
                    fontSize: '1rem',
                    minHeight: '120px',
                    resize: 'vertical',
                    backgroundColor: 'white'
                }}
                onFocus={(e) => {
                    if (!error) e.target.style.borderColor = 'var(--primary)';
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

export default Textarea;
