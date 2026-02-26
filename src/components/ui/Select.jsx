import React from 'react';

const Select = ({
    label,
    error,
    id,
    options = [],
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
            <select
                id={id}
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius)',
                    border: `2px solid ${error ? 'var(--error)' : 'var(--border)'}`,
                    outline: 'none',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23172b4d\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.2rem'
                }}
                {...props}
            >
                <option value="" disabled>Select an option</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
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

export default Select;
