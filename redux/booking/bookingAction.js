import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';

//For create Booking
export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post('booking/createBooking', params);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
//For get Instructer Request
export const getInstructerReqs = createAsyncThunk(
  'booking/getinstructerreqs',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get('booking/getinstructerreqs', params);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For get Accepted Instructer Request
export const getAccepInstructerReqs = createAsyncThunk(
  'booking/getaccinstructerreqs',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get('booking/getaccinstructerreqs', params);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For update Instructer Request
export const updateInstructerReqs = createAsyncThunk(
  'booking/updatebookingstatus',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.put('booking/updatebookingstatus', params);
      showToaster('success',data.message);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
//For finish Session
export const finishSession = createAsyncThunk(
  'booking/finishbooking',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.put('booking/finishbooking', params);
      showToaster('success',data.message);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For get User Bookings
export const getUserBookings = createAsyncThunk(
  'booking/getuserbookings',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get(`booking/getuserbookings?status=${params}`);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For get User ReBooking
export const reBookings = createAsyncThunk(
  'booking/reBooking',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post(`booking/reBooking`,params);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);


