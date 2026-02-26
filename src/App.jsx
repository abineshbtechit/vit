import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Hero from './components/layout/Hero';
import Card from './components/ui/Card';
import QueryForm from './components/forms/QueryForm';
import AppointmentForm from './components/forms/AppointmentForm';

// Home Page Component
const Home = () => (
  <>
    <Hero />
    <div className="container" style={{ padding: '4rem 0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', fontWeight: '800' }}>Our Services</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        <Card title="Expert Guidance" description="Connect with specialists for your health concerns through our query system." />
        <Card title="Quick Appointments" description="Easy scheduling with our doctors across various specializations." />
        <Card title="24/7 Support" description="Our helpdesk is always available for your medical assistance needs." />
      </div>
    </div>
  </>
);

// Query Page Component
const QueryPage = ({ onNotification }) => (
  <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
    <Card
      title="Healthcare Query"
      description="Fill out the form below to receive expert guidance on your health concerns. Our team will review your query and respond within 24 hours."
    >
      <QueryForm onSuccess={onNotification} />
    </Card>
  </div>
);

// Appointment Page Component
const AppointmentPage = ({ onNotification }) => (
  <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
    <Card
      title="Book an Appointment"
      description="Select your preferred specialization and time slot to book an appointment with our doctors. You will receive a confirmation message shortly."
    >
      <AppointmentForm onSuccess={onNotification} />
    </Card>
  </div>
);

function App() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSuccess = (message) => {
    setNotification(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
        <Header />

        <main style={{ minHeight: '70vh' }}>
          {notification && (
            <div className="container">
              <div style={{
                backgroundColor: 'var(--success)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: 'var(--radius)',
                marginTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)',
                animation: 'fadeInDown 0.4s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>✓</span>
                  <p style={{ fontWeight: '500' }}>{notification}</p>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.25rem', padding: '0 0.5rem' }}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/query" element={<QueryPage onNotification={handleSuccess} />} />
            <Route path="/appointment" element={<AppointmentPage onNotification={handleSuccess} />} />
          </Routes>
        </main>

        <footer style={{
          backgroundColor: 'var(--text)',
          color: 'white',
          padding: '3rem 0',
          marginTop: '4rem'
        }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <p style={{ opacity: 0.7 }}>&copy; {new Date().getFullYear()} MediFlow Healthcare. All rights reserved.</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
              <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>Privacy Policy</span>
              <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>Terms of Service</span>
              <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>Patient Rights</span>
            </div>
          </div>
        </footer>

        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
            box-sizing: border-box;
          }
        `}} />
      </div>
    </Router>
  );
}

export default App;
