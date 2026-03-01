import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/layout/Hero';
import ScrollReveal from '../components/ui/ScrollReveal';
import Button from '../components/ui/Button';

const Home = ({ user }) => {
    const navigate = useNavigate();
    return (
        <>
            <Hero />

            {/* Features Section */}
            <div style={{ padding: '6rem 0' }}>
                <div className="container">
                    <ScrollReveal>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Comprehensive Care</h2>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Everything you need to manage your health in one place, powered by advanced technology.</p>
                        </div>
                    </ScrollReveal>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
                        {[
                            { title: 'Online Queries', color: '#0052cc', icon: '💬', desc: 'Ask medical questions to experts from the comfort of your home.' },
                            { title: 'Easy Booking', color: '#36b37e', icon: '📅', desc: 'Schedule appointments with top doctors in just a few clicks.' },
                            { title: 'Medical Records', color: '#ffab00', icon: '📂', desc: 'Access and manage your comprehensive medical history anytime.' },
                            { title: 'Top Specialists', color: '#de350b', icon: '🩺', desc: 'Connect with verified healthcare professionals across various fields.' }
                        ].map((f, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <div style={{
                                    padding: '2.5rem',
                                    borderRadius: '24px',
                                    backgroundColor: 'rgba(30, 41, 59, 0.6)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    height: '100%'
                                }} className="feature-card">
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        marginBottom: '1.5rem',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
                                    }}>
                                        {f.icon}
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{f.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{f.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>

            {/* Get Started Section */}
            <div className="container" style={{ padding: '6rem 0' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    borderRadius: '40px',
                    padding: '5rem 4rem',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    {/* Decorative background shape */}
                    <div className="desktop-only" style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>

                    <ScrollReveal>
                        <h2 style={{ color: 'white', fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-2px' }}>Care that follows you</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto 4rem', lineHeight: '1.6' }}>
                            Join a community of patients and healthcare providers who are defining the future of digital health.
                        </p>
                    </ScrollReveal>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
                        <ScrollReveal delay={0.2} direction="left">
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '3.5rem 2.5rem', borderRadius: '32px', color: 'white', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>👩‍⚕️</div>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.75rem', color: 'white' }}>For Patients</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', flexGrow: 1, lineHeight: '1.6' }}>Track your health journey, book appointments, and consult with top doctors instantly.</p>
                                <Button onClick={() => user ? navigate('/select-hospital') : navigate('/login')} style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', fontWeight: '700' }}>Enter Patient Portal</Button>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.4} direction="right">
                            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', padding: '3.5rem 2.5rem', borderRadius: '32px', color: 'white', textAlign: 'left', border: '1px solid rgba(255, 255, 255, 0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>🏥</div>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.75rem', color: 'white' }}>For Hospitals</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', flexGrow: 1, lineHeight: '1.6' }}>Streamline your hospital management and connect with more patients through our network.</p>
                                <Button variant="secondary" onClick={() => alert("Hospital registration is currently closed.")} style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', fontWeight: '700' }}>Hospital Onboarding</Button>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            {/* Trust Section */}
            <div style={{ paddingBottom: '8rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                        {[
                            { label: 'Verified Hospitals', val: '50+' },
                            { label: 'Active Patients', val: '25k+' },
                            { label: 'Medical Queries', val: '100k+' },
                            { label: 'Expert Specialists', val: '500+' }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.25rem' }}>{stat.val}</div>
                                <div style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
