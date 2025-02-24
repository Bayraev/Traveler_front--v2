import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User, UserDTO } from '../../types';
import type { ApiError } from '../../types/utils';
import AuthService from '../services/authService';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

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

interface SignUpPayload extends UserDTO {
  avatar: File;
}

export const signIn = createAsyncThunk(
  'user/signIn',
  async (credentials: UserDTO, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials.username, credentials.password);
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiError['error'];
      const errorMessage = apiError?.message || 'Не удалось войти в систему';
      return rejectWithValue(errorMessage);
    }
  },
);

export const signUp = createAsyncThunk(
  'user/signUp',
  async ({ username, password, avatar }: SignUpPayload, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(username, password, avatar);
      return response.data.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiError['error'];
      const errorMessage = apiError?.message || 'Не удалось зарегистрироваться';
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateAvatar = createAsyncThunk(
  'user/updateAvatar',
  async ({ userId, avatar }: { userId: string; avatar: File }, { rejectWithValue }) => {
    try {
      const response = await AuthService.updateAvatar(userId, avatar);
      return response.data.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiError['error'];
      const errorMessage = apiError?.message || 'Не удалось обновить аватар';
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
      Cookies.remove('username');
      Cookies.remove('password');
      toast.success('Вы успешно вышли из системы');
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
        state.currentUser = action.payload.data;
        state.error = null;

        // Save user data to cookies
        Cookies.set('username', JSON.stringify(action.payload.data), { expires: 7 });
        Cookies.set('password', JSON.stringify(action.payload.data), { expires: 7 });

        toast.success(action.payload.message || 'Успешный вход в систему');
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;
        toast.error(errorMessage);
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

    builder.addCase(updateAvatar.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateAvatar.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      toast.success('Аватар успешно обновлен');
    });

    builder.addCase(updateAvatar.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
