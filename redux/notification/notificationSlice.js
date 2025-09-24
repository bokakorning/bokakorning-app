import {createSlice} from '@reduxjs/toolkit';
import {
  getNotification,
} from './notificationAction';

const initialState = {
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    //getnotifications reducer
    builder.addCase(getNotification.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getNotification.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getNotification.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default notificationSlice.reducer;
