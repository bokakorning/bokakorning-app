import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  Animated,
  Modal,
} from 'react-native';
import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './styles';
import Constants from '../../Assets/Helpers/constant';
import * as Yup from 'yup';
import { Formik } from 'formik';
import LinearGradient from 'react-native-linear-gradient';
import { navigate } from '../../../utils/navigationRef';
import { hp, wp } from '../../../utils/responsiveScreen';
import { CrossIcon, DeleteIcon, DropdownIcon, ViewIcon } from '../../../Theme';
import CameraGalleryPeacker from '../../Assets/Component/CameraGalleryPeacker';
import { signup } from '../../../redux/auth/authAction';
import { useDispatch } from 'react-redux';

const SignUp = () => {
  const [showPass, setShowPass] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [document, setDocument] = useState();
  const [registerModel, setRegisterModel] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('Phone is required'),
  });

  const submit = async (value, { resetForm }) => {
    const formData = new FormData();
    formData.append('doc', document);
    formData.append('name', value.name);
    formData.append('email', value.email);
    formData.append('phone', value.phone);
    formData.append('password', value.password);
    formData.append('type', tabopt === 1 ? 'instructer' : 'user');
    dispatch(signup(formData))
      .unwrap()
      .then(data => {
        console.log('data', data);
        resetForm();
        navigate('SignIn');
      })
      .catch(error => {
        console.error('Signup failed:', error);
      });
  };
  const cameraRef = createRef();

  const getImageValue = async img => {
    // setDocument(img.assets[0])
    // console.log('image data', img.assets[0]);
    setDocument(img);
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
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={['#4EB0CF', '#FFFFFF', '#FFFFFF', '#4EB0CF']}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={registerModel}
          validationSchema={validationSchema}
          onSubmit={submit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.buttompart}>
              <Image
                source={require('../../Assets/Images/pro-img.png')}
                style={[styles.proimg, { marginTop: hp(6) }]}
              />
              <Text style={[styles.headtxt, { marginVertical: 0 }]}>
                Sign Up
              </Text>
              <View style={styles.btnCov}>
                {/* Animated sliding background */}
                <Animated.View
                  style={[styles.slider, { transform: [{ translateX }] }]}
                />

                <TouchableOpacity
                  style={styles.cencelBtn}
                  onPress={() => settabopt(0)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.btntxt,
                      tabopt === 0 ? styles.activeText : styles.inactiveText,
                    ]}
                  >
                    Student
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cencelBtn2}
                  onPress={() => settabopt(1)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.btntxt,
                      tabopt === 1 ? styles.activeText : styles.inactiveText,
                    ]}
                  >
                    Instructer
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inpcov}>
                <TextInput
                  style={styles.inputfield}
                  placeholder="Full Name"
                  placeholderTextColor={Constants.customgrey2}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
              </View>
              {touched.name && errors.name && (
                <Text style={styles.require}>{errors.name}</Text>
              )}
              <View style={styles.inpcov}>
                <TextInput
                  style={styles.inputfield}
                  placeholder="Phone Number"
                  keyboardType="number-pad"
                  placeholderTextColor={Constants.customgrey2}
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                />
              </View>
              {touched.phone && errors.phone && (
                <Text style={styles.require}>{errors.phone}</Text>
              )}
              <View style={styles.inpcov}>
                <TextInput
                  style={styles.inputfield}
                  placeholder="Enter Email"
                  placeholderTextColor={Constants.customgrey2}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
              </View>
              {touched.email && errors.email && (
                <Text style={styles.require}>{errors.email}</Text>
              )}
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
                  style={[styles.iconView, { borderRightWidth: 0 }]}
                >
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
              {touched.password && errors.password && (
                <Text style={styles.require}>{errors.password}</Text>
              )}
              {tabopt === 0 && !document?.uri && (
                <TouchableOpacity
                  style={styles.uploadcov}
                  onPress={() => cameraRef?.current?.show()}
                >
                  <Text style={styles.upltxt}>Attach Your Driving Permit</Text>
                  <DropdownIcon />
                </TouchableOpacity>
              )}
              {tabopt === 0 && document?.uri && (
                <TouchableOpacity style={styles.uploadcov}>
                  <Text style={styles.upltxt}>1 Document Attached</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <ViewIcon onPress={() => setModalVisible(true)} />
                    <DeleteIcon onPress={() => setDocument('')} />
                  </View>
                </TouchableOpacity>
              )}

              {/* <TouchableOpacity style={styles.btncov} onPress={handleSubmit}> */}
              <TouchableOpacity style={styles.btncov} onPress={handleSubmit}>
                <Text style={styles.btntxt}>Sign Up</Text>
              </TouchableOpacity>
              {touched.email && errors.email && (
                <Text style={styles.require}>{errors.email}</Text>
              )}
            </View>
          )}
        </Formik>
        <Text style={styles.textcov2} onPress={() => navigate('SignUp')}>
          <Text style={[styles.lasttxt, { color: Constants.white }]}>
            Have an account ?{' '}
          </Text>
          <Text
            style={[
              styles.lasttxt,
              { color: Constants.black, textDecorationLine: 'underline' },
            ]}
          >
            Sign Up
          </Text>
        </Text>
      </ScrollView>
      <CameraGalleryPeacker
        refs={cameraRef}
        getImageValue={getImageValue}
        base64={false}
        cancel={cancel}
      />
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.croscov}
              onPress={() => setModalVisible(false)}
            >
              <CrossIcon color={Constants.black} height={30} width={30} />
            </TouchableOpacity>
            {/* <View style={{backgroundColor: 'white', alignItems: 'center'}}> */}
            {/* <View style={[styles.covline,{width:'100%'}]}> */}
            {/* </View> */}
            <Image
              source={{ uri: document?.uri }}
              style={{
                height: hp(30),
                width: wp(80),
                borderRadius: 10,
                resizeMode: 'stretch',
              }}
            />

            {/* </View> */}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default SignUp;
