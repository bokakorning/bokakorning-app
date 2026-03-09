import {createSlice} from '@reduxjs/toolkit';
import {
  getRatePerHour,
  getTransaction,
} from './transactionAction';

const initialState = {
  isLoading: false,
  rateData: null,
  error: null,
};

const tranactionSlice = createSlice({
  name: 'tranaction',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    //gettranactions reducer
    builder.addCase(getTransaction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTransaction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getTransaction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //getRatePerHour reducer
    builder.addCase(getRatePerHour.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getRatePerHour.fulfilled, (state, action) => {
      state.isLoading = false;
      state.rateData=action?.payload
      state.error = null;
    });
    builder.addCase(getRatePerHour.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default tranactionSlice.reducer;
