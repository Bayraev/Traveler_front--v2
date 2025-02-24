import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Friend, QuestCompletion } from '../../types';
import FriendService from '../services/friendService';
import { toast } from 'sonner';
import { API_URL_STATIC } from '../http/http';
import QuestService from '../services/questService';
import type { ApiError } from '../../types/utils';

interface FriendState {
  friends: Friend[];
  selectedUserQuests: QuestCompletion[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendState = {
  friends: [],
  selectedUserQuests: [],
  loading: false,
  error: null,
};

export const fetchFriends = createAsyncThunk(
  'friend/fetchFriends',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await FriendService.getFriends(userId);
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiError['error'];
      const errorMessage = apiError?.message || 'Не удалось загрузить список друзей';
      return rejectWithValue(errorMessage);
    }
  },
);

export const addFriend = createAsyncThunk(
  'friend/addFriend',
  async ({ userId, username }: { userId: string; username: string }, { rejectWithValue }) => {
    try {
      const response = await FriendService.addFriend(userId, username);
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiError['error'];
      const errorMessage = apiError?.message || 'Не удалось добавить друга';
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchUserQuests = createAsyncThunk(
  'friend/fetchUserQuests',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await QuestService.getCompletedQuests(userId);
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiError['error'];
      const errorMessage = apiError?.message || 'Не удалось загрузить достижения пользователя';
      return rejectWithValue(errorMessage);
    }
  },
);

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    clearSelectedUserQuests: (state) => {
      state.selectedUserQuests = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch friends cases
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload.data;
        toast.success(action.payload.message || 'Список друзей загружен');
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;
        toast.error(errorMessage);
      })
      // Add friend cases
      .addCase(addFriend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.loading = false;
        state.friends.push({
          ...action.payload.data,
          avatar: `${API_URL_STATIC}${action.payload.data.avatar}`,
        });
        toast.success(action.payload.message || 'Друг успешно добавлен');
      })
      .addCase(addFriend.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;
        toast.error(errorMessage);
      })
      // Fetch user quests cases
      .addCase(fetchUserQuests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserQuests.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUserQuests = action.payload.data;
        state.error = null;
      })
      .addCase(fetchUserQuests.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;
        toast.error(errorMessage);
      });
  },
});

export const { clearSelectedUserQuests } = friendSlice.actions;
export default friendSlice.reducer;
