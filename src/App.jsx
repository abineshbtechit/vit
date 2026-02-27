import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Header from './components/layout/Header';
import Hero from './components/layout/Hero';
import Card from './components/ui/Card';
import QueryForm from './components/forms/QueryForm';
import AppointmentForm from './components/forms/AppointmentForm';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Button from './components/ui/Button';
import { fetchHospitals, fetchDoctors, fetchUserActivity } from './services/api';

// --- RECORD TABLE COMPONENT ---
const Records = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius)', overflowX: 'auto', boxShadow: 'var(--shadow-md)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '1.25rem' }}>Patient Name</th>
              <th style={{ padding: '1.25rem' }}>Type</th>
              <th style={{ padding: '1.25rem' }}>Date</th>
              <th style={{ padding: '1.25rem' }}>Doctor</th>
              <th style={{ padding: '1.25rem' }}>Hospital Name</th>
              <th style={{ padding: '1.25rem' }}>Location</th>
              <th style={{ padding: '1.25rem' }}>Hospital ID</th>
              <th style={{ padding: '1.25rem' }}>Record/Description</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr><td colSpan="8" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>You haven't made any appointments or queries yet.</td></tr>
            ) : (
              activities.map((act, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
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
                  <td style={{ padding: '1.25rem', fontSize: '0.9rem', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.description || 'No description provided'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- EXISTING COMPONENTS ---

const Home = ({ user }) => {
  const navigate = useNavigate();
  return (
    <>
      <Hero />
      <div className="container" style={{ padding: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', fontWeight: '800' }}>Get Started</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <Card title="For Patients" description="Access healthcare queries and book appointments with ease.">
            <Button onClick={() => user ? navigate('/select-hospital') : navigate('/login')} style={{ width: '100%' }}>Patient Login</Button>
          </Card>
          <Card title="For Hospitals" description="Manage patient requests and hospital operations.">
            <Button variant="secondary" onClick={() => alert("Coming Soon!")} style={{ width: '100%' }}>Hospital Login</Button>
          </Card>
        </div>
      </div>
    </>
  );
};

const HospitalSelection = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHospitals().then(data => { setHospitals(data); setLoading(false); });
  }, []);

  const handleSelect = (h) => {
    localStorage.setItem('currentFlowState', JSON.stringify({ hospitalId: h.id, hospitalName: h.name, location: h.location }));
    navigate(`/hospital/${h.id}/doctors`);
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;
  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Select a Hospital</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {hospitals.map(h => (
          <Card key={h.id} title={h.name} description={h.location}>
            <Button onClick={() => handleSelect(h)}>View Doctors</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

const DoctorSelection = () => {
  const { id } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors(id).then(data => { setDoctors(data); setLoading(false); });
  }, [id]);

  const handleSelect = (d) => {
    const state = JSON.parse(localStorage.getItem('currentFlowState') || '{}');
    localStorage.setItem('currentFlowState', JSON.stringify({ ...state, doctorId: d.id, doctorName: d.name, specialization: d.specialization }));
    navigate(`/doctor/${d.id}/services`);
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;
  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Select a Doctor</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {doctors.map(d => (
          <Card key={d.id} title={d.name} description={d.specialization}>
            <Button onClick={() => handleSelect(d)}>Select Doctor</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ServiceSelection = () => {
  const navigate = useNavigate();
  const state = JSON.parse(localStorage.getItem('currentFlowState') || '{}');
  return (
    <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Options for {state.doctorName}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>{state.hospitalName} • {state.specialization}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <Card title="Appointment" description="Book a visit."><Button onClick={() => navigate('/appointment-form')}>Book Now</Button></Card>
        <Card title="Query" description="Ask a question."><Button variant="secondary" onClick={() => navigate('/query-form')}>Send Query</Button></Card>
      </div>
    </div>
  );
};

function App() {
  const [notification, setNotification] = useState(null);
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
      <div className="App">
        <Header user={user} onLogout={handleLogout} />
        <main>
          {notification && (
            <div className="container" style={{ marginTop: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--success)', color: 'white', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)' }}>{notification}</div>
            </div>
          )}
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<Signup onSignupSuccess={handleLoginSuccess} />} />
            <Route path="/select-hospital" element={<HospitalSelection />} />
            <Route path="/hospital/:id/doctors" element={<DoctorSelection />} />
            <Route path="/doctor/:id/services" element={<ServiceSelection />} />
            <Route path="/records" element={<Records user={user} />} />
            <Route path="/appointment-form" element={<div className="container" style={{ padding: '4rem 0', maxWidth: '600px' }}><Card title="Book Appointment"><AppointmentForm onSuccess={(m) => { setNotification(m); window.scrollTo(0, 0); }} /></Card></div>} />
            <Route path="/query-form" element={<div className="container" style={{ padding: '4rem 0', maxWidth: '600px' }}><Card title="Submit Query"><QueryForm onSuccess={(m) => { setNotification(m); window.scrollTo(0, 0); }} /></Card></div>} />
          </Routes>
        </main>
        <footer style={{ backgroundColor: 'var(--text)', color: 'white', padding: '3rem 0', marginTop: '4rem', textAlign: 'center' }}>
          <div className="container"><p>&copy; {new Date().getFullYear()} MediFlow Healthcare.</p></div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
