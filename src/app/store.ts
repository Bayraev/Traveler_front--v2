import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

import userReducer from './features/userSlice';
import mapReducer from './features/mapSlice';
import questReducer from './features/questSlice';
import friendReducer from './features/friendSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'map'],
};

const rootReducer = combineReducers({
  user: userReducer,
  map: mapReducer,
  quest: questReducer,
  friend: friendReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
