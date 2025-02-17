import $api from '../http/http';
import { AxiosResponse } from 'axios';
import { User } from '../../types';
import { ApiResponse } from '../../types/utils';

export default class AuthService {
  static async login(
    username: string,
    password: string,
  ): Promise<AxiosResponse<ApiResponse<User>>> {
    return $api.post<ApiResponse<User>>('/signin', { username, password });
  }

  static async register(
    username: string,
    password: string,
  ): Promise<AxiosResponse<ApiResponse<User>>> {
    return $api.post<ApiResponse<User>>('/signup', { username, password });
  }
}
