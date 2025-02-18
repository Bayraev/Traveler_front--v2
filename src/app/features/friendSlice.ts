import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../../types';
import FriendService from '../services/friendService';
import { toast } from 'sonner';

interface FriendState {
  friends: User[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendState = {
  friends: [],
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

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch friends cases
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
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
        state.friends.push(action.payload);
        toast.success('Друг успешно добавлен!');
      })
      .addCase(addFriend.rejected, (state) => {
        state.loading = false;
        state.error = 'Не удалось добавить друга';
        toast.error('Не удалось добавить друга');
      });
  },
});

export default friendSlice.reducer;
