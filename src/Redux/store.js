import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import employerReducer from './employerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employers: employerReducer // This key 'employers' is used in useSelector
  }
});