import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User, Friend, QuestCompletion } from '../../types';
import FriendService from '../services/friendService';
import { toast } from 'sonner';
import { API_URL_STATIC } from '../http/http';
import QuestService from '../services/questService';

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

export const fetchFriends = createAsyncThunk('friend/fetchFriends', async (userId: string) => {
  const response = await FriendService.getFriends(userId);
  return response.data.data;
});

export const addFriend = createAsyncThunk(
  'friend/addFriend',
  async ({ userId, username }: { userId: string; username: string }) => {
    const response = await FriendService.addFriend(userId, username);
    return response.data.data;
  },
);

export const fetchUserQuests = createAsyncThunk(
  'friend/fetchUserQuests',
  async (userId: string) => {
    const response = await QuestService.getCompletedQuests(userId);
    return response.data.data;
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
        state.friends = action.payload.map((friend) => ({
          ...friend,
          avatar: `${API_URL_STATIC}${friend.avatar}`,
        }));
        state.error = null;
      })
      .addCase(fetchFriends.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось загрузить список друзей';
        toast.error('Не удалось загрузить список друзей');
      })
      // Add friend cases
      .addCase(addFriend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.loading = false;
        state.friends.push({
          ...action.payload,
          avatar: `${API_URL_STATIC}${action.payload.avatar}`,
        });
        toast.success('Друг успешно добавлен!');
      })
      .addCase(addFriend.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось добавить друга';
        toast.error('Не удалось добавить друга');
      })
      // Fetch user quests cases
      .addCase(fetchUserQuests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserQuests.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUserQuests = action.payload;

        state.error = null;
      })
      .addCase(fetchUserQuests.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось загрузить достижения пользователя';
        toast.error('Не удалось загрузить достижения пользователя');
      });
  },
});

export const { clearSelectedUserQuests } = friendSlice.actions;
export default friendSlice.reducer;
