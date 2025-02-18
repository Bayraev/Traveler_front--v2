import $api from '../http/http';
import { AxiosResponse } from 'axios';
import { Friend } from '../../types';
import { ApiResponse } from '../../types/utils';

export default class FriendService {
  // Get user's friends
  static async getFriends(userId: string): Promise<AxiosResponse<ApiResponse<Friend[]>>> {
    const response = await $api.get<ApiResponse<Friend[]>>(`/users/${userId}/friends`);
    console.log(response.data);
    return response;
  }

  // Add a new friend
  static async addFriend(
    userId: string,
    friendUsername: string,
  ): Promise<AxiosResponse<ApiResponse<Friend>>> {
    return $api.post<ApiResponse<Friend>>(`/users/${userId}/add-friend/${friendUsername}`);
  }
}
