import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  Animated,
} from 'react-native';
import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import styles from './styles';
import { Post } from '../../Assets/Helpers/Service';
import { LoadContext, ToastContext, UserContext } from '../../../App';
import Constants from '../../Assets/Helpers/constant';
import * as Yup from 'yup';
import { Formik } from 'formik';
import LinearGradient from 'react-native-linear-gradient';
import { navigate } from '../../../utils/navigationRef';
import { hp } from '../../../utils/responsiveScreen';
import{DeleteIcon, DropdownIcon, ViewIcon} from '../../../Theme';
import {CameraGalleryPeacker} from '../../Assets/Component/CameraGalleryPeacker'

const SignUp = () => {
  const [showPass, setShowPass] = useState(true);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [document, setDocument] = useState();
  const [registerModel, setRegisterModel] = useState({
    email: '',
    password: "",
    name: "",
    phone: "",
  })
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('Phone is required'),
  });


  const submit = async (value, { resetForm }) => {
    setLoading(true);
    Post('auth/register', value, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          resetForm()
          setLoading(false);
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
 const cameraRef = createRef();

  const getImageValue = async img => {
    ApiFormData(img.assets[0]).then(
      res => {
        console.log(res);

        if (res.status) {
          setDocument(res?.data?.file)
        }
      },
      err => {
        console.log(err);
      },
    );
  };
  const cancel = () => {};
  const [tabopt, settabopt] = useState(0);
  const toggleAnim = useRef(new Animated.Value(tabopt)).current;
useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: tabopt,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [tabopt]);

  const translateX = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  return (
<LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  colors={['#4EB0CF', '#FFFFFF', '#FFFFFF', '#4EB0CF']}
                  locations={[0, 0.3, 0.7, 1]} 
                  style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={registerModel}
          validationSchema={validationSchema}
          onSubmit={submit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
      <View style={styles.buttompart} >
        <Image source={require('../../Assets/Images/pro-img.png')} style={[styles.proimg,{marginTop:hp(6)}]}/>
        <Text style={[styles.headtxt,{marginVertical:0}]}>Sign Up</Text>
        <View style={styles.btnCov}>
          {/* Animated sliding background */}
          <Animated.View style={[styles.slider, {transform: [{translateX}]}]} />

          <TouchableOpacity
            style={styles.cencelBtn}
            onPress={() => settabopt(0)}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.btntxt,
                tabopt === 0 ? styles.activeText : styles.inactiveText,
              ]}>
              Student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cencelBtn2}
            onPress={() => settabopt(1)}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.btntxt,
                tabopt === 1 ? styles.activeText : styles.inactiveText,
              ]}>
              Instructer
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Full Name"
            textAlign='left'
            placeholderTextColor={Constants.customgrey2}
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
          />
        </View>
        {touched.email && errors.email &&
          <Text style={styles.require}>{errors.email}</Text>
        }
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Phone Number"
            textAlign='left'
            placeholderTextColor={Constants.customgrey2}
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
          />
        </View>
        {touched.email && errors.email &&
          <Text style={styles.require}>{errors.email}</Text>
        }
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Enter Email"
            textAlign='left'
            placeholderTextColor={Constants.customgrey2}
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
          />
        </View>
        {touched.email && errors.email &&
          <Text style={styles.require}>{errors.email}</Text>
        }
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Enter Password"
            secureTextEntry={showPass}
            placeholderTextColor={Constants.customgrey2}
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
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
        {touched.password && errors.password &&
          <Text style={styles.require}>{errors.password}</Text>
        }
        {tabopt===0&&<TouchableOpacity style={styles.uploadcov}>
          <Text style={styles.upltxt}>Attach Your Driving Permit</Text>
          <DropdownIcon />
        </TouchableOpacity>}
        {tabopt===0&&<TouchableOpacity style={styles.uploadcov}>
          <Text style={styles.upltxt}>1 Document Attached</Text>
          <View style={{flexDirection:'row',gap:10}}>
            <ViewIcon />
            <DeleteIcon />
          </View>
        </TouchableOpacity>}

            <TouchableOpacity style={styles.btncov} onPress={handleSubmit}>
              <Text style={styles.btntxt}>Sign Up</Text>
            </TouchableOpacity>
        {touched.email && errors.email &&
          <Text style={styles.require}>{errors.email}</Text>
        }
            </View>
          )}
          </Formik>
            <Text style={styles.textcov2} onPress={()=>navigate('SignUp')}>
              <Text style={[styles.lasttxt,{color:Constants.white}]}>Have an account ? </Text>
              <Text style={[styles.lasttxt,{color:Constants.black,textDecorationLine:'underline'}]}>Sign Up</Text>
            </Text>
      </ScrollView>
      <CameraGalleryPeacker
        refs={cameraRef}
        getImageValue={getImageValue}
        base64={false}
        cancel={cancel}
      />
      </LinearGradient>
  );
};

export default SignUp;
