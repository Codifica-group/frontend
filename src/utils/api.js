import axios from 'axios';

const baseURL = import.meta.env.VITE_URL_API || "";
const api = axios.create({
  baseURL: `${baseURL}/api`,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      window.location.href = '/error';
    }
    return Promise.reject(error);
  }
);

export default api;