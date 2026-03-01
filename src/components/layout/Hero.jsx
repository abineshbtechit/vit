import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section style={{
            padding: '0',
            background: 'transparent',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 'calc(100vh - 72px)',
            display: 'flex',
            alignItems: 'center'
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 1, padding: '4rem 2rem' }}>
                <div className="grid-2 hero-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '4rem',
                    alignItems: 'center'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ opacity }}
                    >
                        <div style={{
                            display: 'inline-block',
                            padding: '0.5rem 1.25rem',
                            backgroundColor: 'white',
                            border: '1px solid var(--border)',
                            borderRadius: '30px',
                            marginBottom: '1.5rem',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: 'var(--primary)'
                        }}>
                            ✨ Smart Healthcare for Everyone
                        </div>
                        <motion.h1
                            style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                                marginBottom: '1.5rem',
                                lineHeight: 1.1,
                                fontWeight: 900,
                                letterSpacing: '-1.5px'
                            }}
                        >
                            Your Health, <br />
                            <span style={{
                                background: 'linear-gradient(90deg, var(--primary), #00a3ff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: 'inline-block'
                            }}>Perfected.</span>
                        </motion.h1>
                        <motion.p style={{
                            fontSize: '1.25rem',
                            color: 'var(--text-muted)',
                            maxWidth: '600px',
                            marginBottom: '3rem',
                            lineHeight: 1.6
                        }}>
                            Experience medical care like never before. Connect with top specialists, manage records, and book appointments instantly with MediFlow.
                        </motion.p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                            {['✓ Quick Appointments', '✓ Top Doctors', '✓ 24/7 Access'].map((tag, i) => (
                                <div key={i} style={{
                                    padding: '0.4rem 0.8rem',
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                    borderRadius: '8px',
                                    color: '#3b82f6',
                                    fontWeight: '700',
                                    fontSize: '0.85rem'
                                }}>
                                    {tag}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate('/select-hospital')}
                                style={{
                                    padding: '1rem 2rem',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 10px 25px -5px rgba(59,130,246,0.4)'
                                }}
                            >
                                🏥 Explore Hospitals
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ y: y1 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <div style={{ position: 'relative' }}>
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <img
                                    src="/healthcare_hero_illustration_1772127300950.png"
                                    alt=""
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '30px',
                                        boxShadow: '0 30px 60px -12px rgba(50, 50, 93, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3)'
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                style={{
                                    position: 'absolute',
                                    bottom: '-20px',
                                    left: '-20px',
                                    backgroundColor: 'white',
                                    padding: '1.5rem',
                                    borderRadius: '20px',
                                    boxShadow: 'var(--shadow-lg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    zIndex: 2
                                }}
                            >
                                <div style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>🏥</div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>50+</h4>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Our Hospitals</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};


export default Hero;

