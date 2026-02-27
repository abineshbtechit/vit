import React from 'react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#0f172a', color: 'white', padding: '6rem 0 3rem', marginTop: '4rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1.5rem' }}>MediFlow</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '300px', lineHeight: '1.6', marginBottom: '2rem' }}>
                            Revolutionizing healthcare access with intelligent digital solutions for patients and providers worldwide.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['𝕏', 'f', 'in', 'ig'].map(s => (
                                <div key={s} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>{s}</div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Services</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li>Online Consultations</li>
                            <li>Record Management</li>
                            <li>Appointment Booking</li>
                            <li>Emergency Support</li>
                            <li>Pharmacy Search</li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Company</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li>About Us</li>
                            <li>Our Network</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Support</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li>Help Center</li>
                            <li>Patient FAQ</li>
                            <li>Hospital Guide</li>
                            <li>Security</li>
                        </ul>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} MediFlow Healthcare. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                        <span>Privacy</span>
                        <span>Cookies</span>
                        <span>Sitemap</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
