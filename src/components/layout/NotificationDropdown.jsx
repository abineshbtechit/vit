import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUserActivity, markRecordRead } from '../../services/api';

const NotificationDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && isOpen) {
            loadActivity();
        }
    }, [user, isOpen]);

    // Initial load for count
    useEffect(() => {
        if (user) loadActivity(true);
    }, [user]);

    const loadActivity = async (isInitial = false) => {
        if (!user || !user.id) {
            console.warn('NotificationDropdown: No user ID available to fetch activity');
            return;
        }

        if (!isInitial) setLoading(true);
        try {
            console.log('Fetching activity for user ID:', user.id);
            const data = await fetchUserActivity(user.id);
            console.log('Activity data received:', data);

            // Show ONLY unread Query suggestions in the dropdown
            const unreadQueries = data.filter(item =>
                (item.type === 'Query' || item.type === 'query') && !item.is_read
            );
            setActivities(unreadQueries.slice(0, 5));
        } catch (error) {
            console.error('Failed to load activity:', error);
        } finally {
            if (!isInitial) setLoading(false);
        }
    };

    const handleMarkAsRead = async (recordId, e) => {
        e.stopPropagation();
        try {
            // Navigate to detail page
            navigate(`/record/${recordId}`);
            setIsOpen(false);

            // Mark as read in backend
            await markRecordRead(recordId);

            // Remove from local dropdown list immediately
            setActivities(prev => prev.filter(act => act.id !== recordId));
        } catch (error) {
            console.error('Failed to mark read:', error);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isOpen) return;
        const handleClick = () => setIsOpen(false);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [isOpen]);

    const unreadCount = activities.filter(a => !a.is_read).length;

    return (
        <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(37, 99, 235, 0.05)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                title="Recent Queries"
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    color: 'var(--text)',
                    padding: '0.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease'
                }}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        backgroundColor: 'var(--error)',
                        color: 'white',
                        fontSize: '0.6rem',
                        fontWeight: '800',
                        minWidth: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '0.75rem',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
                            width: '320px',
                            zIndex: 1000,
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{
                            padding: '1.25rem',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'linear-gradient(to right, #f8fafc, #ffffff)'
                        }}>
                            <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text)' }}>Query Suggestions</span>
                            {unreadCount > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{unreadCount} New</span>}
                        </div>

                        <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '0.5rem' }}>
                            {loading ? (
                                <div style={{ padding: '2.5rem', textAlign: 'center' }}>
                                    <div className="spinner" style={{ margin: '0 auto', borderTopColor: 'var(--primary)', width: '24px', height: '24px' }}></div>
                                    <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fetching your history...</p>
                                </div>
                            ) : activities.length > 0 ? (
                                activities.map((activity, index) => (
                                    <motion.div
                                        key={index}
                                        onClick={(e) => handleMarkAsRead(activity.id, e)}
                                        whileHover={{ x: 4, backgroundColor: '#f8fafc' }}
                                        style={{
                                            padding: '0.85rem',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            marginBottom: '0.25rem',
                                            transition: 'background 0.2s',
                                            display: 'flex',
                                            gap: '0.85rem',
                                            opacity: activity.is_read ? 0.6 : 1,
                                            borderLeft: activity.is_read ? 'none' : '3px solid var(--primary)',
                                            backgroundColor: activity.is_read ? 'transparent' : 'rgba(37, 99, 235, 0.02)'
                                        }}
                                    >
                                        <div style={{
                                            backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                            color: 'var(--primary)',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                            </svg>
                                        </div>
                                        <div style={{ overflow: 'hidden', flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.15rem' }}>
                                                <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    Dr. {activity.doctor_name}
                                                </p>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                                                    {new Date(activity.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-muted)',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                lineHeight: '1.4'
                                            }}>
                                                {activity.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        backgroundColor: '#f1f5f9',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1rem'
                                    }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text)' }}>No Queries Yet</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Your past queries will appear here as suggestions.</p>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '0.85rem', textAlign: 'center', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border)' }}>
                            <Link
                                to="/records"
                                onClick={() => setIsOpen(false)}
                                style={{
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.4rem'
                                }}
                            >
                                View Medical History
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
