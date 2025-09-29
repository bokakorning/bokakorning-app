import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  updateInstLocation,
  getNearbyocation
} from './locationAction';

const initialState = {
  isLoading: false,
  userAddress: null,
  userLocation: null,
  userEnteredAddress: null,
  userEnteredLocation: null,
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
    setEnteredAddress: (state, action) => {
      state.userEnteredAddress = action.payload;
    },
    setEnteredLocation: (state, action) => {
      state.userEnteredLocation = action.payload;
    },
    setInvoiceLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: builder => {
    //updateInstLocation reducer
    builder.addCase(updateInstLocation.pending, (state) => {
      // state.isLoading = true;
    });
    builder.addCase(updateInstLocation.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updateInstLocation.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    //getNearbyocation reducer
    builder.addCase(getNearbyocation.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getNearbyocation.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getNearbyocation.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});
export const {
  setAddress,
  setLocation,
  setEnteredAddress,
  setEnteredLocation,
  setInvoiceLoading,
} = locationSlice.actions;
export default locationSlice.reducer;
