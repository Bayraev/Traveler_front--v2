import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User, UserDTO } from '../../types';
import type { ApiError } from '../../types/utils';
import AuthService from '../services/authService';
import { toast } from 'sonner';

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

export const signIn = createAsyncThunk(
  'user/signIn',
  async (credentials: UserDTO, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials.username, credentials.password);
      return response.data.user;
    } catch (error: any) {
      const apiError = error.response?.data as ApiError;
      const errorMessage = apiError?.error?.message || 'Не удалось войти в аккаунт';
      return rejectWithValue(errorMessage);
    }
  },
);

export const signUp = createAsyncThunk(
  'user/signUp',
  async (credentials: UserDTO, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(credentials.username, credentials.password);
      return response.data.user;
    } catch (error: any) {
      const apiError = error.response?.data as ApiError;
      const errorMessage = apiError?.error?.message || 'Не удалось зарегистрироваться';
      return rejectWithValue(errorMessage);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      toast.success('Вы вышли из аккаунта');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        toast.success('Успешно вошли в аккаунт!');

        console.log(action.payload);
        state.currentUser = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Не удалось войти в аккаунт';

        toast.error((action.payload as string) || 'Не удалось войти в аккаунт');
      });

    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    });

    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Не удалось зарегистрироваться';

      toast.error((action.payload as string) || 'Не удалось зарегистрироваться');
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
