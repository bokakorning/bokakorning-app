import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { createRef, useEffect, useState } from 'react';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { CalenderIcon, CarIcon, ClockIcon, Cross2Icon, CrossIcon, LocationIcon, PinIcon, SearchIcon } from '../../../Theme';
import { hp, wp } from '../../../utils/responsiveScreen';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { mapStyle } from '../../../Theme/MapStyle';
import RequestCurrentLocation from '../../Assets/Component/RequestCurrentLocation';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '../../../utils/navigationRef';
import LocationDropdown from '../../Assets/Component/LocationDropdown'
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from 'react-native-wheel-pick';
import ActionSheet from 'react-native-actions-sheet';
import { createBooking } from '../../../redux/booking/bookingAction';
import { showToaster } from '../../../utils/toaster';

const Schedule = () => {
  const [vehicleType, setvehicleType] = useState('automatic');
  const [sheduleDate, setSheduleDate] = useState();
  const [dateModel, setDateModel] = useState(false);
  const dispatch = useDispatch();
  const userAddress = useSelector(state => state.location.userAddress);
  const userLocation = useSelector(state => state.location.userLocation);
  const userEnteredLocation = useSelector(state => state.location.userEnteredLocation);
  const userEnteredAddress = useSelector(state => state.location.userEnteredAddress);
  const timeRef = createRef();
  const [selectedTime, setSelectedTime] = useState();
    const [times, setTimes] = useState();
    useEffect(() => {
      const generatedSlots = generateTimeSlots();
      setTimes(generatedSlots);
      // setSelectedTime(generatedSlots[0]);
    }, []);

const onDateChange=(event,selectDate)=>{
setSheduleDate(selectDate)
setDateModel(false)
}
const submit = async () => {
  if (!selectedTime) {
    showToaster('error',"Please select the time");
    return
  }
  if (!sheduleDate) {
    showToaster('error',"Please select the date");
    return
  }
    const body={
    selectedTime: selectedTime,
    sheduleDate: sheduleDate,
    sheduleSeesion:true,
    payment_mode:"online",
    user_location: {
        type: 'Point',
        coordinates: [userEnteredLocation?.long?userEnteredLocation.long:userLocation?.long, userEnteredLocation?.lat?userEnteredLocation.lat:userLocation?.lat],
      },
    pickup_address: userEnteredAddress?userEnteredAddress:userAddress
    }
      dispatch(createBooking(body))
        .unwrap()
        .then(res => {
          console.log('res', res);
          navigate("App",{screen:"History"})
        })
        .catch(error => {
          console.error('Booking failed:', error);
        });
    };

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
          <PinIcon height={50} width={50}  />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        <Text style={styles.headtxt}>Schedule session for later </Text>
        <Text style={styles.seltxt}>Select your preferred vehicle:</Text>
        <View style={styles.caroptcov}>
          <View
            style={[
              vehicleType === 'automatic' && {
                borderWidth: 2,
                borderColor: Constants.custom_blue,
                borderRadius: 10,
              },
              { flex: 1 },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.carcov,
                vehicleType === 'automatic' && {
                  backgroundColor: Constants.light_blue2,
                },
              ]}
              onPress={() => {
                setvehicleType('automatic')
              }}
            >
              <Image source={require('../../Assets/Images/smart-car.png')} />
              <Text style={styles.seltxt}>Automatic Car</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              vehicleType === 'manual' && {
                borderWidth: 2,
                borderColor: Constants.custom_blue,
                borderRadius: 10,
              },
              { flex: 1 },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.carcov,
                vehicleType === 'manual' && {
                  backgroundColor: Constants.light_blue2,
                },
              ]}
              onPress={() => {
                setvehicleType('manual')
              }}
            >
              <Image source={require('../../Assets/Images/smart-car.png')} />
              <Text style={styles.seltxt}>Manual Car</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.seltxt, { marginVertical: 10 }]}>
          Select your pickup location:
        </Text>
        <View style={styles.textInput}>
          <LocationDropdown
          />
          </View>
        <Text style={[styles.seltxt2, { marginVertical: 10 }]}>
          Or f ind it on map
        </Text>
        <View style={styles.mapThumbnail}>
          {userLocation?.long&&<MapView
            style={styles.mapThumbnailView}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            region={{
              latitude: userEnteredLocation?.lat?userEnteredLocation.lat:userLocation?.lat,
              longitude: userEnteredLocation?.long?userEnteredLocation.long:userLocation?.long,
              latitudeDelta: 0.115,
              longitudeDelta: 0.1121,
            }}
          >
            {userLocation?.long && (
              <Marker
                zIndex={8}
                draggable={false}
                coordinate={{
                  latitude: userEnteredLocation?.lat?userEnteredLocation.lat:userLocation?.lat,
                  longitude: userEnteredLocation?.long?userEnteredLocation.long:userLocation?.long,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <PackageIcon />
              </Marker>
            )}
          </MapView>}
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-evenly',marginTop:30}}>
         <TouchableOpacity style={styles.actionButton} onPress={() => setDateModel(true)}>
            <CalenderIcon color={Constants.white}/>
            <Text style={styles.actionText}>{sheduleDate ? moment(sheduleDate).format('DD MMM') : "Schedule Date"}</Text>
          </TouchableOpacity>
         <TouchableOpacity style={styles.actionButton} onPress={() => timeRef?.current.show()}>
            <ClockIcon color={Constants.white} height={17} width={17}/>
            <Text style={styles.actionText}>{selectedTime?selectedTime : "Schedule Time"}</Text>
          </TouchableOpacity>
          </View>
      </ScrollView>
      {dateModel&&<DateTimePicker
        mode='date'
        value={sheduleDate?sheduleDate:new Date()}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={onDateChange}
      />}
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
            Pickup Time :
          </Text>
          <CrossIcon
            style={styles.popupcross}
            height={26}
            width={26}
            onPress={() => {timeRef.current.hide()}}
          />
        </View>
         <View style={styles.horline}></View>
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

        <View style={styles.horline}></View>
        <View>
        
        </View>

        <TouchableOpacity
          style={styles.shdbtn2}
          onPress={() => {
              timeRef.current.hide();
          }}
        >
          <Text style={styles.shdbtntxt}>
            Confirm Time
          </Text>
        </TouchableOpacity>
      </ActionSheet>
      <TouchableOpacity style={styles.shdbtn} onPress={()=>submit()}>
        <Text style={styles.shdbtntxt}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Schedule;

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
  headtxt: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: wp(7),
    marginVertical: hp(0.5),
  },
  headtxt2: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: wp(5),
    marginVertical: hp(1),
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
  iconcov: {
    backgroundColor: Constants.custom_blue,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  topcov: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  seltxt: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
  },
  seltxt2: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    textAlign:'center'
  },
  carcov: {
    height: hp(14),
    backgroundColor: Constants.customgrey5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    borderRadius: 10,
    margin: 5,
  },
  caroptcov: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  mapThumbnailView: {
    height: '100%',
    width: '100%',
  },
  mapThumbnail: {
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
  },
  proimg: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  box: {
    backgroundColor: Constants.custom_blue,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  awatxt: {
    fontSize: 10,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    backgroundColor: Constants.white,
    borderRadius: 10,
    padding: 3,
    marginTop: 5,
  },
  drivtxt: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  drivinftxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Regular,
  },
  booktxt: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  },
  viwdetxt: {
    fontSize: 12,
    color: Constants.black,
    fontFamily: FONTS.Medium,
  },
  drivrattxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Medium,
  },
  bookbtn: {
    backgroundColor: Constants.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: hp(2),
    paddingVertical: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  frow: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  shdbtn: {
    backgroundColor: Constants.black,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    width: wp(90),
    alignSelf: 'center',
  },
  shdbtn2: {
    backgroundColor: Constants.black,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(90),
    alignSelf: 'center',
    marginBottom: 20, 
    marginTop: 10
  },
  shdbtntxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  },
  noinsttxt: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    marginTop: 20,
    alignSelf: 'center',
  },
  textInput:{
    backgroundColor:Constants.customgrey4,
    borderRadius:10,
    marginTop:8
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Constants.custom_blue,
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 8,
    gap:5
    // marginRight: 10,
  },
  actionText: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
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
    timePickerStyle: {
    backgroundColor: Constants.white,
    width: '90%',
    height: 170,
    alignSelf: 'center',
    fontFamily: FONTS.Medium,
  },
  timePickerView: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    paddingVertical: 20,
  },
});
