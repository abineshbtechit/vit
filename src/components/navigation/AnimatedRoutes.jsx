import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '../../pages/Home';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import HospitalSelection from '../../pages/HospitalSelection';
import DoctorSelection from '../../pages/DoctorSelection';
import ServiceSelection from '../../pages/ServiceSelection';
import Records from '../../pages/Records';
import AppointmentForm from '../forms/AppointmentForm';
import QueryForm from '../forms/QueryForm';
import Card from '../ui/Card';
import PageWrapper from '../ui/PageWrapper';

const AnimatedRoutes = ({ user, handleLoginSuccess, handleLogout, setNotification }) => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><Home user={user} /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><Login onLoginSuccess={handleLoginSuccess} /></PageWrapper>} />
                <Route path="/signup" element={<PageWrapper><Signup onSignupSuccess={handleLoginSuccess} /></PageWrapper>} />
                <Route path="/select-hospital" element={<PageWrapper><HospitalSelection /></PageWrapper>} />
                <Route path="/hospital/:id/doctors" element={<PageWrapper><DoctorSelection /></PageWrapper>} />
                <Route path="/doctor/:id/services" element={<PageWrapper><ServiceSelection /></PageWrapper>} />
                <Route path="/records" element={<PageWrapper><Records user={user} /></PageWrapper>} />
                <Route path="/appointment-form" element={<PageWrapper><div className="container" style={{ padding: '4rem 0', maxWidth: '600px' }}><Card title="Book Appointment"><AppointmentForm onSuccess={(m) => { setNotification(m); window.scrollTo(0, 0); }} /></Card></div></PageWrapper>} />
                <Route path="/query-form" element={<PageWrapper><div className="container" style={{ padding: '4rem 0', maxWidth: '600px' }}><Card title="Submit Query"><QueryForm onSuccess={(m) => { setNotification(m); window.scrollTo(0, 0); }} /></Card></div></PageWrapper>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
