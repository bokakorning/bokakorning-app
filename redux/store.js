import {
  useSelector as useAppSelector,
  useDispatch as useAppDispatch,
} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import locationSlice from './location/locationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    location: locationSlice,
  },
});

export const useDispatch = () => useAppDispatch();
export const useSelector = useAppSelector;
