import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import styles from './styles';
import { navigate, reset } from '../../../utils/navigationRef';
import { Post } from '../../Assets/Helpers/Service';
import { LoadContext, ToastContext, UserContext } from '../../../App';
import Constants from '../../Assets/Helpers/constant';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LinearGradient from 'react-native-linear-gradient';

const ForgotPassword = () => {
  const [showPass, setShowPass] = useState(true);
  const [showConfPass, setShowConfPass] = useState(true);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [token, setToken] = useState('');
  const [step, setStep] = useState(0)
  const validationEmailSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  });
  const validationOtpSchema = Yup.object().shape({
    otp: Yup.number().required('Otp is required'),
  });
  const validationPasswordSchema = Yup.object().shape({
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    conformpassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const formikEmail = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationEmailSchema,
    onSubmit: (values, assets) => {
      sendOtp(values, assets)
    },
  });

  const formikOtp = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: validationOtpSchema,
    onSubmit: (values, assets) => {
      verifyOtp(values, assets)
    },
  });

  const formikPassword = useFormik({
    initialValues: {
      conformpassword: '',
      password: '',
    },
    validationSchema: validationPasswordSchema,
    onSubmit: (values, assets) => {
      changePassword(values, assets)
    },
  });

  const sendOtp = async (value, { resetForm }) => {
    setLoading(true);
    Post('auth/sendOTPForforgetpass', value, {}).then(
      async res => {
        setLoading(false);
        console.log('userdetilllllll', res);
        if (res.status) {
          resetForm()
          setToken(res.data.token)
          setLoading(false);
          setStep(1)
          setToast(res.data.message)
        } else {
          setLoading(false);
        }
      },
      err => {
        setLoading(false);
      },
    );
  };
  const verifyOtp = async (value, { resetForm }) => {
    console.log(value)
    setLoading(true);
    const data = {
      otp: value.otp,
      token
    }
    console.log(data)
    Post('auth/verifyOTP', data, {}).then(
      async res => {
        setLoading(false);
        console.log('userdetilllllll', res);
        if (res.status) {
          resetForm()
          setToken(res.data.token)
          setLoading(false);
          setStep(2)
          setToast(res.data.message)
        } else {
          setLoading(false);
        }
      },
      err => {
        setLoading(false);
      },
    );
  };
  const changePassword = async (value, { resetForm }) => {
    setLoading(true);
    Post('auth/changePassword', { ...value, token }, {}).then(
      async res => {
        setLoading(false);
        console.log('userdetilllllll', res);
        if (res.status) {
          resetForm()
          setLoading(false);
          setStep(0)
          setToken('')
          setToast(res.data.message)
          navigate('SignIn');
        } else {
          setLoading(false);
        }
      },
      err => {
        setLoading(false);
      },
    );
  };

  return (
   <LinearGradient
                     start={{x: 0, y: 0}}
                     end={{x: 0, y: 1}}
                     colors={['#4EB0CF', '#FFFFFF', '#FFFFFF', '#4EB0CF']}
                     locations={[0, 0.3, 0.7, 1]} 
                     style={styles.container}>
         <ScrollView showsVerticalScrollIndicator={false}>
         <View style={styles.buttompart} >
           <Image source={step===0?require("../../Assets/Images/que-img.png"):step===1?require("../../Assets/Images/otp-img.png"):require("../../Assets/Images/edit-img.png")} style={styles.proimg}/>
           <Text style={styles.headtxt}>{step===0?"Forgot Password?":step===1?"Verify Your Number":"Change Password"}</Text>
           <Text style={styles.forgtxt}>{step===0?"Enter your registered e-mail ID to receive the OTP to change your password.":step===1?"Enter the one-time password received on your number":"Your password must be at least 8 characters long and include one uppercase letter and one number."}</Text>
           {step === 0 &&<View>
           <View style={styles.inpcov}>
             <TextInput
               style={styles.inputfield}
               placeholder="Enter Email"
               textAlign='left'
               placeholderTextColor={Constants.customgrey2}
               value={formikEmail.values.email}
              onChangeText={formikEmail.handleChange('email')}
              onBlur={formikEmail.handleBlur('email')}
             />
           </View>
           {formikEmail.touched.email && formikEmail.errors.email &&
             <Text style={styles.require}>{formikEmail.errors.email}</Text>
           }
           </View>}
           {step === 1 &&<View>
           <View style={styles.inpcov}>
             <TextInput
               style={styles.inputfield}
               placeholder="Enter OTP"
              placeholderTextColor={Constants.customgrey2}
              value={formikOtp.values.otp}
              onChangeText={formikOtp.handleChange('otp')}
              onBlur={formikOtp.handleBlur('otp')}
             />
           </View>
           {formikOtp.touched.email && formikOtp.errors.email &&
             <Text style={styles.require}>{formikOtp.errors.email}</Text>
           }
           </View>}
          {step === 2 && <View>
           <View style={styles.inpcov}>
             <TextInput
               style={styles.inputfield}
               placeholder="Enter Password"
               secureTextEntry={showPass}
               placeholderTextColor={Constants.customgrey2}
               value={formikPassword.values.password}
              onChangeText={formikPassword.handleChange('password')}
              onBlur={formikPassword.handleBlur('password')}
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
           {formikPassword.touched.password && formikPassword.errors.password &&
             <Text style={styles.require}>{formikPassword.errors.password}</Text>
           }
           <View style={styles.inpcov}>
             <TextInput
               style={styles.inputfield}
               placeholder="Enter Confirm Password"
               secureTextEntry={showPass}
               placeholderTextColor={Constants.customgrey2}
               value={formikPassword.values.conformpassword}
              onChangeText={formikPassword.handleChange('conformpassword')}
              onBlur={formikPassword.handleBlur('conformpassword')}
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
           {formikPassword.touched.password && formikPassword.errors.password &&
             <Text style={styles.require}>{formikPassword.errors.password}</Text>
           }
   </View>}
               {step === 0 &&<TouchableOpacity style={styles.btncov} onPress={formikEmail.handleSubmit}>
                 <Text style={styles.btntxt}>Send OTP</Text>
               </TouchableOpacity>}
               {step === 1 &&<TouchableOpacity style={styles.btncov} onPress={formikOtp.handleSubmit}>
                 <Text style={styles.btntxt}>Verify OTP</Text>
               </TouchableOpacity>}
               {step === 2 &&<TouchableOpacity style={styles.btncov} onPress={formikPassword.handleSubmit}>
                 <Text style={styles.btntxt}>Submit</Text>
               </TouchableOpacity>}

               </View>
         </ScrollView>
         </LinearGradient>
  );
};

export default ForgotPassword;
