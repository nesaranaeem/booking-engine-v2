import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './slices/bookingSlice';
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    user: userReducer,
    admin: adminReducer,
    dashboard: dashboardReducer,
  },
});
