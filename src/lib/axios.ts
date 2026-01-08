import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/token';

const api = axios.create({
    baseURL: '/api', // Adjust if your API base URL is different
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call refresh endpoint
                // Note: We use a separate axios instance or plain fetch to avoid infinite loops if this fails
                const response = await axios.post('/api/auth/refresh', {
                    refresh_token: refreshToken
                });

                const { access_token, refresh_token: newRefreshToken } = response.data;

                setTokens(access_token, newRefreshToken || refreshToken);

                // Update header and retry original request
                originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh failed - clean up and redirect
                clearTokens();
                // Optional: Redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
