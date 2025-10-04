import {createSlice} from '@reduxjs/toolkit';
import {
  getTransaction,
} from './transactionAction';

const initialState = {
  isLoading: false,
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
  },
});

export default tranactionSlice.reducer;
