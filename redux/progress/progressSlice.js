import {createSlice} from '@reduxjs/toolkit';
import { getProgress, updateProgress } from './progressAction';


const initialState = {
  isLoading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    //getprogresss reducer
    builder.addCase(getProgress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProgress.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getProgress.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //updateprogresss reducer
    builder.addCase(updateProgress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProgress.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updateProgress.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default progressSlice.reducer;
