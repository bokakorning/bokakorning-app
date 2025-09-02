// import {
//   useSelector as useAppSelector,
//   useDispatch as useAppDispatch,
// } from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

// export const useDispatch = () => useAppDispatch();
// export const useSelector = useAppSelector;
