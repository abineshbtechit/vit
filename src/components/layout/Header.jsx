import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { motion, useScroll, useTransform } from 'framer-motion';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        onLogout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const NavLinks = () => (
        <>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '600', fontSize: '0.95rem' }}>Home</Link>
            {user ? (
                <>
                    <Link to="/select-hospital" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '600', fontSize: '0.95rem' }}>Services</Link>
                    <Link to="/records" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '600', fontSize: '0.95rem' }}>My Records</Link>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
                        <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.95rem' }}>Hello, {user.name}</span>
                        <Button onClick={handleLogout} variant="secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Logout</Button>
                    </div>
                </>
            ) : (
                <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '600', fontSize: '0.95rem' }}>Login</Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', width: '100%' }}>Sign Up</Button>
                    </Link>
                </>
            )}
        </>
    );

    return (
        <>
            <header style={{
                backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'white',
                backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                borderBottom: '1px solid var(--border)',
                padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: isScrolled ? 'var(--shadow-md)' : 'none',
                transition: 'all 0.3s ease'
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            animate={{
                                y: [0, -5, 0],
                                rotateY: [0, 15, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: 'var(--primary)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.5rem',
                                boxShadow: '0 8px 15px rgba(0, 82, 204, 0.3)',
                                transformStyle: 'preserve-3d'
                            }}
                        >M</motion.div>
                        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.5px' }}>MediFlow</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '600', fontSize: '0.95rem' }}>Home</Link>
                        {user ? (
                            <>
                                <Link to="/select-hospital" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '600', fontSize: '0.95rem' }}>Services</Link>
                                <Link to="/records" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '600', fontSize: '0.95rem' }}>My Records</Link>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                    <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.95rem' }}>Hello, {user.name}</span>
                                    <Button onClick={handleLogout} variant="secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Logout</Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '600', fontSize: '0.95rem' }}>Login</Link>
                                <Link to="/signup">
                                    <Button style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="mobile-only"
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            display: 'none', // Overridden by media query if needed, but we'll use a class
                            cursor: 'pointer'
                        }}
                    >
                        {isMobileMenuOpen ? '✕' : '☰'}
                    </button>

                </div>
            </header>

            {/* Mobile Menu Sidebar */}
            <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <NavLinks />
            </div>
        </>
    );
};

export default Header;

