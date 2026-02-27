import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDoctors } from '../services/api';
import ScrollReveal from '../components/ui/ScrollReveal';
import Button from '../components/ui/Button';

const DoctorSelection = () => {
    const { id } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const state = JSON.parse(localStorage.getItem('currentFlowState') || '{}');

    useEffect(() => {
        fetchDoctors(id).then(data => { setDoctors(data); setLoading(false); });
    }, [id]);

    const handleSelect = (d) => {
        const state = JSON.parse(localStorage.getItem('currentFlowState') || '{}');
        localStorage.setItem('currentFlowState', JSON.stringify({ ...state, doctorId: d.id, doctorName: d.name, specialization: d.specialization }));
        navigate(`/doctor/${d.id}/services`);
    };

    if (loading) return <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto', width: '40px', height: '40px', borderTopColor: 'var(--primary)' }}></div><p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Finding specialists...</p></div>;

    return (
        <div style={{ backgroundColor: '#fcfdfe', minHeight: '80vh' }}>
            <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                padding: '5rem 0 8rem',
                borderBottom: '1px solid #bae6fd',
                textAlign: 'center'
            }}>
                <div className="container">
                    <ScrollReveal>
                        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1px' }}>Our Specialists</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Qualified experts for {state.hospitalName} at your service. Choose the right specialist for your needs.</p>
                    </ScrollReveal>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-4rem', paddingBottom: '6rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                    {doctors.map((d, i) => (
                        <ScrollReveal key={d.id} delay={i * 0.05}>
                            <div style={{ backgroundColor: 'white', borderRadius: '30px', padding: '2.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{
                                        width: '70px',
                                        height: '70px',
                                        backgroundColor: 'rgba(54, 179, 126, 0.1)',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem'
                                    }}>👨‍⚕️</div>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.25rem', color: 'var(--text)' }}>{d.name}</h3>
                                        <span style={{
                                            backgroundColor: 'rgba(0, 82, 204, 0.08)',
                                            color: 'var(--primary)',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '700'
                                        }}>{d.specialization}</span>
                                    </div>
                                </div>
                                <div style={{ flexGrow: 1, marginBottom: '2rem' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>Years of experience in treating complex cases with highest patient satisfaction rate.</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: '600' }}>⭐ 4.9 Rating</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🕒 9 AM - 5 PM</div>
                                    </div>
                                </div>
                                <Button onClick={() => handleSelect(d)} style={{ width: '100%', padding: '1rem', borderRadius: '15px' }}>Select Specialist</Button>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorSelection;
