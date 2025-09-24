import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';

//For get Notifications
export const getNotification = createAsyncThunk(
  'notification/getnotification',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get(`notification/getnotification?page=${params}`);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);


