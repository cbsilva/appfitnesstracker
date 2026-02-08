import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const mode = import.meta.env.MODE;
let API_URL: string;

if (rawApiUrl) {
  API_URL = rawApiUrl;
} else if (mode === 'production') {
  API_URL = `${location.origin}/api`;
  console.warn('VITE_API_URL not set — using', API_URL, 'Ensure VITE_API_URL is configured in your hosting provider.');
} else {
  API_URL = 'http://localhost:3001/api';
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
