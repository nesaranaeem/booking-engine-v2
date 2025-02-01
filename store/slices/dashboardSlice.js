import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalBookings: 0,
    totalSpent: 0,
    lastBooking: null,
    upcomingBookings: 0
  },
  bookings: [],
  profile: null,
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setStats, setBookings, setProfile, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
