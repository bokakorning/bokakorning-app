import {createAsyncThunk} from '@reduxjs/toolkit';
import {deleteAuthToken, getAuthToken, setAuthToken} from '../../utils/storage';
import {showToaster} from '../../utils/toaster';
import axios, { setApiToken} from '../../utils/axios';
import {navigate, reset} from '../../utils/navigationRef';

// For Check user login or not
export const checkLogin = createAsyncThunk(
  'auth/checkLogin',
  async (_, thunkAPI) => {
    try {
      const token = await getAuthToken();
      console.log("token",token)
      if (!token) {
        await deleteAuthToken();
        reset('Auth');
        return null;
      }
      setApiToken(token);
      const {data} = await axios.get('auth/profile');
      if (data) {
        if (data?.type==='instructer') {
            if (data?.status==='Approved') {
              reset('InstructerApp');
            } else {
              navigate('Form')
            }
          } else {
            reset('App');
          }
        return data;
      } else {
        await deleteAuthToken();
        reset('Auth');
        return null;
      }
    } catch (error) {
      await deleteAuthToken();
      reset('Auth');
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For login user
export const login = createAsyncThunk(
  'auth/login',
  async (params, thunkAPI) => {
    try {
      const res = await axios.post('auth/login', params);
      showToaster('success',res?.data?.message);
      if (res?.data) {
          setApiToken(res?.data.token);
          console.log('logintoken',res?.data.token)
          await setAuthToken(res?.data.token);
          if (res?.data?.user?.type==='instructer') {
            if (res?.data?.user?.status==='Approved') {
              reset('InstructerApp');
            } else {
              navigate('Form')
            }
          } else {
            reset('App');
          }
      }
      return res?.data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For signup user
export const signup = createAsyncThunk(
  'auth/signup',
  async (params, thunkAPI) => {
    try {
      const res= await axios.post('auth/register',params,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToaster('success',res?.data?.message);
      return res?.data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For sendOtp
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post('auth/sendOTPForforgetpass', params);
      showToaster('success',data?.message);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For verify Otp
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post('auth/verifyOtp', params);
      showToaster('success',data?.message);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For set new password
export const resetPassword = createAsyncThunk(
  'auth/changePassword',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post(
        'auth/changePassword',
        params,
      );
      if (data) {
        navigate('SignIn');
      }
      showToaster('success',data?.message);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
//For getprofile
export const getProfile = createAsyncThunk(
  'auth/getprofile',
  async (params, thunkAPI) => {
    try {
      const {data}= await axios.get('auth/profile',params,);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },)
//For updateprofile
export const updateProfile = createAsyncThunk(
  'auth/updateprofile',
  async (params, thunkAPI) => {
    try {
      const {data}= await axios.post('auth/updateprofile',params,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToaster('success',data?.message);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

