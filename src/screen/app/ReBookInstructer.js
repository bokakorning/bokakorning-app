import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { createRef, useEffect, useState } from 'react';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import { CarIcon, CrossIcon, EditIcon, PinIcon, RightArrowIcon, } from '../../../Theme';
import { hp, wp } from '../../../utils/responsiveScreen';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { mapStyle } from '../../../Theme/MapStyle';
import { useDispatch, useSelector } from 'react-redux';
import { getNearbyocation } from '../../../redux/location/locationAction';
import { goBack, navigate } from '../../../utils/navigationRef';
import LocationDropdown from '../../Assets/Component/LocationDropdown'
import { useIsFocused } from '@react-navigation/native';
import ActionSheet from 'react-native-actions-sheet';
import { Picker } from 'react-native-wheel-pick';
import { reBookings } from '../../../redux/booking/bookingAction';
import UserHeader from '../../Assets/Component/UserHeader';

const ReBookInstructer = (props) => {
  const data = props?.route?.params;
  const timeRef = createRef();
  const [driverlist, setDriverList] = useState([]);
  const [selDriver, setselDriver] = useState([]);
  const [timeconf, settimeconf] = useState(true);
  const dispatch = useDispatch();
  const IsFocused = useIsFocused();

  useEffect(() => {
    console.log(data?.user_location)
    {
      data?.user_location?.type &&IsFocused&& getNearbyInstructer();
    }
  }, [data]);
  const [selectedTime, setSelectedTime] = useState();
    const [times, setTimes] = useState();
    useEffect(() => {
      const generatedSlots = generateTimeSlots();
      setTimes(generatedSlots);
      setSelectedTime(data?.selectedTime);
    }, []);

  const getNearbyInstructer = () => {
    const body = {
      location: data?.user_location,
      transmission: data?.transmission,
      booking_id:data?._id
    };
    console.log('body', body);
    dispatch(getNearbyocation(body))
      .unwrap()
      .then(data => {
        console.log('data', data);
        setDriverList(data);
      })
      .catch(error => {
        console.error('Nearby instructer failed:', error);
      });
  };
  const submit = async () => {
      const body={
      booking_id: data?._id,
      instructer: selDriver?._id,
      selectedTime: selectedTime,
      }
        dispatch(reBookings(body))
          .unwrap()
          .then(res => {
            console.log('res', res);
            goBack()
            // reset("BookingConfirm",{name:data?.name,image:data?.image,selectedTime})
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
  const PackageIcon2 = () => {
    return (
      <TouchableOpacity style={{ height: 60, width: 60, position: 'relative' }}>
        <CarIcon height={50} width={50}  />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <UserHeader item={"Rebooking"} showback={true}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding:20}} keyboardShouldPersistTaps="handled">

        {/* <View style={styles.textInput}>
          <LocationDropdown
          />
          </View> */}
        <Text style={styles.headtxt}>Book another instructer</Text>
        <Text style={[styles.seltxt, { marginVertical: 10 }]}>
          Instructors Available Near your address:
        </Text>
        <View style={styles.mapThumbnail}>
          {data?.user_location?.coordinates?.length>0&&<MapView
          // key={userEnteredLocation?.lat}
            style={styles.mapThumbnailView}
            provider={PROVIDER_GOOGLE}
            // ref={mapRef}
            customMapStyle={mapStyle}
            region={{
              latitude: data?.user_location?.coordinates[1],
              longitude: data?.user_location?.coordinates[0],
              latitudeDelta: 0.115,
              longitudeDelta: 0.1121,
            }}
          >
            {data?.user_location?.coordinates?.length>0 && (
              <Marker
                zIndex={8}
                draggable={false}
                coordinate={{
                  latitude: data?.user_location?.coordinates[1],
                  longitude: data?.user_location?.coordinates[0],
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <PackageIcon />
              </Marker>
            )}
            {driverlist &&
              driverlist?.length > 0 &&
              driverlist.map((item, index) => (
                <Marker
                  zIndex={8}
                  key={index}
                  draggable={false}
                  coordinate={{
                    latitude: item?.location.coordinates[1],
                    longitude: item?.location.coordinates[0],
                  }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  onPress={()=>navigate('InstructerDetail',item)}
                >
                  <PackageIcon2 />
                </Marker>
              ))}
          </MapView>}
        </View>
        <Text style={styles.headtxt2}>Available Instructors</Text>
        {driverlist && driverlist?.length > 0 ? (
          driverlist.map((item, index) => (
            <TouchableOpacity
            onPress={()=>navigate('InstructerDetail',item)}
              style={[
                styles.box,
                { marginBottom: driverlist.length === index + 1 ? 150 : 0 },
              ]}
              key={index}
            >
              <View style={styles.frow}>
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={
                      item?.image
                        ? {
                            uri: `${item?.image}`,
                          }
                        : require('../../Assets/Images/profile4.png')
                    }
                    style={styles.proimg}
                  />
                  <Text style={styles.awatxt}>
                    {item?.distance > 0
                      ? (item?.distance / 1609.34).toFixed(0)
                      : 0}{' '}
                    Miles Away
                  </Text>
                </View>
                <View>
                  <Text style={styles.drivtxt}>{item?.name}</Text>
                  <Text style={styles.drivinftxt}>Experience/Lesson Type</Text>
                  <Text style={styles.drivtxt}>{Currency} {item?.rate_per_hour}/h</Text>
                </View>
              </View>
              <View>
                <TouchableOpacity style={styles.bookbtn} onPress={()=>{setselDriver(item),timeRef.current?.show()}}>
                  <Text style={styles.booktxt}>Book</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={()=>navigate('AssignedInstructor',item)}
                >
                  <Text style={styles.viwdetxt}>View Details</Text>
                  <RightArrowIcon height={15} width={15} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noinsttxt}>No Instructor Available</Text>
        )}
      </ScrollView>
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
            onPress={() => {timeRef.current.hide()}}
          />
        </View>
        {!timeconf && <View style={styles.horline}></View>}
        {timeconf&&<Text style={styles.mapinstxt}>Your instructor will some pick you up at location below:</Text>}
        {timeconf ? (
          <View style={styles.mapThumbnail}>
            {data?.user_location?.coordinates?.length>0 && (
              <MapView
                style={styles.mapThumbnailView}
                provider={PROVIDER_GOOGLE}
                // ref={mapRef}
                customMapStyle={mapStyle}
                region={{
                  latitude: data?.user_location?.coordinates[1],
                  longitude: data?.user_location?.coordinates[0],
                  latitudeDelta: 0.115,
                  longitudeDelta: 0.1121,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                {data?.user_location?.coordinates?.length>0 && (
                  <Marker
                    zIndex={8}
                    draggable={false}
                    coordinate={{
                      latitude: data?.user_location?.coordinates[1],
                      longitude: data?.user_location?.coordinates[0],
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                  >
                    <PackageIcon />
                  </Marker>
                )}
                {selDriver?.location?.coordinates?.length > 0 && (
                  <Marker
                    zIndex={8}
                    draggable={false}
                    coordinate={{
                      latitude: selDriver?.location.coordinates[1],
                      longitude: selDriver?.location.coordinates[0],
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
            {timeconf ? 'Confirm Booking' : 'Confirm Time'}
          </Text>
        </TouchableOpacity>
      </ActionSheet>
    </View>
  );
};

export default ReBookInstructer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    // padding: 20,
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
  seltxt: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
  },
  mapThumbnailView: {
    height: '100%',
    width: '100%',
  },
  mapThumbnail: {
    height: 220,
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
    // position: 'absolute',
    // bottom: 75,
    width: wp(90),
    alignSelf: 'center',
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
});
