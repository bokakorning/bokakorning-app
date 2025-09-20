import {createSlice} from '@reduxjs/toolkit';
import {
  createBooking,
  getInstructerReqs,
  updateInstructerReqs,
  getUserBookings
} from './bookingAction';

const initialState = {
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    //createBooking reducer
    builder.addCase(createBooking.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createBooking.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(createBooking.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    //getinstructerreqs reducer
    builder.addCase(getInstructerReqs.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getInstructerReqs.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getInstructerReqs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    //updateInstructerReqs reducer
    builder.addCase(updateInstructerReqs.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateInstructerReqs.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updateInstructerReqs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    //getUserBookings reducer
    builder.addCase(getUserBookings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserBookings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getUserBookings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default bookingSlice.reducer;
