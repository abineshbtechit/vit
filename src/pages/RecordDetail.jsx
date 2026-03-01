import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRecordById } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const RecordDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecord = async () => {
            try {
                const data = await fetchRecordById(id);
                setRecord(data);
            } catch (error) {
                console.error('Failed to load record:', error);
            } finally {
                setLoading(false);
            }
        };
        loadRecord();
    }, [id]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto', width: '40px', height: '40px', borderTopColor: 'var(--primary)' }}></div>
                <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>Loading record details...</p>
            </div>
        );
    }

    if (!record) {
        return (
            <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>Record Not Found</h2>
                <Button onClick={() => navigate('/records')}>Back to Records</Button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '80vh', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Button variant="secondary" onClick={() => navigate(-1)} style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                        ← Back
                    </Button>
                </div>

                <Card title={`Medical ${record.type}`} hoverEffect={false}>
                    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>Dr. {record.doctor_name}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{record.hospital_name} • {record.location}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{
                                backgroundColor: record.type === 'Query' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(54, 179, 126, 0.1)',
                                color: record.type === 'Query' ? 'var(--primary)' : 'var(--secondary)',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '700'
                            }}>
                                {record.type}
                            </span>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {new Date(record.created_at).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h5 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text)' }}>Description / Concern:</h5>
                        <div style={{
                            backgroundColor: '#f8fafc',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid #f1f5f9',
                            lineHeight: '1.7',
                            color: '#334155'
                        }}>
                            {record.description}
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h5 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text)' }}>Medical Recommendation:</h5>
                        <div style={{
                            background: 'linear-gradient(to bottom right, #f0fdf4, #ffffff)',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid #dcfce7',
                            lineHeight: '1.7',
                            color: '#166534',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: 0.1 }}>💊</div>
                            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Dr. {record.doctor_name}'s Recommendation:</p>
                            <p>Based on your query, we recommend a follow-up consultation. Please maintain a healthy diet and monitor your symptoms closely over the next 48 hours. If symptoms persist or worsen, visit our outpatient department immediately.</p>
                        </div>
                    </div>

                    {record.type === 'Appointment' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '16px' }}>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: '#0369a1', display: 'block', marginBottom: '0.25rem' }}>Fee Status</span>
                                <span style={{ fontWeight: '700', color: '#0c4a6e' }}>₹{record.fee} - {record.payment_status}</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: '#0369a1', display: 'block', marginBottom: '0.25rem' }}>Payment Method</span>
                                <span style={{ fontWeight: '700', color: '#0c4a6e', textTransform: 'capitalize' }}>{record.payment_method}</span>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                        <Button onClick={() => navigate('/select-hospital')}>Book Follow-up Appointment</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RecordDetail;
