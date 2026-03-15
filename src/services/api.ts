import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://projextpal.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    // Only clear token on 401 (unauthorized), not on server errors
    if (status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
    }

    // Retry once on 502/503/504 (transient server errors)
    if (status && status >= 502 && status <= 504 && !error.config._retried) {
      error.config._retried = true;
      await new Promise(r => setTimeout(r, 2000));
      return api.request(error.config);
    }

    return Promise.reject(error);
  }
);

export default api;
