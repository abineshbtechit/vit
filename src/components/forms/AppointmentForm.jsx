import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { requestAppointment } from '../../services/api';

const AppointmentForm = ({ onSuccess }) => {
    const user = JSON.parse(localStorage.getItem('mediFlowUser') || '{}');
    const state = JSON.parse(localStorage.getItem('currentFlowState') || '{}');

    const [formData, setFormData] = useState({
        patientName: user.name || '',
        specialization: state.specialization || '',
        preferredDate: '',
        preferredTime: '',
        notes: '',
        paymentMethod: 'gpay'
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [paymentStep, setPaymentStep] = useState(0); // 0: Form, 1: UPI Triggered

    const validate = () => {
        const newErrors = {};
        if (!formData.patientName.trim()) newErrors.patientName = 'Patient Name is required';
        if (!formData.preferredDate) newErrors.preferredDate = 'Preferred Date is required';
        if (!formData.preferredTime) newErrors.preferredTime = 'Preferred Time Slot is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateUPILink = () => {
        // Real UPI URI Scheme
        const vpa = "paytmqr2810050501011ivx8s502nmi@paytm";
        const name = "MediFlow Healthcare";
        const amount = "500.00";
        const note = `Appt with ${state.doctorName}`.substring(0, 50);

        return `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            if (formData.paymentMethod !== 'hospital') {
                const upiLink = generateUPILink();

                // On Mobile, this triggers the UPI app
                window.location.href = upiLink;

                // Show verification screen
                setPaymentStep(1);
            } else {
                finalizeAppointment();
            }
        }
    };

    const finalizeAppointment = async () => {
        setLoading(true);
        try {
            const methodLabel = {
                'gpay': 'Google Pay',
                'navi': 'Navi UPI',
                'phonepe': 'PhonePe',
                'hospital': 'Pay at Counter'
            }[formData.paymentMethod] || formData.paymentMethod;

            await requestAppointment({
                patient_name: formData.patientName,
                specialization: formData.specialization,
                appointment_date: formData.preferredDate,
                time_slot: formData.preferredTime,
                notes: formData.notes,
                user_id: user.id,
                hospital_id: state.hospitalId,
                doctor_id: state.doctorId,
                payment_method: methodLabel,
                payment_status: formData.paymentMethod === 'hospital' ? 'Pending' : 'Paid',
                fee: 500
            });

            onSuccess(
                formData.paymentMethod === 'hospital'
                    ? 'Appointment booked. Please pay ₹500 at the counter.'
                    : `Payment Verified! Appointment with ${state.doctorName} confirmed.`
            );

            setPaymentStep(0);
        } catch (error) {
            alert(error.message || 'Error finalizing appointment.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    if (paymentStep === 1) {
        return (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⌛</div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>Verifying Payment</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                    If your UPI app didn't open automatically, <a href={generateUPILink()} style={{ color: 'var(--primary)', fontWeight: '700' }}>click here to try again</a>.
                </p>

                <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '20px', marginBottom: '2.5rem', border: '1px dashed #cbd5e1' }}>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Once you complete the payment in your app:</p>
                    <Button onClick={finalizeAppointment} loading={loading} style={{ width: '100%', padding: '1rem', borderRadius: '15px' }}>
                        I've Completed Payment
                    </Button>
                </div>

                <button
                    onClick={() => setPaymentStep(0)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                    Go back and change method
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#f0f9ff', borderRadius: '16px', border: '1px solid #bae6fd' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#0369a1' }}>Consulting: <strong style={{ color: '#0c4a6e' }}>{state.doctorName}</strong></p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#0369a1' }}>Specialty: <strong style={{ color: '#0c4a6e' }}>{state.specialization}</strong></p>
            </div>

            <Input
                id="patientName"
                label="Patient Name"
                value={formData.patientName}
                onChange={handleChange}
                error={errors.patientName}
                required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                    id="preferredDate"
                    label="Preferred Date"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    error={errors.preferredDate}
                    required
                />
                <Input
                    id="preferredTime"
                    label="Preferred Time Slot"
                    type="time"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    error={errors.preferredTime}
                    required
                />
            </div>

            <Textarea
                id="notes"
                label="Symptoms / Notes"
                placeholder="Give the doctor a brief overview..."
                value={formData.notes}
                onChange={handleChange}
                error={errors.notes}
            />

            <div style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                backgroundColor: '#f1f5f9',
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', fontSize: '0.7rem', fontWeight: '900', borderRadius: '0 0 0 15px' }}>SAFE & SECURE</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ fontWeight: '700', color: '#1e293b' }}>Total to Pay</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--primary)' }}>₹500</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    {[
                        { id: 'gpay', title: 'Google Pay', icon: '📱' },
                        { id: 'navi', title: 'Navi UPI', icon: '💠' },
                        { id: 'phonepe', title: 'PhonePe', icon: '🟣' },
                        { id: 'hospital', title: 'At Counter', icon: '🏦' }
                    ].map((m) => (
                        <label key={m.id} style={{
                            padding: '1.25rem 0.5rem',
                            borderRadius: '16px',
                            border: `2px solid ${formData.paymentMethod === m.id ? 'var(--primary)' : 'transparent'}`,
                            backgroundColor: formData.paymentMethod === m.id ? 'white' : 'rgba(255,255,255,0.7)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: formData.paymentMethod === m.id ? '0 10px 15px -3px rgba(0, 0, 0, 0.05)' : 'none',
                        }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={m.id}
                                checked={formData.paymentMethod === m.id}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                style={{ display: 'none' }}
                            />
                            <span style={{ fontSize: '1.8rem' }}>{m.icon}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: formData.paymentMethod === m.id ? 'var(--primary)' : '#64748b' }}>{m.title}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Button type="submit" loading={loading} style={{ width: '100%', padding: '1.3rem', fontSize: '1.2rem', borderRadius: '20px', fontWeight: '900', boxShadow: '0 10px 20px -5px rgba(0, 82, 204, 0.3)' }}>
                {formData.paymentMethod === 'hospital' ? 'Confirm Appointment' : `Pay ₹500 via ${formData.paymentMethod.toUpperCase()}`}
            </Button>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '1.5rem' }}>
                🔒 High-security 256-bit encrypted transaction
            </p>
        </form>
    );
};

export default AppointmentForm;
