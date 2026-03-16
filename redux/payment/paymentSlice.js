import {createSlice} from '@reduxjs/toolkit';
import { createBooking, postStripe } from './paymentAction';

const initialState = {
  isLoading: false,
  rateData: null,
  error: null,
};

const tranactionSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    //postStripe reducer
    builder.addCase(postStripe.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(postStripe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(postStripe.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

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

  },
});

export default tranactionSlice.reducer;
