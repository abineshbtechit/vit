import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ui/ScrollReveal';
import Button from '../components/ui/Button';

const ServiceSelection = () => {
    const navigate = useNavigate();
    const state = JSON.parse(localStorage.getItem('currentFlowState') || '{}');

    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                background: 'transparent',
                padding: '5rem 0 8rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <ScrollReveal>
                        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1px' }}>Service Options</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                            Choose how you want to connect with <strong>{state.doctorName}</strong> at <strong>{state.hospitalName}</strong>.
                        </p>
                    </ScrollReveal>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-4rem', paddingBottom: '6rem', maxWidth: '900px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                    <ScrollReveal direction="left">
                        <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '30px', padding: '3rem 2rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: 'rgba(0, 82, 204, 0.05)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                margin: '0 auto 2rem'
                            }}>📅</div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Book Appointment</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', flexGrow: 1, lineHeight: '1.6' }}>
                                Schedule a formal visit. Choose your preferred date and time slot for a comprehensive checkup.
                            </p>
                            <Button onClick={() => navigate('/appointment-form')} style={{ width: '100%', padding: '1.2rem', borderRadius: '50px', fontSize: '1.1rem' }}>Book Visit Now</Button>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="right">
                        <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '30px', padding: '3rem 2rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: 'rgba(54, 179, 126, 0.05)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                margin: '0 auto 2rem'
                            }}>💬</div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Submit Query</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', flexGrow: 1, lineHeight: '1.6' }}>
                                Have a quick question? Send a message to the specialist and get detailed medical advice online.
                            </p>
                            <Button variant="secondary" onClick={() => navigate('/query-form')} style={{ width: '100%', padding: '1.2rem', borderRadius: '50px', fontSize: '1.1rem' }}>Send Online Query</Button>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
};

export default ServiceSelection;
