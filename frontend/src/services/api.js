import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL;

const resolveApiBaseUrl = () => {
  if (rawBaseUrl && typeof rawBaseUrl === 'string') {
    const trimmed = rawBaseUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 15000,
});

export const getErrorMessage = (error, defaultMessage = 'An unexpected error occurred') => {
  if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
    return 'Cannot connect to backend server. If using Render free tier, the backend may need ~50 seconds to spin up on first request. Please wait a moment and click Retry.';
  }
  if (error?.response?.status === 503) {
    return error.response.data?.message || 'Database connection unavailable. Please check MongoDB connection.';
  }
  return error?.response?.data?.message || error?.message || defaultMessage;
};

export default api;
