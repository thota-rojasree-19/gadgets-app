import axios from 'axios';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : 'http://localhost:5000';
  // If the user included /api in the environment variable, strip it so we have a clean origin
  if (url.endsWith('/api')) {
    url = url.slice(0, -4);
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// Force all API requests to use the /api prefix, avoiding Axios baseURL resolution quirks
api.interceptors.request.use(config => {
  if (config.url && !config.url.startsWith('/api')) {
    config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
  }

  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

export default api;
