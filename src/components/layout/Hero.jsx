import React from 'react';

const Hero = () => {
    return (
        <section style={{
            padding: '4rem 0',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ffffff 0%, #eef2f7 100%)',
            marginBottom: '2rem'
        }}>
            <div className="container">
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1.2 }}>
                    Your Health, <span style={{ color: 'var(--primary)' }}>Simplified.</span>
                </h1>
                <p style={{
                    fontSize: '1.2rem',
                    color: 'var(--text-muted)',
                    maxWidth: '600px',
                    margin: '0 auto 2rem',
                    lineHeight: 1.6
                }}>
                    Expert care is just a few clicks away. Submit a query or book an appointment with our world-class specialists today.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <div style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(0, 82, 204, 0.1)', borderRadius: '20px', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                        ✓ 24/7 Support
                    </div>
                    <div style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(54, 179, 126, 0.1)', borderRadius: '20px', color: 'var(--secondary)', fontWeight: '600', fontSize: '0.9rem' }}>
                        ✓ Top Specialists
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
