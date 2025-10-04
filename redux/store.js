import {
  useSelector as useAppSelector,
  useDispatch as useAppDispatch,
} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import locationSlice from './location/locationSlice';
import bookingSlice from './booking/bookingSlice';
import notificationSlice from './notification/notificationSlice';
import transactionSlice from './transaction/transactionSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    location: locationSlice,
    booking: bookingSlice,
    transaction: transactionSlice,
    notification: notificationSlice,
  },
});

export const useDispatch = () => useAppDispatch();
export const useSelector = useAppSelector;
