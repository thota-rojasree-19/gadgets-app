import axios from 'axios';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : 'http://localhost:5000';
  if (!url.endsWith('/api')) url += '/api';
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

api.interceptors.request.use(config => {
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
