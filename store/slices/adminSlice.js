import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  activities: [],
  settings: {},
  loading: false,
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setActivities: (state, action) => {
      state.activities = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setUsers, setActivities, setSettings, setLoading, setError } = adminSlice.actions;
export default adminSlice.reducer;
