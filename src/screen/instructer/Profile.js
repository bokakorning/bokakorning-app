import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { createRef, useEffect, useRef, useState } from 'react';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { PencilIcon } from '../../../Theme';
import { Dropdown } from 'react-native-element-dropdown';
import CameraGalleryPeacker from '../../Assets/Component/CameraGalleryPeacker';
import { getProfile, updateProfile } from '../../../redux/auth/authAction';
import { goBack, reset } from '../../../utils/navigationRef';
import { useDispatch, useSelector } from 'react-redux';

const InstProfile = () => {
  const [submitted, setSubmitted] = useState(false);
  const [aumaticopt, setaumaticopt] = useState(false);
  const [manuopt, setmanuopt] = useState(false);
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState();
  const dispatch = useDispatch();
  const [userDetail, setUserDetail] = useState({
    name: '',
    vehicle_model: '',
    model_year: '',
    experience_year: '',
    experience_month: '',
    bio: '',
  });
  const dropdownRef = useRef();
  const dropdownRef2 = useRef();
  const cameraRef = createRef();

useEffect(() => {
      getProdata()
    }, []);
  console.log("image",image)
    const getProdata = () => {
        dispatch(getProfile())
          .unwrap()
          .then(data => {
            console.log('data', data);
            setUserDetail(data);
            setImage(data?.image)
            if (data?.transmission==="Both") {
    setaumaticopt(true)
    setmanuopt(true)
  } else if (data?.transmission==="Automatic"){
    setaumaticopt(true)
  } else{
    setmanuopt(true)
  }
          })
          .catch(error => {
            console.error('getProfile failed:', error);
          });
      };
  const submit = () => {
    if (
      userDetail.name === '' ||
      userDetail.vehicle_model==='' ||
      userDetail.model_year==='' ||
      userDetail.experience_year==='' ||
      userDetail.experience_month==='' ||
      userDetail.bio===''||(!aumaticopt&&!manuopt)
    ) {
      setSubmitted(true);
      return;
    }
      const formData = new FormData();
      formData.append('name', userDetail.name);
      formData.append('vehicle_model', userDetail.vehicle_model);
      formData.append('model_year', userDetail.model_year);
      formData.append('bio', userDetail.bio);
      formData.append('experience_year', userDetail.experience_year);
      formData.append('experience_month', userDetail.experience_month);
      formData.append('transmission', aumaticopt&&manuopt ? 'Both' : aumaticopt?'Automatic':'Manual');
      formData.append('status', "Approved");
      if (image?.uri) {
          formData.append('image', image);
        }
      dispatch(updateProfile(formData))
        .unwrap()
        .then(data => {
goBack()
        })
        .catch(error => {
          console.error('UpdateProfile failed:', error);
          console.log(error)
        });
    };
  const months = [
    { label: '1 Month', value: 1 },
    { label: '2 Months', value: 2 },
    { label: '3 Months', value: 3 },
    { label: '4 Months', value: 4 },
    { label: '5 Months', value: 5 },
    { label: '6 Months', value: 6 },
    { label: '7 Months', value: 7 },
    { label: '8 Months', value: 8 },
    { label: '9 Months', value: 9 },
    { label: '10 Months', value: 10 },
    { label: '11 Months', value: 11 },
    { label: '12 Months', value: 12 },
  ];
  const years = [
    { label: '0 Year', value: 0 },
    { label: '1 Year', value: 1 },
    { label: '2 Years', value: 2 },
    { label: '3 Years', value: 3 },
    { label: '4 Years', value: 4 },
    { label: '5 Years', value: 5 },
    { label: '6 Years', value: 6 },
    { label: '7 Years', value: 7 },
    { label: '8 Years', value: 8 },
    { label: '9 Years', value: 9 },
    { label: '10 Years', value: 10 },
    { label: '11 Years', value: 11 },
    { label: '12 Years', value: 12 },
    { label: '13+ Years', value: '13+' },
  ];
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {image?.uri?<Image
        source={image?.uri
              ? {
                  uri: `${image?.uri}`
                }
              :require('../../Assets/Images/profile4.png')}
        style={styles.img}
      />:
      <Image
        source={image
              ? {
                  uri: `${image}`
                }
              :require('../../Assets/Images/profile4.png')}
        style={styles.img}
      />}
      {edit&&<TouchableOpacity style={styles.frow} onPress={()=>cameraRef?.current?.show()}>
        <Text style={styles.chgtxt}>Change your Profile Picture</Text>
        <PencilIcon color={Constants.black} />
      </TouchableOpacity>}
      {submitted && !image?.uri&& (
        <Text style={styles.require}>Image is required</Text>
      )}
      <Text style={styles.tittxt}>Name</Text>
      <View style={styles.inpcov}>
        <TextInput
          style={styles.inputfield}
          placeholder="Enter Name"
          editable={edit}
          placeholderTextColor={Constants.customgrey2}
          value={userDetail?.name}
          onChangeText={name => setUserDetail({ ...userDetail, name })}
        />
      </View>
      {submitted && (userDetail.name === '' || !userDetail.name) && (
        <Text style={styles.require}>Name is required</Text>
      )}
      <Text style={styles.partheadtxt}>Vehicle Details:</Text>
      <View style={styles.frow2}>
        <Text style={styles.tittxt}>Model Name</Text>
        <View style={[styles.inpcov, { flex: 1 }]}>
          <TextInput
            style={styles.inputfield}
            editable={edit}
            placeholder="Enter Model"
            placeholderTextColor={Constants.customgrey2}
            value={userDetail?.vehicle_model}
            onChangeText={vehicle_model =>
              setUserDetail({ ...userDetail, vehicle_model })
            }
          />
        </View>
      </View>
      {submitted &&
        (userDetail.vehicle_model === '' || !userDetail.vehicle_model) && (
          <Text style={styles.require}>Model Name is required</Text>
        )}
      <View style={styles.frow2}>
        <Text style={styles.tittxt}>Transmission</Text>
        <TouchableOpacity
        disabled={!edit}
          style={[
            styles.optinpcov,
            {
              marginRight: 3,
              backgroundColor: aumaticopt ? Constants.light_blue3 : null,
            },
          ]}
          onPress={() => setaumaticopt(!aumaticopt)}
        >
          <Text style={styles.opttxt}>Automatic</Text>
        </TouchableOpacity>
        <TouchableOpacity
        disabled={!edit}
          style={[
            styles.optinpcov,
            {
              marginLeft: 3,
              backgroundColor: manuopt ? Constants.light_blue3 : null,
            },
          ]}
          onPress={() => setmanuopt(!manuopt)}
        >
          <Text style={styles.opttxt}>Manual</Text>
        </TouchableOpacity>
      </View>
      {submitted && (!aumaticopt && !manuopt) && (
        <Text style={styles.require}>Transmission is required</Text>
      )}
      <View style={styles.frow2}>
        <Text style={styles.tittxt}>Model Year</Text>
        <View style={[styles.inpcov, { flex: 1 }]}>
          <TextInput
            style={styles.inputfield}
            editable={edit}
            placeholder="Enter Model Year"
            placeholderTextColor={Constants.customgrey2}
            value={userDetail?.model_year}
            onChangeText={model_year =>
              setUserDetail({ ...userDetail, model_year })
            }
          />
        </View>
      </View>
      {submitted &&
        (userDetail.model_year === '' || !userDetail.model_year) && (
          <Text style={styles.require}>Model Year is required</Text>
        )}
      <Text style={[styles.partheadtxt,{marginBottom:10,marginTop:15}]}>Experience:</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Dropdown
          ref={dropdownRef}
          disable={!edit}
          data={years}
          labelField="label"
          valueField="label"
          placeholder="Select Years"
          value={userDetail?.experience_year}
          onChange={item => {}}
          renderItem={dditem => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                setUserDetail({ ...userDetail, experience_year: dditem?.label });
                dropdownRef.current?.close();
              }}
            >
              <Text style={styles.itemText}>{dditem.label}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          iconColor={
            userDetail?.experience_year ? 'black' : Constants.customgrey2
          }
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          itemTextStyle={styles.itemText}
          itemContainerStyle={styles.itemContainerStyle}
          selectedItemStyle={styles.selectedStyle}
        />
        <Dropdown
          ref={dropdownRef2}
          disable={!edit}
          data={months}
          labelField="label"
          valueField="label"
          placeholder="Select Months"
          value={userDetail.experience_month}
          onChange={item => {}}
          renderItem={dditem => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                setUserDetail({ ...userDetail, experience_month: dditem?.label });
                dropdownRef2.current?.close();
              }}
            >
              <Text style={styles.itemText}>{dditem.label}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          iconColor={
            userDetail?.experience_month ? 'black' : Constants.customgrey2
          }
          itemTextStyle={styles.itemText}
          itemContainerStyle={styles.itemContainerStyle}
          selectedItemStyle={styles.selectedStyle}
        />
      </View>
      <View style={{ flexDirection: 'row', }}>
        <View style={{width:'52%'}}>
{submitted &&userDetail.experience_year === ''&& (
          <Text style={styles.require}>Year is required</Text>
        )}
        </View>
        {submitted &&userDetail.experience_month === '' && (
          <Text style={styles.require}>Month is required</Text>
        )}
      </View>
      <Text style={styles.partheadtxt}>Bio:</Text>
      <View style={[styles.inpucov,{marginTop:10}]}>
        <TextInput
        editable={edit}
          style={[styles.inputfield, { textAlignVertical: 'top' }]}
          placeholder="Add a short description about yourself..."
          placeholderTextColor={Constants.customgrey2}
          numberOfLines={5}
          multiline={true}
          value={userDetail?.bio}
          onChangeText={bio => setUserDetail({ ...userDetail, bio })}
        ></TextInput>
      </View>
      {submitted &&
        (userDetail.bio === '' || !userDetail.bio) && (
          <Text style={styles.require}>Bio is required</Text>
        )}
      {edit?<TouchableOpacity style={styles.btncov} onPress={()=>submit()}>
              <Text style={styles.btntxt}>Submit</Text>
            </TouchableOpacity>:
      <TouchableOpacity style={styles.btncov} onPress={()=>setEdit(true)}>
              <Text style={styles.btntxt}>Edit</Text>
            </TouchableOpacity>}
            <CameraGalleryPeacker
        refs={cameraRef}
        getImageValue={(it)=>{console.log(it),setImage(it)}}
        base64={false}
        cancel={()=>{}}
      />
    </ScrollView>
  );
};

export default InstProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Constants.white,
  },
  img: {
    height: 120,
    width: 120,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 10,
  },
  frow: {
    flexDirection: 'row',
    marginTop: 10,
    alignSelf: 'center',
    gap: 10,
    alignItems: 'center',
  },
  inpcov: {
    borderWidth: 1.5,
    borderColor: Constants.custom_blue,
    borderRadius: 10,
    height: 55,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    // marginTop: 15,
  },
  optinpcov: {
    borderWidth: 1.5,
    borderColor: Constants.custom_blue,
    borderRadius: 10,
    height: 55,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // marginTop: 15,
  },
  btntxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  chgtxt: {
    color: Constants.black,
    fontSize: 12,
    fontFamily: FONTS.SemiBold,
    textDecorationLine: 'underline',
  },
  tittxt: {
    color: Constants.customgrey3,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
    marginVertical: 10,
    width: '30%',
  },
  frow2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  partheadtxt: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
    marginTop: 20,
  },
  inputfield: {
    flex: 1,
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
    // backgroundColor:Constants.red
  },
  opttxt: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
  },
  inpucov: {
    backgroundColor: Constants.light_blue3,
    // marginVertical: 10,
    borderRadius: 10,
    height: 130,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: Constants.custom_blue,
    marginTop: 20,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    // width: '100%',
    backgroundColor: Constants.custom_blue,
    borderBottomWidth: 1,
    borderColor: Constants.white,
  },
  dropdownContainer: {
    borderRadius: 12,
    backgroundColor: Constants.custom_blue,
  },
  selectedStyle: {
    backgroundColor: Constants.custom_blue,
  },
  itemContainerStyle: {
    // borderBottomWidth: 1,
    borderColor: Constants.customgrey,
    backgroundColor: Constants.custom_blue,
  },
  placeholder: {
    color: Constants.customgrey2,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    // paddingVertical: 12,
  },
  selectedText: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    // paddingVertical: 12,
  },
  itemText: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.Medium,
  },
  dropdown: {
    height: 50,
    width: '47%',
    borderWidth: 1,
    borderColor: Constants.custom_blue,
    borderRadius: 10,
    paddingHorizontal: 7,
    backgroundColor: Constants.light_blue3,
  },
  btncov:{
    width:'50%',
    backgroundColor:Constants.custom_blue,
    borderRadius:15,
    height:55,
    justifyContent:'center',
    alignItems:'center',
    marginTop:10,
    boxShadow: '0px 1.5px 5px 0.1px grey',
    alignSelf:'center',
    marginBottom:40
  },
  btntxt:{
    fontSize:14,
    color:Constants.white,
    fontFamily:FONTS.SemiBold
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginLeft: 5,
    marginTop: 10,
    fontSize: 14,
    alignSelf:'flex-start'
    // marginTop:10
  },
});
