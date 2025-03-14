import { createSlice } from '@reduxjs/toolkit';
import history from '../history';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API } from '../utils/AxiosInstance';
import { json } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create a separate axios instance for refreshing tokens
const refreshAPI = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Needed for sending the refresh token in cookies
});

const initialUser = localStorage.getItem('auth')
    ? JSON.parse(localStorage.getItem('auth'))
    : null;

const initialState = {
    isLoading: false,
    currentUser: initialUser,
    error: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        registerSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        registerFailure: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        logoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
        },
        startLoading: (state) => {
            state.isLoading = true;
        },
    },
});

export const {
    loginFailure,
    loginSuccess,
    registerFailure,
    registerSuccess,
    logoutSuccess,
    startLoading,
} = authSlice.actions;

export default authSlice.reducer;

export const register = (user) => async (dispatch) => {
    try {
        dispatch(startLoading());

        const response = await API.post(`/auth/register`, user, {
            headers: { 'Content-Type': 'application/json' },
        });

        dispatch(registerSuccess(response.data));
        toast.success('Registration successful');
        dispatch(logoutSuccess());
        window.location.reload();
        history.push('/signin');
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        dispatch(registerFailure(errorMessage));
        toast.error(errorMessage);
    }
};

export const signin = (user) => async (dispatch) => {
    try {
        dispatch(startLoading());

        const response = await API.post(`/auth/login`, user, {
            headers: { 'Content-Type': 'application/json' },
        });

        localStorage.setItem('auth', JSON.stringify(response.data));
        dispatch(loginSuccess(response.data));
        toast.success('Login successful');
        history.push('/dashboard');
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        dispatch(loginFailure(errorMessage));
        toast.error(errorMessage);
    }
};

export const logout = () => async (dispatch) => {
    try {
        const authData = localStorage.getItem('auth');
        const auth = JSON.parse(authData);
        const refreshToken = auth["tokens"]["refresh"]["token"];
        await API.post('/auth/logout', {refreshToken}, { withCredentials: true }); // Calls backend logout
        localStorage.removeItem('auth'); // Remove stored user data
        dispatch(logoutSuccess());
        toast.success('Logged out successfully');
        history.push('/signin') // Redirect to Sign In
    } catch (error) {
        console.error('Logout failed:', error.response?.data?.message || error.message);
        toast.error('Logout failed, please try again.');
    }
};

export const refreshAccessToken = () => async (dispatch) => {
    try {
        const response = await refreshAPI.post(`/auth/refresh`, {}, { withCredentials: true });

        const authData = localStorage.getItem('auth');
        if (!authData) {
            throw new Error('No authentication data found');
        }

        const auth = JSON.parse(authData);
        auth.tokens.access.token = response.data.tokens.access.token; // Update the access token
        localStorage.setItem('auth', JSON.stringify(auth));

        dispatch(loginSuccess(auth)); // Update Redux store with the new token
        return auth.tokens.access.token; // Return the new token for API retries
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        dispatch(logoutSuccess());
        localStorage.removeItem('auth');
        window.location.href = '/signin'; // Redirect to login if refresh fails
    }
};
