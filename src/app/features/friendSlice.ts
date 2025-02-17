import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../../types';
import mockData from '../../mocks/data.json';

interface FriendState {
  friends: User[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendState = {
  friends: [],
  loading: false,
  error: null
};

export const fetchFriends = createAsyncThunk(
  'friend/fetchFriends',
  async (userId: string) => {
    // Simulating API call with mock data
    const friends = mockData.users.filter(user => 
      user._id !== userId && mockData.users[0].friends.includes(user._id)
    );
    return friends;
  }
);

export const addFriend = createAsyncThunk(
  'friend/addFriend',
  async (username: string) => {
    // Simulating API call with mock data
    const friend = mockData.users.find(user => user.username === username);
    if (!friend) throw new Error('User not found');
    return friend;
  }
);

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch friends';
      })
      .addCase(addFriend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.loading = false;
        state.friends.push(action.payload);
      })
      .addCase(addFriend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add friend';
      });
  }
});

export default friendSlice.reducer;