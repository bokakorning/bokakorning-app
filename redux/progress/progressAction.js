import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';

//For get Progress
export const getProgress = createAsyncThunk(
  'progress/getprogress',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get(`progress/getprogress?id=${params}`);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For get Progress
export const updateProgress = createAsyncThunk(
  'progress/updateprogress',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post(`progress/updateprogress`,params);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);


