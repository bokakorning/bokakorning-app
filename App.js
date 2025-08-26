import React, { useEffect, useState, } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from './src/navigation';
import Constants, { FONTS } from './src/Assets/Helpers/constant';
import { OneSignal } from 'react-native-onesignal';
import Spinner from './src/Assets/Component/Spinner';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';


export const Context = React.createContext('');
export const ToastContext = React.createContext('');
export const UserContext = React.createContext();
export const LoadContext = React.createContext('');

const App = () => {
  const [initial, setInitial] = useState('');
  const [toast, setToast] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

   const APP_ID = '';
  useEffect(() => {
    OneSignal.initialize(APP_ID);
    OneSignal.Notifications.requestPermission(true);
  }, [OneSignal]);

  useEffect(() => {
    // setInitialRoute();
  }, []);

  const setInitialRoute = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const userDetail = JSON.parse(user);

    console.log('userDetail', userDetail);
    console.log('userDetailid', userDetail?._id);
    if (userDetail?.email) {
      setInitial('TabNav');
      // setInitial('Auth');
      setUser(userDetail);
    } else {
      setInitial('Auth');
    }
  };
// const checkLng = async () => {
//     const x = await AsyncStorage.getItem('LANG');
//     if (x != null) {
//       i18n.changeLanguage(x);
//     }
//   };
  useEffect(() => {
    if (toast) {
      Toast.show({
        type: 'success',
        text1: toast,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        onHide: () => {
          setToast('');
        },
      });
    }
  }, [toast]);
  return (
    <Context.Provider value={[initial, setInitial]}>
      <ToastContext.Provider value={[toast, setToast]}>
        <LoadContext.Provider value={[loading, setLoading]}>
          <UserContext.Provider value={[user, setUser]}>
            <SafeAreaView edges={Platform.OS==='ios'?['left','top','right']:['bottom','left','right','top']} style={styles.container}>
              <Spinner color={'#fff'} visible={loading} />
              <StatusBar barStyle="dark-content" backgroundColor={Constants.white} />
              {/* {initial !== '' && <Navigation initial={initial} />} */}
              <Navigation />
              <Toast />
            </SafeAreaView>
          </UserContext.Provider>
        </LoadContext.Provider>
      </ToastContext.Provider>
    </Context.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Constants.violet
  },
});

export default App;
