import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';

//For get Transactions
export const getTransaction = createAsyncThunk(
  'transaction/gettransaction',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get(`transaction/getTransaction?page=${params}`);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);


