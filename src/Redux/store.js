import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import employerReducer from './employerSlice';
import jobReducer from './jobSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employers: employerReducer,
    jobs : jobReducer
  }
});