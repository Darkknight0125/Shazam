import { configureStore } from '@reduxjs/toolkit';
import { tmdbApi } from './services/tmdbApi';
import { authApi } from './services/authApi';
import { commentsApi } from './services/commentsApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbApi.middleware, authApi.middleware, commentsApi.middleware),
});