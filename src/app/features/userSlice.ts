import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User, UserDTO } from '../../types';
import type { ApiError } from '../../types/utils';
import AuthService from '../services/authService';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { API_URL_STATIC } from '../http/http';

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
      // Return the user data directly from response.data
      return response.data.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiError;
      const errorMessage = apiError?.error?.message || 'Не удалось войти в аккаунт';
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
      const apiError = error.response?.data as ApiError;
      const errorMessage = apiError?.error?.message || 'Не удалось зарегистрироваться';
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
      const apiError = error.response?.data as ApiError;
      const errorMessage = apiError?.error?.message || 'Не удалось обновить аватар';
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

      // Remove user data from cookies
      Cookies.remove('username');
      Cookies.remove('password');
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

        // Save user data to cookies
        Cookies.set('username', JSON.stringify(action.payload), { expires: 7 }); // 7 days expiry
        Cookies.set('password', JSON.stringify(action.payload), { expires: 7 }); // 7 days expiry

        const usernameCookie = Cookies.get('username');

        // add user to state
        state.currentUser = action.payload;
        state.currentUser.avatar = `${API_URL_STATIC}${action.payload.avatar}`;

        console.log(usernameCookie, state.currentUser, action.payload);
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

    builder.addCase(updateAvatar.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateAvatar.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;

      const avatar = `${API_URL_STATIC}${action.payload.avatar}`;
      console.log(avatar);
      state.currentUser.avatar = avatar;
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
