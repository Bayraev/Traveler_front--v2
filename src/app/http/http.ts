import axios from 'axios';
import { store } from '../store';
import { logout } from '../features/userSlice';

export const isProduction = false;
export const API_URL = isProduction
  ? 'https://traveler-d7oq.onrender.com/api'
  : 'http://localhost:5000/api';
export const API_URL_STATIC = isProduction
  ? 'https://traveler-d7oq.onrender.com'
  : 'http://localhost:5000';

const $api = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
});

$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());

      // if user is not authorized, redirect to login page
      const currentPath = window.location.pathname;
      if (!['/sign/in', '/sign/up'].includes(currentPath)) {
        window.location.href = '/sign/in';
      }
    }
    return Promise.reject(error);
  },
);

export default $api;
