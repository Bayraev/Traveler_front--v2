import $api from '../http/http';
import { AxiosResponse } from 'axios';
import { User } from '../../types';

interface AuthResponse {
  user: User;
  accessToken: string;
}

export default class AuthService {
  static async login(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/signin', { username, password });
  }

  static async register(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/signup', { username, password });
  }
}
