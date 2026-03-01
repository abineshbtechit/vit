import React from 'react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', color: 'white', padding: '3rem 0 2rem', marginTop: '4rem', borderTop: '1px solid var(--border)' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1rem' }}>MediFlow</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '300px', lineHeight: '1.5', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Revolutionizing healthcare access with intelligent digital solutions.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {['𝕏', 'f', 'in', 'ig'].map(s => (
                                <div key={s} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>{s}</div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Services</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                            <li>Consultations</li>
                            <li>Records</li>
                            <li>Booking</li>
                            <li>Emergency</li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Company</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                            <li>About Us</li>
                            <li>Privacy</li>
                            <li>Terms</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>&copy; {new Date().getFullYear()} MediFlow Healthcare.</p>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                        <span>Privacy</span>
                        <span>Cookies</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
