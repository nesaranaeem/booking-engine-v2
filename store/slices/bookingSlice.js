import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookingData: null,
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingData: (state, action) => {
      state.bookingData = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearBooking: (state) => {
      state.bookingData = null;
      state.error = null;
    },
  },
});

export const { setBookingData, setLoading, setError, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
