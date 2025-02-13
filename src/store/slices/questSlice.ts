import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Quest } from '../../types';
import mockData from '../../mocks/data.json';

interface QuestState {
  currentQuest: Quest | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuestState = {
  currentQuest: null,
  loading: false,
  error: null
};

export const rollNewQuest = createAsyncThunk(
  'quest/rollNew',
  async () => {
    // Simulating API call with mock data
    const randomIndex = Math.floor(Math.random() * mockData.quests.length);
    return mockData.quests[randomIndex];
  }
);

const questSlice = createSlice({
  name: 'quest',
  initialState,
  reducers: {
    clearCurrentQuest: (state) => {
      state.currentQuest = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(rollNewQuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rollNewQuest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuest = action.payload;
      })
      .addCase(rollNewQuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to roll new quest';
      });
  }
});

export const { clearCurrentQuest } = questSlice.actions;
export default questSlice.reducer;