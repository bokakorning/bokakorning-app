import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';
import {navigate} from '../../utils/navigationRef';

//For update Instructer Location
export const updateInstLocation = createAsyncThunk(
  'location/updateInstLocation',
  async (params, thunkAPI) => {
    try {
      const res = await axios.post('auth/updateInstLocation', params);
      return res;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);


