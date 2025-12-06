import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import React, {  useContext, useEffect, useState } from 'react';
import styles from './styles';
import { navigate, reset } from '../../../utils/navigationRef';
import Constants from '../../Assets/Helpers/constant';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { OneSignal } from 'react-native-onesignal';
import { hp, wp } from '../../../utils/responsiveScreen';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/auth/authAction';
import { useTranslation } from 'react-i18next';

const SignIn = () => {
  const { t } = useTranslation();
  const [showPass, setShowPass] = useState(true);
const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('Invalid email')).required(t('Email is required')),
    password: Yup.string().min(8, t('Password must be at least 8 characters')).required(t('Password is required')),
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
  console.log('enter')
  const player_id = await OneSignal.User.pushSubscription.getIdAsync()
    const device_token = await OneSignal.User.pushSubscription.getTokenAsync()

      value.player_id= player_id
      value.device_token =device_token,

    dispatch(login(value))
      .unwrap()
      .then(data => {
        console.log('data', data);
        resetForm();
      })
      .catch(error => {
        console.error('Signin failed:', error);
      });
  };
  return (
    // <View style={styles.container}>
      <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  colors={['#4EB0CF', '#FFFFFF', '#FFFFFF', '#4EB0CF']}
                  locations={[0, 0.3, 0.7, 1]} 
                  style={[styles.container,{padding: Platform.OS==='ios'?0: wp(4)}]}>
      {/* <View > */}
      <View style={styles.buttompart} >
        <Image source={require('../../Assets/Images/pro-img.png')} style={styles.proimg}/>
        <Text style={styles.headtxt} onPress={()=>navigate("App")}>{t("Login")}</Text>
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder={t("Enter Email")}
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
            placeholder={t("Enter Password")}
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
              <Text style={styles.btntxt}>{t("Login")}</Text>
            </TouchableOpacity>
        <Text style={styles.forgtxt} onPress={() => navigate('ForgotPassword')}>
          {t("Forgot Password ?")}
        </Text>
            </View>
            <Text style={styles.textcov} onPress={()=>navigate('SignUp')}>
              <Text style={[styles.lasttxt,{color:Constants.white}]}>{t("Don’t have an account ?")} </Text>
              <Text style={[styles.lasttxt,{color:Constants.black,textDecorationLine:'underline'}]}>{t("Sign Up")}</Text>
            </Text>
      {/* </View> */}
      </LinearGradient>
    // </View>
  );
};

export default SignIn;
