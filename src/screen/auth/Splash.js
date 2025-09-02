// import React, {useEffect} from 'react';
// import Splash from 'react-native-splash-screen';
// import {View, StyleSheet, Image, Platform} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {checkLogin} from '../../redux/auth/authAction';
// import { useDispatch } from 'react-redux';

// export default function SplashScreen() {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     getLocationFromStorage();
//     dispatch(checkLogin())
//       .unwrap()
//       .finally(() => {
//         setTimeout(() => {
//           Splash.hide();
//         }, 1500);
//       });
//   }, [dispatch, navigation]);


//   return (
//     <View style={styles.container}>
//       <Image source={require('')} style={styles.image} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
// });
