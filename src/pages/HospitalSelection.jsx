import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHospitals } from '../services/api';
import ScrollReveal from '../components/ui/ScrollReveal';
import Button from '../components/ui/Button';

const HospitalSelection = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHospitals().then(data => { setHospitals(data); setLoading(false); });
    }, []);

    const handleSelect = (h) => {
        localStorage.setItem('currentFlowState', JSON.stringify({ hospitalId: h.id, hospitalName: h.name, location: h.location }));
        navigate(`/hospital/${h.id}/doctors`);
    };

    if (loading) return <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto', width: '40px', height: '40px', borderTopColor: 'var(--primary)' }}></div><p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Finding hospitals near you...</p></div>;

    return (
        <div style={{ backgroundColor: '#fcfdfe', minHeight: '80vh' }}>
            <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
                padding: '5rem 0 8rem',
                borderBottom: '1px solid #e2e8f0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <ScrollReveal>
                        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1px' }}>Available Hospitals</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Choose from our network of world-class medical facilities and top-tier healthcare providers.</p>
                    </ScrollReveal>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-4rem', paddingBottom: '6rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                    {hospitals.map((h, i) => (
                        <ScrollReveal key={h.id} delay={i * 0.05}>
                            <div style={{ backgroundColor: 'white', borderRadius: '30px', padding: '2.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: 'rgba(0, 82, 204, 0.05)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.8rem',
                                    marginBottom: '1.5rem'
                                }}>🏥</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{h.name}</h3>
                                <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    📍 {h.location}
                                </p>
                                <div style={{ flexGrow: 1, marginBottom: '2rem' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>Leading facility with modern amenities and specialized medical departments.</p>
                                </div>
                                <Button onClick={() => handleSelect(h)} style={{ width: '100%', padding: '1rem', borderRadius: '15px' }}>View Doctors</Button>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HospitalSelection;
