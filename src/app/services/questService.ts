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

  // Complete quest with photo proof
  static async completeQuest(
    userId: string,
    images: File[],
    description: string,
  ): Promise<AxiosResponse<ApiResponse<QuestCompletion>>> {
    const formData = new FormData();

    // Append each image correctly
    for (const image of images) {
      formData.append('images', image); // Correct way
    }

    // Append description
    formData.append('description', description);

    // Debugging: Log FormData
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await $api.post<ApiResponse<QuestCompletion>>(
      `/quests/${userId}/complete`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    console.log(response.data);
    return response;
  }
}
