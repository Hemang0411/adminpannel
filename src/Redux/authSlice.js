import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    username: null,
    password: null,
    isAuthenticated: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.password = action.payload.password;
      state.isAuthenticated = true;
      console.log("%c[Redux: Auth] Admin Session Active. Credentials Cached.", "color: #0a66c2; font-weight: bold;");
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      console.log("%c[Redux: Auth] Session Cleared. Redirecting to Login.", "color: #ef4444; font-weight: bold;");
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;