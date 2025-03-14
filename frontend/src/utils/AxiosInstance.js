import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Ensures cookies (refresh token) are sent with requests
});

// Request interceptor to attach access token
API.interceptors.request.use(
    (config) => {
        const authData = localStorage.getItem('auth');
        if (authData) {
            const { tokens } = JSON.parse(authData);
            if (tokens?.access?.token) {
                config.headers.Authorization = `Bearer ${tokens.access.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
                
                // Update local storage with new access token
                const authData = JSON.parse(localStorage.getItem('auth'));
                authData.tokens.access.token = refreshResponse.data.accessToken;
                localStorage.setItem('auth', JSON.stringify(authData));

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed', refreshError);
                localStorage.removeItem('auth');
                window.location.href = '/signin'; // Redirect to login on failure
            }
        }
        return Promise.reject(error);
    }
);


