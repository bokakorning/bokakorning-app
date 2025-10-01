import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import Constants, { FONTS } from './src/Assets/Helpers/constant';
import { OneSignal } from 'react-native-onesignal';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { checkLogin } from './redux/auth/authAction';
import Spinner from './src/Assets/Component/Spinner';
import Splash from 'react-native-splash-screen';

const App = () => {
  const APP_ID = 'df0d1c60-c14f-4226-8ba1-927c55e75f3a';

  useEffect(() => {
    OneSignal.initialize(APP_ID);
    OneSignal.Notifications.requestPermission(true);
  }, [OneSignal]);

  // const checkLng = async () => {
  //     const x = await AsyncStorage.getItem('LANG');
  //     if (x != null) {
  //       i18n.changeLanguage(x);
  //     }
  //   };
  useEffect(()=>{
    store.dispatch(checkLogin()).unwrap()
      .finally(() => {
        setTimeout(() => {
          Splash.hide();
        }, 500);
      });
  },[])
  return (
    <Provider store={store}>
      <SafeAreaView
        edges={
          Platform.OS === 'ios'
            ? ['left', 'top', 'right']
            : ['bottom', 'left', 'right', 'top']
        }
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" backgroundColor={Constants.white} />
        <Spinner />
        <Navigation />
        <Toast />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
  },
});

export default App;
