import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import { CarIcon, Cross2Icon, LocationIcon, PinIcon, SearchIcon } from '../../../Theme';
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
import { getNearbyocation } from '../../../redux/location/locationAction';
import { navigate } from '../../../utils/navigationRef';
import LocationDropdown from '../../Assets/Component/LocationDropdown'
import { useIsFocused } from '@react-navigation/native';

const Home = () => {
  const [vehicleType, setvehicleType] = useState('automatic');
  const [driverlist, setDriverList] = useState([]);
  const [showinput, setshowinput] = useState(false);
  const dispatch = useDispatch();
  const IsFocused = useIsFocused();
  const userAddress = useSelector(state => state.location.userAddress);
  const userLocation = useSelector(state => state.location.userLocation);
  const userEnteredLocation = useSelector(state => state.location.userEnteredLocation);
  const user = useSelector(state => state.auth.user);
  const loginuser = useSelector(state => state.auth.loginuser);
console.log("userEnteredlocation",userEnteredLocation)
  useEffect(() => {
    {
      loginuser && RequestCurrentLocation(dispatch, loginuser);
    }
  }, [loginuser]);
  useEffect(() => {
    {
      userLocation &&IsFocused&& getNearbyInstructer('Automatic',true);
    }
  }, [userLocation,userEnteredLocation]);

  const getNearbyInstructer = (type,inpfil) => {
    const body = {
      location: {
        type: 'Point',
        coordinates: [(showinput&&userEnteredLocation?.long&&inpfil)?userEnteredLocation.long:userLocation?.long, (showinput&&userEnteredLocation?.lat&&inpfil)?userEnteredLocation.lat:userLocation?.lat],
      },
      transmission: type,
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
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.topcov}>
          <View style={styles.toppart}>
            <TouchableOpacity onPress={() => navigate('Profile')}>
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
            </TouchableOpacity>
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
          <TouchableOpacity style={styles.iconcov} onPress={()=>{showinput&&getNearbyInstructer(vehicleType,false),setshowinput(!showinput)}}>
            {showinput?<Cross2Icon height={22} width={22} color={Constants.white}/>:<SearchIcon height={22} width={22} color={Constants.white} />}
          </TouchableOpacity>
        </View>
        {showinput&&<View style={styles.textInput}>
          <LocationDropdown
          />
          </View>}
        <Text style={styles.headtxt}>Book a session now </Text>
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
                setvehicleType('automatic'), getNearbyInstructer('Automatic',true);
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
                setvehicleType('manual'), getNearbyInstructer('Manual',true);
              }}
            >
              <Image source={require('../../Assets/Images/smart-car.png')} />
              <Text style={styles.seltxt}>Manual Car</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.seltxt, { marginVertical: 10 }]}>
          Instructors Available Near you:
        </Text>
        <View style={styles.mapThumbnail}>
          {userLocation?.long&&<MapView
          // key={userEnteredLocation?.lat}
            style={styles.mapThumbnailView}
            provider={PROVIDER_GOOGLE}
            // ref={mapRef}
            customMapStyle={mapStyle}
            region={{
              latitude: (showinput&&userEnteredLocation?.lat)?userEnteredLocation.lat:userLocation?.lat,
              longitude: (showinput&&userEnteredLocation?.long)?userEnteredLocation.long:userLocation?.long,
              latitudeDelta: 0.115,
              longitudeDelta: 0.1121,
            }}
            // scrollEnabled={false}
            // zoomEnabled={false}
            // rotateEnabled={false}
            // pitchEnabled={false}
          >
            {userLocation?.long && (
              <Marker
                zIndex={8}
                draggable={false}
                coordinate={{
                  latitude: (showinput&&userEnteredLocation?.lat)?userEnteredLocation.lat:userLocation?.lat,
                  longitude: (showinput&&userEnteredLocation?.long)?userEnteredLocation.long:userLocation?.long,
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
                  onPress={()=>navigate('InstructerDetail',{...item,vehicleType:vehicleType,selloc:{long:(showinput&&userEnteredLocation?.long)?userEnteredLocation.long:userLocation?.long, lat:(showinput&&userEnteredLocation?.lat)?userEnteredLocation.lat:userLocation?.lat}})}
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
            onPress={()=>navigate('InstructerDetail',{...item,vehicleType:vehicleType,selloc:{long:(showinput&&userEnteredLocation?.long)?userEnteredLocation.long:userLocation?.long, lat:(showinput&&userEnteredLocation?.lat)?userEnteredLocation.lat:userLocation?.lat}})}
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
                <TouchableOpacity style={styles.bookbtn} onPress={()=>navigate('InstructerDetail',{...item,vehicleType:vehicleType,selloc:{long:(showinput&&userEnteredLocation?.long)?userEnteredLocation.long:userLocation?.long, lat:(showinput&&userEnteredLocation?.lat)?userEnteredLocation.lat:userLocation?.lat}})}>
                  <Text style={styles.booktxt}>Details</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={()=>navigate('InstructerDetail',item)}
                >
                  <Text style={styles.viwdetxt}>View Details</Text>
                  <RightArrowIcon height={15} width={15} />
                </TouchableOpacity> */}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noinsttxt}>No Instructor Available</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.shdbtn} onPress={()=>navigate("Schedule")}>
        <Text style={styles.shdbtntxt}>Schedule session for later</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

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
    marginTop: hp(0.3),
  },
  headtxt2: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: wp(5),
    marginTop: hp(1),
    marginBottom: hp(0.5),
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
  carcov: {
    height: hp(12),
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
    height: hp(30),
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
    bottom: 75,
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
  textInput:{
    backgroundColor:Constants.customgrey4,
    borderRadius:10,
    marginTop:8
  }
});
