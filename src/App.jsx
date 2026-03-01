import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AnimatedRoutes from './components/navigation/AnimatedRoutes';
import ScrollToTop from './components/navigation/ScrollToTop';

function App() {
  const [notification, setNotification] = useState(null);
  const { scrollYProgress } = useScroll();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mediFlowUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('mediFlowUser', JSON.stringify(userData));
    setNotification(`Logged in as ${userData.name}`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mediFlowUser');
    setNotification("Logged out successfully.");
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'var(--primary)',
            transformOrigin: '0%',
            scaleX: scrollYProgress,
            zIndex: 1000
          }}
        />
        <Header user={user} onLogout={handleLogout} />
        <main>
          {notification && (
            <div className="container" style={{ marginTop: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--success)', color: 'white', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)' }}>{notification}</div>
            </div>
          )}
          <AnimatedRoutes
            user={user}
            handleLoginSuccess={handleLoginSuccess}
            handleLogout={handleLogout}
            setNotification={setNotification}
          />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
