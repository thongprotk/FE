import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError<ApiError>) => {
        if (error.response) {
            // Server responded with error status
            const apiError: ApiError = {
                message: error.response.data?.message || 'An error occurred',
                error: error.response.data?.error,
                statusCode: error.response.status,
            };

            // Handle 401 Unauthorized - redirect to login
            if (error.response.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/landing';
            }

            return Promise.reject(apiError);
        } else if (error.request) {
            // Request made but no response
            return Promise.reject({
                message: 'Network error - no response from server',
                statusCode: 0,
            });
        } else {
            // Error setting up request
            return Promise.reject({
                message: error.message || 'Request failed',
                statusCode: 0,
            });
        }
    }
);

export default apiClient;
