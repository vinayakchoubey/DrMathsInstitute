import axios from 'axios';

// API base URL - uses environment variable in production, localhost in development
export const API_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}`;

// Create axios instance with default configuration
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to get auth header
export const getAuthHeader = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
};

// Axios instance with auth
export const authApi = axios.create({
    baseURL: API_URL,
});

// Add auth interceptor
authApi.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
