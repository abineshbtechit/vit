import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
                <nav style={{ display: 'flex', gap: '2rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>Home</Link>
                    <Link to="/query" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>Healthcare Queries</Link>
                    <Link to="/appointment" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>Appointments</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
