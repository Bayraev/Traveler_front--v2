import axios from 'axios';
import { store } from '../store';
import { logout } from '../features/userSlice';

export const API_URL = `http://localhost:5000/api`;

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());

      const currentPath = window.location.pathname;
      if (!['/sign/in', '/sign/up'].includes(currentPath)) {
        window.location.href = '/sign/in';
      }
    }
    return Promise.reject(error);
  },
);

export default $api;
