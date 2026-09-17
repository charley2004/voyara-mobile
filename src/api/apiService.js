// src/api/apiService.js
// ─────────────────────────────────────────────────────────────
// WHAT THIS FILE DOES:
// Central API layer — all HTTP requests to our backend live here.
// Screens call these functions, never axios directly.
//
// CONCEPT TO LEARN: Axios Interceptors
// An interceptor is a function that runs on every request
// or response automatically. We use a request interceptor
// to attach the JWT token to every outgoing request.
// This means we never manually add the Authorization header
// in each screen — it happens automatically here.
// ─────────────────────────────────────────────────────────────

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Base URL ──────────────────────────────────────────────────
// During development, this points to your local backend.
// When you deploy, change this to your Render URL.
// YOUR COMPUTER'S LOCAL IP — not localhost
// localhost on a phone means the PHONE itself, not your computer
// Find your IP: run "ipconfig" in terminal → IPv4 Address
const BASE_URL = 'http://192.168.100.41:5000/api';
// ↑ REPLACE with your actual local IP address

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds — fail if server takes too long
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ───────────────────────────────────────
// Runs before EVERY outgoing request.
// Reads the token from phone storage and attaches it to header.
// This is why we never write "Authorization: Bearer..." manually.
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────
// Runs after EVERY response comes back.
// If we get a 401, the token expired — clear storage and
// the app will redirect to login automatically.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ── Auth API ──────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ── Packages API ──────────────────────────────────────────────
export const packagesAPI = {
  getAll: (params) => api.get('/packages', { params }),
  getSingle: (id) => api.get(`/packages/${id}`),
};

// ── Bookings API ──────────────────────────────────────────────
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getSingle: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
};

// ── Payments API ──────────────────────────────────────────────
export const paymentsAPI = {
  initiate: (bookingId) => api.post('/payments/initiate', { bookingId }),
  initiateRide: (rideId) => api.post('/payments/initiate-ride', { rideId }),
  verify: (reference) => api.get(`/payments/verify/${reference}`),
};

// ── Rides API ─────────────────────────────────────────────────
export const ridesAPI = {
  book: (data) => api.post('/rides', data),
  getMyRides: () => api.get('/rides/my-rides'),
};



export default api;