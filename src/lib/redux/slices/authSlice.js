import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  email: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, email } = action.payload;
      state.token = token;
      state.email = email;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentEmail = (state) => state.auth.email;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
