import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('cg_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalizes error responses so components can just read err.message.
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default client;
