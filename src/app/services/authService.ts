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
    avatar: File,
  ): Promise<AxiosResponse<ApiResponse<User>>> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('avatar', avatar);

    return $api.post<ApiResponse<User>>('/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async updateAvatar(
    userId: string,
    avatar: File,
  ): Promise<AxiosResponse<ApiResponse<User>>> {
    const formData = new FormData();
    formData.append('avatar', avatar);

    return $api.put<ApiResponse<User>>(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}
