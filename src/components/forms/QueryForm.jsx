import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { submitQuery } from '../../services/api';

const QueryForm = ({ onSuccess }) => {
    const user = JSON.parse(localStorage.getItem('mediFlowUser') || '{}');
    const state = JSON.parse(localStorage.getItem('currentFlowState') || '{}');

    const [formData, setFormData] = useState({
        fullName: user.name || '',
        contact: user.phone || '',
        category: state.specialization || 'general',
        description: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const categories = [
        { value: 'general', label: 'General Health' },
        { value: 'cardiology', label: 'Cardiology' },
        { value: 'dermatology', label: 'Dermatology' },
        { value: 'pediatrics', label: 'Pediatrics' },
        { value: 'neurology', label: 'Neurology' }
    ];

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                await submitQuery({
                    name: formData.fullName,
                    email: formData.contact,
                    category: formData.category,
                    message: formData.description,
                    user_id: user.id,
                    hospital_id: state.hospitalId,
                    doctor_id: state.doctorId
                });

                onSuccess('Your query has been submitted successfully to ' + state.doctorName);
                setFormData(prev => ({ ...prev, description: '' }));
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
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#0369a1' }}>Sending to: <strong>{state.doctorName || 'Doctor'}</strong></p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#0369a1' }}>Specialty: <strong>{state.specialization || 'Healthcare'}</strong></p>
            </div>

            <Input
                id="fullName"
                label="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                required
            />
            <Input
                id="contact"
                label="Email / Phone"
                value={formData.contact}
                onChange={handleChange}
                error={errors.contact}
                required
            />
            <Select
                id="category"
                label="Category"
                options={categories}
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                required
            />
            <Textarea
                id="description"
                label="Query Description"
                placeholder="Describe your health concern..."
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                required
            />
            <Button type="submit" loading={loading} variant="secondary">
                Submit Query
            </Button>
        </form>
    );
};

export default QueryForm;
