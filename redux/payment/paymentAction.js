import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';

//For post Stripe
export const postStripe = createAsyncThunk(
  'stripe/poststripe',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post(`stripe/poststripe`,params);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
)

//For create Booking
export const createBooking = createAsyncThunk(
  'stripe/createBooking',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post(`stripe/createBooking`,params);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
)


