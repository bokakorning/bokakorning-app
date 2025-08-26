import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import React, {  useContext, useEffect, useState } from 'react';
import styles from './styles';
import { navigate, reset } from '../../../utils/navigationRef';
import { Post } from '../../Assets/Helpers/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { LoadContext, ToastContext, UserContext } from '../../../App';
import Constants from '../../Assets/Helpers/constant';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { OneSignal } from 'react-native-onesignal';
import { hp } from '../../../utils/responsiveScreen';
import LinearGradient from 'react-native-linear-gradient';

const SignIn = () => {
  const [showPass, setShowPass] = useState(true);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [user, setUser] = useContext(UserContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, assets) => {
      submit(values, assets)
    },
  });

  const submit = async (value, { resetForm }) => {
    setLoading(true);
    const player_id = await OneSignal.User.pushSubscription.getIdAsync()
    const device_token = await OneSignal.User.pushSubscription.getTokenAsync()

      value.player_id= player_id
      value.device_token =device_token,
      
    Post('auth/login', value, {}).then(
      async res => {
        setLoading(false);
        console.log('userdetilllllll', res);
        if (res.status) {
          resetForm()
          setToast('Signin successfully')
          setLoading(false);
          await AsyncStorage.setItem('userDetail', JSON.stringify({ ...res.data.user, token: res.data.token }));
          setUser({ ...res.data.user, token: res.data.token })
          reset('TabNav')
        } else {
          setLoading(false);
        }
      },
      err => {
        setLoading(false);
      },
    );
  };
const InAppBrowserFunc = async (props) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(
          props,
          {
            // Customization options
            dismissButtonStyle: 'cancel',
            preferredBarTintColor: Constants.normal_green,
            preferredControlTintColor: 'white',
            readerMode: false,
            animated: true,
            modalPresentationStyle: 'fullScreen',
            modalTransitionStyle: 'coverVertical',
            enableBarCollapsing: false,
          },
        );
      } else {
        Linking.openURL(props);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    // <View style={styles.container}>
      <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  colors={['#4EB0CF', '#FFFFFF', '#FFFFFF', '#4EB0CF']}
                  locations={[0, 0.3, 0.7, 1]} 
                  style={styles.container}>
      {/* <View > */}
      <View style={styles.buttompart} >
        <Image source={require('../../Assets/Images/pro-img.png')} style={styles.proimg}/>
        <Text style={styles.headtxt} onPress={()=>navigate("App")}>Log In</Text>
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Enter Email"
            textAlign='left'
            placeholderTextColor={Constants.customgrey2}
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
          />
        </View>
        {formik.touched.email && formik.errors.email &&
          <Text style={styles.require}>{formik.errors.email}</Text>
        }
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Enter Password"
            secureTextEntry={showPass}
            placeholderTextColor={Constants.customgrey2}
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
          />

          <TouchableOpacity
            onPress={() => {
              setShowPass(!showPass);
            }}
            style={[styles.iconView, { borderRightWidth: 0 }]}>
            <Image
              source={
                showPass
                  ? require('../../Assets/Images/eye-1.png')
                  : require('../../Assets/Images/eye.png')
              }
              style={{ height: 28, width: 28 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        {formik.touched.password && formik.errors.password &&
          <Text style={styles.require}>{formik.errors.password}</Text>
        }

            <TouchableOpacity style={styles.btncov} onPress={formik.handleSubmit}>
              <Text style={styles.btntxt}>Log In</Text>
            </TouchableOpacity>
        <Text style={styles.forgtxt} onPress={() => navigate('ForgotPassword')}>
          Forgot Password ?
        </Text>
            </View>
            <Text style={styles.textcov} onPress={()=>navigate('SignUp')}>
              <Text style={[styles.lasttxt,{color:Constants.white}]}>Don’t have an account ? </Text>
              <Text style={[styles.lasttxt,{color:Constants.black,textDecorationLine:'underline'}]}>Sign Up</Text>
            </Text>
      {/* </View> */}
      </LinearGradient>
    // </View>
  );
};

export default SignIn;
