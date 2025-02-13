import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../../types';
import mockData from '../../mocks/data.json';

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk('user/fetchCurrentUser', async () => {
  // Simulating API call with mock data
  return mockData.users[0];
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
