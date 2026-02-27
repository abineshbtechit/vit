import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
        <header style={{
            backgroundColor: 'white',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.5rem'
                    }}>M</div>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>MediFlow</span>
                </Link>
                <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>Home</Link>
                    {user ? (
                        <>
                            <Link to="/select-hospital" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>Services</Link>
                            <Link to="/records" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>My Records</Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Hello, {user.name}</span>
                                <Button onClick={handleLogout} variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Logout</Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>Login</Link>
                            <Link to="/signup">
                                <Button style={{ padding: '0.5rem 1.25rem' }}>Sign Up</Button>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
