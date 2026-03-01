import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, title, description, className = '', hoverEffect = true }) => {
    return (
        <div style={{ perspective: '1000px', height: '100%' }}>
            <motion.div
                whileHover={hoverEffect ? {
                    y: -10,
                    scale: 1.02,
                    rotateX: 5,
                    rotateY: -5,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                } : {}}
                transition={hoverEffect ? { type: "spring", stiffness: 300, damping: 20 } : {}}
                style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius)',
                    padding: '2rem',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transformStyle: 'preserve-3d'
                }}
                className={className}
            >
                <div style={{ transform: 'translateZ(20px)' }}>
                    {title && (
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p style={{
                            color: 'var(--text-muted)',
                            marginBottom: '2rem',
                            fontSize: '0.95rem',
                            flexGrow: 1
                        }}>
                            {description}
                        </p>
                    )}
                    {children}
                </div>
            </motion.div>
        </div>
    );
};


export default Card;

