import $api from '../http/http';
import { AxiosResponse } from 'axios';
import { User } from '../../types';
import { ApiResponse } from '../../types/utils';

export default class FriendService {
  // Get user's friends
  static async getFriends(userId: string): Promise<AxiosResponse<ApiResponse<User[]>>> {
    const response = await $api.get<ApiResponse<User[]>>(`/users/${userId}/friends`);
    console.log(response.data);
    return response;
  }

  // Add a new friend
  static async addFriend(
    userId: string,
    friendUsername: string,
  ): Promise<AxiosResponse<ApiResponse<User>>> {
    return $api.post<ApiResponse<User>>(`/users/${userId}/add-friend/${friendUsername}`);
  }
}
