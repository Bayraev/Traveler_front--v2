import $api from '../http/http';
import { AxiosResponse } from 'axios';
import { Quest, QuestCompletion } from '../../types';
import { ApiResponse } from '../../types/utils';

export default class QuestService {
  static async getRandomQuest(userId: string): Promise<AxiosResponse<ApiResponse<Quest>>> {
    return $api.get<ApiResponse<Quest>>(`/quests/${userId}/random`);
  }

  // Get user's current active quest
  static async getCurrentQuest(userId: string): Promise<AxiosResponse<ApiResponse<Quest>>> {
    return $api.get<ApiResponse<Quest>>(`/quests/${userId}/current`);
  }

  // Get all completed quests for user
  static async getCompletedQuests(
    userId: string,
  ): Promise<AxiosResponse<ApiResponse<QuestCompletion[]>>> {
    return $api.get<ApiResponse<QuestCompletion[]>>(`/quests/${userId}/all`);
  }
}
