import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  updateInstLocation,
} from './locationAction';

const initialState = {
  isLoading: false,
  userAddress: null,
  userLocation: null,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.userAddress = action.payload;
    },
    setLocation: (state, action) => {
      state.userLocation = action.payload;
    },
  },
  extraReducers: builder => {
    //updateInstLocation reducer
    builder.addCase(updateInstLocation.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateInstLocation.fulfilled, (state, action) => {
    //   state.user = action.payload?.user;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updateInstLocation.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});
export const {
  setAddress,
  userLocation
} = locationSlice.actions;
export default locationSlice.reducer;
