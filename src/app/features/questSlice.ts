import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Quest, QuestCompletion } from '../../types';
import QuestService from '../services/questService';
import { toast } from 'sonner';
import type { ApiError } from '../../types/utils';

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
export const rollNewQuest = createAsyncThunk(
  'quest/rollNew',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await QuestService.getRandomQuest(userId);
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiError['error'];
      const errorMessage = apiError?.message || 'Не удалось получить задание';
      return rejectWithValue(errorMessage);
    }
  },
);

// Fetch current active quest
export const fetchCurrentQuest = createAsyncThunk(
  'quest/fetchCurrent',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await QuestService.getCurrentQuest(userId);
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiError['error'];
      const errorMessage = apiError?.message || 'Не удалось загрузить текущее задание';
      return rejectWithValue(errorMessage);
    }
  },
);

// Fetch completed quests history
export const fetchCompletedQuests = createAsyncThunk(
  'quest/fetchCompleted',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await QuestService.getCompletedQuests(userId);
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiError['error'];
      const errorMessage = apiError?.message || 'Не удалось загрузить историю заданий';
      return rejectWithValue(errorMessage);
    }
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
        state.currentQuest = action.payload.data;
        state.isTaskPopupOpen = true;
        state.error = null;
        toast.success(action.payload.message || 'Новое задание получено');
      })
      .addCase(rollNewQuest.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;
        toast.error(errorMessage);
      })
      // Fetch current quest cases
      .addCase(fetchCurrentQuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentQuest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuest = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCurrentQuest.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;
        toast.error(errorMessage);
      })
      // Fetch completed quests cases
      .addCase(fetchCompletedQuests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedQuests.fulfilled, (state, action) => {
        state.loading = false;
        state.completedQuests = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCompletedQuests.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;
        toast.error(errorMessage);
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
