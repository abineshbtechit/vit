import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserActivity } from '../services/api';
import Button from '../components/ui/Button';

const Records = ({ user }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchUserActivity(user.id)
                .then(data => {
                    setActivities(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    if (!user) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Please login to view records.</div>;
    if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading records...</div>;

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>My Medical Records</h2>
            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', borderRadius: 'var(--radius)', overflowX: 'auto', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderBottom: '2px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1.25rem' }}>Patient Name</th>
                            <th style={{ padding: '1.25rem' }}>Type</th>
                            <th style={{ padding: '1.25rem' }}>Date</th>
                            <th style={{ padding: '1.25rem' }}>Doctor</th>
                            <th style={{ padding: '1.25rem' }}>Hospital Name</th>
                            <th style={{ padding: '1.25rem' }}>Location</th>
                            <th style={{ padding: '1.25rem' }}>Hospital ID</th>
                            <th style={{ padding: '1.25rem' }}>Fee</th>
                            <th style={{ padding: '1.25rem' }}>Payment</th>
                            <th style={{ padding: '1.25rem' }}>Record/Description</th>
                            <th style={{ padding: '1.25rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.length === 0 ? (
                            <tr><td colSpan="11" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>You haven't made any appointments or queries yet.</td></tr>
                        ) : (
                            activities.map((act, i) => (
                                <tr key={act.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.25rem', fontWeight: '500' }}>{act.patient_name}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span style={{
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            backgroundColor: act.type === 'Appointment' ? 'rgba(0, 82, 204, 0.1)' : 'rgba(54, 179, 126, 0.1)',
                                            color: act.type === 'Appointment' ? 'var(--primary)' : 'var(--secondary)'
                                        }}>
                                            {act.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem', fontSize: '0.9rem' }}>{new Date(act.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1.25rem', fontWeight: '500' }}>{act.doctor_name}</td>
                                    <td style={{ padding: '1.25rem', fontWeight: '600' }}>{act.hospital_name}</td>
                                    <td style={{ padding: '1.25rem', color: 'var(--text-muted)' }}>{act.location}</td>
                                    <td style={{ padding: '1.25rem', color: 'var(--primary)', fontFamily: 'monospace' }}>#{String(act.hospital_id).padStart(4, '0')}</td>
                                    <td style={{ padding: '1.25rem', fontWeight: '600' }}>{act.fee ? `₹${act.fee}` : '-'}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        {act.payment_status ? (
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                color: act.payment_status === 'Paid' ? 'var(--secondary)' : '#f59e0b',
                                                backgroundColor: act.payment_status === 'Paid' ? 'rgba(54, 179, 126, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '6px'
                                            }}>
                                                {act.payment_status}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td style={{ padding: '1.25rem', fontSize: '0.9rem', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.description || 'No description provided'}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <Button
                                            onClick={() => navigate(`/record/${act.id}`)}
                                            variant="primary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', width: 'auto' }}
                                        >
                                            View Details
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Records;
