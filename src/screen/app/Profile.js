import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import {createRef, useEffect, useState} from 'react';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import CameraGalleryPeacker from '../../Assets/Component/CameraGalleryPeacker';
import {BackIcon, EditIcon} from '../../../Theme';
import { checkEmail } from '../../Assets/Helpers/InputsNullChecker';
import { goBack } from '../../../utils/navigationRef';
import { getProfile, updateProfile } from '../../../redux/auth/authAction';
import { useDispatch } from 'react-redux';
import { hp, wp } from '../../../utils/responsiveScreen';
import { showToaster } from '../../../utils/toaster';

const Profile = () => {
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [edit, setEdit] = useState(false);
  const [document, setDocument] = useState();
  const [userDetail, setUserDetail] = useState({
    name: '',
    phone: '',
    email: '',
    image:''
  });

  const cameraRef = createRef();

  const getImageValue = async img => {
    setUserDetail({...userDetail,image:img});
  };
  const cameraRef2 = createRef();

  const getImageValue2 = async img => {
    setDocument(img);
  };

  useEffect(() => {
      getProdata()
    }, []);
  
    const getProdata = () => {
        dispatch(getProfile())
          .unwrap()
          .then(data => {
            console.log('data', data);
            setUserDetail(data);
            setDocument(data?.doc)
          })
          .catch(error => {
            console.error('getProfile failed:', error);
          });
      };
  const submit = () => {
      if (
        userDetail.name === '' ||
      !userDetail.name ||
      userDetail.phone === '' ||
      !userDetail.phone||userDetail?.email===''
      ) {
        setSubmitted(true);
        return;
      }
       const emailcheck = checkEmail(userDetail.email.trim());
    if (!emailcheck) {
      showToaster('error',"Your email id is invalid");
      return;
    }
        const formData = new FormData();
        formData.append('name', userDetail.name);
        formData.append('phone', userDetail.phone);
        formData.append('email', userDetail.email);
        if (userDetail?.image?.uri) {
          formData.append('image', userDetail?.image);
        }
        if (document?.uri) {
          formData.append('doc', document);
        }
        dispatch(updateProfile(formData))
          .unwrap()
          .then(data => {
            console.log('data', data);
            goBack()
          })
          .catch(error => {
            console.error('UpdateProfile failed:', error);
          });
      };
  return (
    <View style={{flex:1}}>
    <ScrollView
      style={[styles.container]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always">
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
       <TouchableOpacity style={styles.backcov} onPress={() => goBack()}>
               <BackIcon  />
                 </TouchableOpacity>
        <Text style={styles.headtxt}>Personal Data</Text>
        <View></View>
      </View>

      <View style={[styles.imgpart,{borderWidth:(userDetail?.image?.uri||userDetail?.image)?4:0}]}>
        {edit && (
          <Pressable
            style={styles.editiconcov}
            onPress={() => cameraRef.current.show()}>
            <EditIcon height={15} color={Constants.white} />
          </Pressable>
        )}
        {userDetail?.image?.uri?<Image
          source={
            userDetail?.image?.uri
              ? {
                  uri: `${userDetail.image.uri}`,
                }
              : require('../../Assets/Images/pro-img.png')
          }
          style={styles.logo}
        />:
        <Image
          source={
            userDetail?.image
              ? {
                  uri: `${userDetail.image}`,
                }
              : require('../../Assets/Images/pro-img.png')
          }
          style={styles.logo}
        />}
      </View>

        <Text style={[styles.jobtitle]}>Name</Text>
        <TextInput
          style={[styles.input]}
          editable={edit}
          placeholder="Enter Name"
          value={userDetail?.name}
          onChangeText={name => setUserDetail({...userDetail, name})}
          placeholderTextColor={Constants.customgrey2}
        />
      {submitted && (userDetail.name === '' || !userDetail.name) && (
        <Text style={styles.require}>Name is required</Text>
      )}
      <Text style={[styles.jobtitle]}>Email</Text>
        <TextInput
          style={[styles.input]}
          editable={edit}
          placeholder="Enter Email"
          value={userDetail?.email}
          onChangeText={email => setUserDetail({...userDetail, email})}
          placeholderTextColor={Constants.customgrey2}
        />
        {submitted && (userDetail.email === '' || !userDetail.email) && (
        <Text style={styles.require}>Email is required</Text>
      )}

        <Text style={[styles.jobtitle]}>Phone</Text>
        <TextInput
          style={[styles.input]}
          editable={edit}
          placeholder="Enter Number"
          value={userDetail?.phone}
          onChangeText={phone => setUserDetail({...userDetail, phone})}
          placeholderTextColor={Constants.customgrey2}
        />
      {submitted && (userDetail.phone === '' || !userDetail.phone) && (
        <Text style={styles.require}>Number is required</Text>
      )}

<TouchableOpacity style={styles.doccov} disabled={!edit} onPress={() => cameraRef2.current.show()}>
  <Text style={styles.doctxt}>Document</Text>
 {(document?.uri||document)&& <Image
              source={{ uri: document?.uri?document?.uri:document }}
              style={{
                height: hp(25),
                borderRadius: 10,
                resizeMode: 'stretch',
              }}
            />}
</TouchableOpacity>

      {edit?<TouchableOpacity style={styles.signInbtn} onPress={() => submit()}>
        <Text style={styles.buttontxt}>Save</Text>
      </TouchableOpacity>:
      <TouchableOpacity style={styles.signInbtn} onPress={() => setEdit(true)}>
        <Text style={styles.buttontxt}>Edit</Text>
      </TouchableOpacity>}

      <CameraGalleryPeacker
        refs={cameraRef}
        getImageValue={getImageValue}
        base64={false}
        cancel={()=>{}}
      />
      <CameraGalleryPeacker
        refs={cameraRef2}
        getImageValue={getImageValue2}
        base64={false}
        cancel={()=>{}}
      />
    </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    padding: 20,
  },
  imgpart: {
    height: 120,
    width: 120,
    alignSelf: 'center',
    position: 'relative',
    zIndex: 9,
    marginBottom: 20,
    borderColor:Constants.custom_blue,
    borderRadius:100
  },
   backcov: {
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.customgrey4,
  },
  editiconcov: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Constants.custom_blue,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // marginTop: 115,
    right: -5,
    bottom: 0,
    zIndex: 9,
  },
  logo: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 60,
    // marginTop: 20,
  },
  input: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    borderRadius:10,
    backgroundColor:Constants.light_blue2,
    height: 50,
    lineHeight: 14,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth:1,
    borderColor:Constants.custom_blue
  },
  signInbtn: {
    height: 50,
    // width: 370,
    borderRadius: 30,
    backgroundColor: Constants.custom_blue,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  jobtitle: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    marginTop:15,
    marginBottom:5
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Medium,
  },
  headtxt: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  doctxt: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
    marginBottom:10,
    marginLeft:5
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginLeft: 10,
    fontSize: 14,
    marginTop: 10,
  },
  doccov:{
    borderRadius:10,
    backgroundColor:Constants.light_blue2,
    // height: hp(33),
    padding: 10,
    borderWidth:1,
    borderColor:Constants.custom_blue,
    marginTop:20
  }
});
