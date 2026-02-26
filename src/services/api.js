/**
 * API Service to handle all backend communications
 */

const API_BASE_URL = ''; // Empty because we're using the Vite proxy

export const submitQuery = async (queryData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/queries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(queryData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to submit query');
        return data;
    } catch (error) {
        console.error('API Error (submitQuery):', error);
        throw error;
    }
};

export const requestAppointment = async (appointmentData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to request appointment');
        return data;
    } catch (error) {
        console.error('API Error (requestAppointment):', error);
        throw error;
    }
};

export const checkHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return await response.json();
    } catch (error) {
        return { status: 'offline', error: error.message };
    }
};
