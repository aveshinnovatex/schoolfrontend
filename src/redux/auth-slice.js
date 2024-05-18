import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: false,
  token: "",
  // user: null,
  // userType: null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      // state.userType = action.payload.userType;
    },
    logout(state) {
      state.isAuthenticated = false;
      // localStorage.removeItem("token");
      // localStorage.clear();
      // state.user = null;
      // state.userType = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
