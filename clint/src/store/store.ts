import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/auth';
import quizReducers from './slices/quiz/quiz';
import userReducers from './slices/user/user';
import { apiSlice } from './ApiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducers,
    user: userReducers,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
