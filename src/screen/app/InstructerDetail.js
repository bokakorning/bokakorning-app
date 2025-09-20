import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CallIcon,
  CarIcon,
  CrossIcon,
  EditIcon,
  LeftarrowIcon,
  LocationIcon,
  PinIcon,
} from '../../../Theme';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { hp, wp } from '../../../utils/responsiveScreen';
import { Picker } from 'react-native-wheel-pick';
import ActionSheet from 'react-native-actions-sheet';
import { mapStyle } from '../../../Theme/MapStyle';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { goBack, navigate, reset } from '../../../utils/navigationRef';
import { createBooking } from '../../../redux/booking/bookingAction';

const InstructerDetail = props => {
  const data = props?.route?.params;
  // console.log('data', data);
  const timeRef = createRef();
  const dispatch = useDispatch();
  const userAddress = useSelector(state => state.location.userAddress);
  const userLocation = useSelector(state => state.location.userLocation);
  const user = useSelector(state => state.auth.user);
  const [selectedTime, setSelectedTime] = useState();
  const [timeconf, settimeconf] = useState(false);
  const [times, setTimes] = useState();
  useEffect(() => {
    const generatedSlots = generateTimeSlots();
    setTimes(generatedSlots);
    setSelectedTime(generatedSlots[0]);
  }, []);
   const submit = async () => {
    const body={
instructer: data?._id,
    selectedTime: selectedTime,
    payment_mode:"online",
    user_location: {
        type: 'Point',
        coordinates: [userLocation?.long, userLocation?.lat],
      },
    pickup_address: userAddress
    }
      dispatch(createBooking(body))
        .unwrap()
        .then(res => {
          console.log('res', res);
          reset("BookingConfirm",{name:data?.name,image:data?.image,selectedTime})
        })
        .catch(error => {
          console.error('Booking failed:', error);
        });
    };
  // console.log('times', times);
  function generateTimeSlots(start = '00:00', end = '23:50', gapMinutes = 30) {
    const now = new Date();
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    const startTime = new Date();
    startTime.setHours(startHour, startMin, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMin, 0, 0);

    const slots = [];
    let current = new Date(startTime);

    while (current <= endTime) {
      // Only push slots that are in the future (>= now)
      if (current >= now) {
      slots.push(
        current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      );
      }
      current = new Date(current.getTime() + gapMinutes * 60000); // add 30 min
    }

    return slots;
  }
  const PackageIcon = () => {
    return (
      <TouchableOpacity style={{ height: 60, width: 60, position: 'relative' }}>
        <PinIcon height={50} width={50} />
      </TouchableOpacity>
    );
  };
  const PackageIcon2 = () => {
    return (
      <TouchableOpacity style={{ height: 60, width: 60, position: 'relative' }}>
        <CarIcon height={50} width={50} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topcov}>
          <View style={styles.toppart}>
            <Image
              source={
                user?.image
                  ? {
                      uri: `${user?.image}`,
                    }
                  : require('../../Assets/Images/profile4.png')
              }
              style={styles.imgst}
            />
            <View>
              <Text style={styles.nametxt}>{user?.name}</Text>
              <View style={styles.loccov}>
                <LocationIcon />
                <Text style={styles.loctxt} numberOfLines={1}>
                  {userAddress}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.frow} onPress={()=>goBack()}>
          <LeftarrowIcon height={20} width={20} />
          <Text style={styles.bactxt}>Back to Instructors List</Text>
        </TouchableOpacity>
        <View style={styles.frow2}>
          <Text style={styles.instytxt}>
            {data?.transmission === 'Automatic'
              ? 'Auto-Car'
              : data?.transmission === 'Both'
              ? 'Auto & Manual'
              : 'Manual'}{' '}
            Instructor
          </Text>
          <Text style={styles.awatxt}>
            {data?.distance > 0 ? (data?.distance / 1609.34).toFixed(0) : 0}{' '}
            Miles Away
          </Text>
        </View>
        <Image
          source={
            data?.image
              ? {
                  uri: `${data?.image}`,
                }
              : require('../../Assets/Images/profile4.png')
          }
          style={styles.proimg}
        />
        <Text style={styles.drivnametxt}>{data?.name}</Text>
        <Text style={styles.biotxt}>{data?.bio}</Text>
        <Text style={[styles.bactxt, { fontSize: 16 }]}>Vehicle:</Text>
        <Text style={{ marginTop: 7 }}>
          <Text style={styles.drivnametxt}>Vehicle: </Text>
          <Text style={styles.vehinam}>{data?.vehicle_model}</Text>
        </Text>
        <Text style={{ marginTop: 7 }}>
          <Text style={styles.drivnametxt}>Category: </Text>
          <Text style={styles.vehinam}>Car</Text>
        </Text>
        <TouchableOpacity
              style={styles.contactopt}
              onPress={() =>
                Linking.openURL(`tel:${data?.phone}`)
              }>
              <CallIcon color={Constants.custom_blue} height={20} width={20} />
              <Text style={styles.othrttxt2}>
                Contact {data?.name}
              </Text>
            </TouchableOpacity>
      </ScrollView>
      <View style={styles.btmpart}>
        <TouchableOpacity
          style={styles.shdbtn}
          onPress={() => timeRef.current.show()}
        >
          <Text style={styles.shdbtntxt}>Book a Session</Text>
        </TouchableOpacity>
      </View>
      <ActionSheet
        ref={timeRef}
        closeOnTouchBackdrop={true}
        containerStyle={{ backgroundColor: Constants.white }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 15,
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.sheetheadtxt}>
            Pickup {timeconf ? 'Location' : 'Time'}:
          </Text>
          <CrossIcon
            style={styles.popupcross}
            height={26}
            width={26}
            onPress={() => {timeRef.current.hide(); settimeconf(false)}}
          />
        </View>
        {!timeconf && <View style={styles.horline}></View>}
        {timeconf&&<Text style={styles.mapinstxt}>Your instructor will some pick you up at location below:</Text>}
        {timeconf ? (
          <View style={styles.mapThumbnail}>
            {userLocation?.long && (
              <MapView
                style={styles.mapThumbnailView}
                provider={PROVIDER_GOOGLE}
                // ref={mapRef}
                customMapStyle={mapStyle}
                region={{
                  latitude: userLocation?.lat,
                  longitude: userLocation?.long,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                {userLocation?.long && (
                  <Marker
                    zIndex={8}
                    draggable={false}
                    coordinate={{
                      latitude: userLocation?.lat,
                      longitude: userLocation?.long,
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                  >
                    <PackageIcon />
                  </Marker>
                )}
                {data?.location?.coordinates?.length > 0 && (
                  <Marker
                    zIndex={8}
                    draggable={false}
                    coordinate={{
                      latitude: data?.location.coordinates[1],
                      longitude: data?.location.coordinates[0],
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                  >
                    <PackageIcon2 />
                  </Marker>
                )}
              </MapView>
            )}
          </View>
        ) : (
          <View style={styles.timePickerView}>
            {times && times?.length > 0 && (
              <Picker
                textSize={20}
                textColor="#888"
                selectTextColor="#000000"
                isShowSelectLine={true}
                selectLineColor="#F3F4F8"
                selectLineSize={20}
                style={styles.timePickerStyle}
                selectedValue={selectedTime}
                pickerData={times}
                onValueChange={value => {
                  setSelectedTime(value);
                }}
              />
            )}
          </View>
        )}

        {!timeconf && <View style={styles.horline}></View>}
        {timeconf&&<View>
        <Text style={styles.sheetheadtxt2}>At:</Text>
        <View style={styles.ndpart}>
          <Text style={styles.seltimtxt}>{selectedTime}</Text>
          <TouchableOpacity style={styles.editcov} onPress={() => settimeconf(false)}>
            <Text style={styles.seltimtxt}>Edit</Text>
            <EditIcon color={Constants.black}/>
          </TouchableOpacity>
        </View>
        </View>}

        <TouchableOpacity
          style={[styles.shdbtn, { marginBottom: 20, marginTop: 10 }]}
          onPress={() => {
            if (timeconf) {
              timeRef.current.hide();
              submit()
            } else {
              settimeconf(true);
            }
          }}
        >
          <Text style={styles.shdbtntxt}>
            {timeconf ? 'Proceed to Pay' : 'Confirm Time'}
          </Text>
        </TouchableOpacity>
      </ActionSheet>
    </View>
  );
};

export default InstructerDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    padding: 20,
  },
  toppart: {
    backgroundColor: Constants.custom_blue,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flex: 1,
    gap: 5,
  },
  imgst: {
    height: 52,
    width: 50,
    borderRadius: 40,
  },
  nametxt: {
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
  },
  loctxt: {
    color: Constants.white,
    fontFamily: FONTS.Medium,
    fontSize: 14,
    width: '80%',
  },
  loccov: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  topcov: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: '80%',
  },
  bactxt: {
    color: Constants.black,
    fontFamily: FONTS.Heavy,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  frow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
  },
  frow2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    marginTop: 10,
  },
  bactxt: {
    color: Constants.black,
    fontFamily: FONTS.Heavy,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  instytxt: {
    color: Constants.black,
    fontFamily: FONTS.Heavy,
    fontSize: 18,
    width: '65%',
  },
  awatxt: {
    fontSize: 13,
    color: Constants.white,
    fontFamily: FONTS.Medium,
    backgroundColor: Constants.black,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 3,
  },
  proimg: {
    height: hp(35),
    // width: 50,
    borderRadius: 30,
    marginVertical: 20,
  },
  drivnametxt: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    marginVertical: 10,
  },
  biotxt: {
    color: Constants.black,
    fontFamily: FONTS.Medium,
    fontSize: 14,
    marginBottom: 30,
  },
  vehinam: {
    color: Constants.black,
    fontFamily: FONTS.Medium,
    fontSize: 14,
  },
  shdbtn: {
    backgroundColor: Constants.custom_blue,
    borderRadius: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(90),
    alignSelf: 'center',
  },
  shdbtntxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  },
  btmpart: {
    position: 'absolute',
    bottom: 0,
    paddingTop: 15,
    paddingBottom: 8,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    boxShadow: '0px 1px 15px 0.1px #74d7fa',
    width: wp(100),
    backgroundColor:Constants.white
  },
  timePickerStyle: {
    backgroundColor: Constants.white,
    width: '90%',
    height: 170,
    alignSelf: 'center',
    fontFamily: FONTS.Medium,

    // borderRadius: 10,
    // borderWidth: 2,
    // borderColor: Constants.normal_green,
  },
  timePickerView: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    paddingVertical: 20,
  },
  horline: {
    borderTopWidth: 1,
    borderColor: Constants.customgrey5,
  },
  popupcross: {
    alignSelf: 'flex-end',
    marginRight: 15,
    // marginTop: -5,
    // marginBottom: 20,
  },
  sheetheadtxt: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  sheetheadtxt2: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    marginLeft:20
  },
  seltimtxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  mapinstxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    marginLeft:20
  },
  mapThumbnailView: {
    height: '100%',
    width: '100%',
  },
  mapThumbnail: {
    height: 170,
    width: '93%',
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
  },
  ndpart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  editcov:{
    flexDirection:'row',
    borderWidth:1,
    borderColor:Constants.black,
    paddingHorizontal:10,
    paddingVertical:5,
    gap:3,
    borderRadius:18,
    alignItems:'center'
  },
  othrttxt2: {
    color: Constants.custom_blue,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  contactopt: {
    borderWidth: 1.5,
    borderColor: Constants.custom_blue,
    borderRadius: 40,
    flexDirection: 'row',
    height: 60,
    width: '70%',
    justifyContent: 'center',
    // flex:1,
    alignItems: 'center',
    alignSelf: 'center',
    gap: 15,
    marginTop:20,
    marginBottom:90
  },
});
