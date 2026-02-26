import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { requestAppointment } from '../../services/api';

const AppointmentForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        patientName: '',
        specialization: '',
        preferredDate: '',
        preferredTime: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const specializations = [
        { value: 'general', label: 'General Physician' },
        { value: 'cardiology', label: 'Cardiologist' },
        { value: 'dermatology', label: 'Dermatologist' },
        { value: 'pediatrics', label: 'Pediatrician' },
        { value: 'neurology', label: 'Neurologist' },
        { value: 'orthopedics', label: 'Orthopedic Surgeon' }
    ];

    const validate = () => {
        const newErrors = {};
        if (!formData.patientName.trim()) newErrors.patientName = 'Patient Name is required';
        if (!formData.specialization) newErrors.specialization = 'Please select a specialization';
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
                    notes: formData.notes
                });

                onSuccess('Your appointment request has been scheduled. Please wait for confirmation.');
                setFormData({
                    patientName: '',
                    specialization: '',
                    preferredDate: '',
                    preferredTime: '',
                    notes: ''
                });
            } catch (error) {
                alert(error.message || 'Could not connect to the server. Please ensure the backend is running.');
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
            <Input
                id="patientName"
                label="Patient Name"
                placeholder="Enter patient full name"
                value={formData.patientName}
                onChange={handleChange}
                error={errors.patientName}
                required
            />
            <Select
                id="specialization"
                label="Doctor Specialization"
                options={specializations}
                value={formData.specialization}
                onChange={handleChange}
                error={errors.specialization}
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
                placeholder="Any specific instructions or symptoms..."
                value={formData.notes}
                onChange={handleChange}
                error={errors.notes}
            />
            <Button type="submit" variant="secondary" loading={loading}>
                Request Appointment
            </Button>
        </form>
    );
};

export default AppointmentForm;
