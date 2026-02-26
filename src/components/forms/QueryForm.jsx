import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { submitQuery } from '../../services/api';

const QueryForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        contact: '',
        category: '',
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
        if (!formData.contact.trim()) {
            newErrors.contact = 'Email or Phone is required';
        } else if (formData.contact.includes('@') && !/\S+@\S+\.\S+/.test(formData.contact)) {
            newErrors.contact = 'Invalid email format';
        }
        if (!formData.category) newErrors.category = 'Please select a category';
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
                    message: formData.description
                });

                onSuccess('Your healthcare query has been submitted successfully. A specialist will contact you soon.');
                setFormData({ fullName: '', contact: '', category: '', description: '' });
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
                id="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                required
            />
            <Input
                id="contact"
                label="Email / Phone"
                placeholder="Enter your email or phone number"
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
                placeholder="Tell us about your health concern..."
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                required
            />
            <Button type="submit" loading={loading}>
                Submit Query
            </Button>
        </form>
    );
};

export default QueryForm;
