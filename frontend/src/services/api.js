import axios from 'axios';

// Connect to the backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const verifyTitle = async (title) => {
    try {
        const response = await axios.post(`${API_URL}/titles/verify`, { title });
        return response.data;
    } catch (error) {
        console.error('Error verifying title', error);
        throw error;
    }
};
