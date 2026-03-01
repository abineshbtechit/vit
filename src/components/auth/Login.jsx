import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { login } from '../../services/api';

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await login(formData);
            if (data.success) {
                onLoginSuccess(data.user);
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: '420px',
            margin: '4rem auto',
            padding: '3rem',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: '#3b82f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem' }}>🏥</div>
                <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Patient Login</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Welcome back to MediFlow</p>
            </div>
            {error && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Phone Number</label>
                    <input id="phone" type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem 1rem', backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '1.75rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Password</label>
                    <input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem 1rem', backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <Button type="submit" loading={loading} style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', fontWeight: '700' }}>
                    Login
                </Button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                Don't have an account? <Link to="/signup" style={{ color: '#3b82f6', fontWeight: '600' }}>Sign up here</Link>
            </p>
        </div>
    );
};

export default Login;
