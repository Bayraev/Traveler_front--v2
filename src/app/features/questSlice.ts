import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Quest, QuestCompletion } from '../../types';
import QuestService from '../services/questService';
import { toast } from 'sonner';

interface QuestState {
  currentQuest: Quest | null;
  completedQuests: QuestCompletion[];
  loading: boolean;
  error: string | null;
  isTaskPopupOpen: boolean;
}

const initialState: QuestState = {
  currentQuest: null,
  completedQuests: [],
  loading: false,
  error: null,
  isTaskPopupOpen: false,
};

// Fetch random quest
export const rollNewQuest = createAsyncThunk('quest/rollNew', async (userId: string) => {
  const response = await QuestService.getRandomQuest(userId);
  return response.data.data;
});

// Fetch current active quest
export const fetchCurrentQuest = createAsyncThunk('quest/fetchCurrent', async (userId: string) => {
  const response = await QuestService.getCurrentQuest(userId);
  return response.data.data;
});

// Fetch completed quests history
export const fetchCompletedQuests = createAsyncThunk(
  'quest/fetchCompleted',
  async (userId: string) => {
    const response = await QuestService.getCompletedQuests(userId);
    return response.data.data;
  },
);

interface CompleteQuestPayload {
  userId: string;
  images: File[];
  description: string;
}

export const completeQuest = createAsyncThunk(
  'quest/complete',
  async ({ userId, images, description }: CompleteQuestPayload) => {
    const response = await QuestService.completeQuest(userId, images, description);
    return response.data.data;
  },
);

const questSlice = createSlice({
  name: 'quest',
  initialState,
  reducers: {
    closeTaskPopup: (state) => {
      state.isTaskPopupOpen = false;
    },
    clearCurrentQuest: (state) => {
      state.currentQuest = null;
      state.isTaskPopupOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Roll new quest cases
      .addCase(rollNewQuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rollNewQuest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuest = action.payload;
        state.isTaskPopupOpen = true;
        state.error = null;
        toast.success('Новое задание получено!');
      })
      .addCase(rollNewQuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error('Не удалось получить задание');
      })
      // Fetch current quest cases
      .addCase(fetchCurrentQuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentQuest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuest = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentQuest.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось загрузить текущее задание';
      })
      // Fetch completed quests cases
      .addCase(fetchCompletedQuests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedQuests.fulfilled, (state, action) => {
        state.loading = false;
        state.completedQuests = action.payload;
        state.error = null;
      })
      .addCase(fetchCompletedQuests.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось загрузить историю заданий';
      })
      // Complete quest cases
      .addCase(completeQuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeQuest.fulfilled, (state) => {
        state.loading = false;
        state.currentQuest = null;
        state.isTaskPopupOpen = false;
        state.error = null;
        toast.success('Задание успешно выполнено!');
      })
      .addCase(completeQuest.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось отправить подтверждение';
        toast.error('Не удалось отправить подтверждение');
      });
  },
});

export const { closeTaskPopup, clearCurrentQuest } = questSlice.actions;
export default questSlice.reducer;
