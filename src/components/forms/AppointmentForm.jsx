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
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.patientName.trim()) newErrors.patientName = 'Patient Name is required';
        if (!formData.preferredDate) newErrors.preferredDate = 'Preferred Date is required';
        if (!formData.preferredTime) newErrors.preferredTime = 'Preferred Time Slot is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                await requestAppointment({
                    patient_name: formData.patientName,
                    specialization: formData.specialization,
                    appointment_date: formData.preferredDate,
                    time_slot: formData.preferredTime,
                    notes: formData.notes,
                    user_id: user.id,
                    hospital_id: state.hospitalId,
                    doctor_id: state.doctorId
                });

                onSuccess('Your appointment request has been scheduled successfully.');
                setFormData({
                    patientName: user.name || '',
                    specialization: state.specialization || '',
                    preferredDate: '',
                    preferredTime: '',
                    notes: ''
                });
            } catch (error) {
                alert(error.message || 'Could not connect to the server.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Hospital: <strong>{state.hospitalName || 'Selected Hospital'}</strong></p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#64748b' }}>Doctor: <strong>{state.doctorName || 'Selected Doctor'}</strong></p>
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
                label="Additional Notes"
                placeholder="Symptoms or instructions..."
                value={formData.notes}
                onChange={handleChange}
                error={errors.notes}
            />
            <Button type="submit" loading={loading}>
                Confirm Appointment
            </Button>
        </form>
    );
};

export default AppointmentForm;
