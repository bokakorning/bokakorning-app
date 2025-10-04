import {
  Animated,
  Easing,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { mapStyle } from '../../../Theme/MapStyle';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Constants, { FONTS, Googlekey } from '../../Assets/Helpers/constant';
import MapViewDirections from 'react-native-maps-directions';
import { CallIcon, LocationIcon } from '../../../Theme';
import moment from 'moment';
import { finishSession } from '../../../redux/booking/bookingAction';
import { goBack } from '../../../utils/navigationRef';

const BookingDetail = props => {
  const data = props?.route?.params;
  //   console.log('data',data)
  const dispatch = useDispatch();
  const [modelvsible, setmodelvsible] = useState(false);
  const userLocation = useSelector(state => state.location.userLocation);
  const mapRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const animatedValue = new Animated.Value(0);
  useEffect(() => {
    if (routeCoordinates.length > 0) {
      animateRoute();
    }
  }, [routeCoordinates]);
  const animateRoute = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };
  const finishsession = () => {
      const body={
        status:'complete',
        id:data?._id
      }
      console.log('body', body);
        dispatch(finishSession(body))
          .unwrap()
          .then(data => {
            goBack()
          })
          .catch(error => {
            console.error('Instructer req failed:', error);
          });
      };
  return (
    <View style={styles.container}>
      <View style={{ height: '65%' }}>
        {userLocation?.long && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            customMapStyle={mapStyle}
            region={{
              latitude: userLocation?.lat,
              longitude: userLocation?.long,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
            showsUserLocation={true}
          >
            {userLocation?.long && (
              <Marker
                coordinate={{
                  latitude: userLocation?.lat,
                  longitude: userLocation?.long,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.customMarker}>
                  <View style={styles.innerCircle} />
                </View>
              </Marker>
            )}
            {data?.user_location?.coordinates.length > 0 && (
              <Marker
                coordinate={{
                  latitude: data?.user_location?.coordinates[1],
                  longitude: data?.user_location?.coordinates[0],
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.customMarker}>
                  <View style={styles.innerCircle} />
                </View>
              </Marker>
            )}
            {data?.user_location?.coordinates.length > 0 && (
              <Marker
                zIndex={8}
                draggable={false}
                coordinate={{
                  latitude: data?.user_location?.coordinates[1],
                  longitude: data?.user_location?.coordinates[0],
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.customMarker}>
                  <View style={styles.innerCircle} />
                </View>
              </Marker>
            )}
            {userLocation?.long &&
              data?.user_location?.coordinates.length > 0 && (
                <MapViewDirections
                  // waypoints={routeCoordinates.slice(0,25)}
                  origin={{
                    latitude: userLocation?.lat,
                    longitude: userLocation?.long,
                  }}
                  destination={{
                    latitude: data?.user_location?.coordinates[1],
                    longitude: data?.user_location?.coordinates[0],
                  }}
                  onReady={result => {
                    const edgePadding = {
                      top: 50,
                      right: 50,
                      bottom: 50,
                      left: 50,
                    };
                    console.log('result', result);
                    mapRef.current.fitToCoordinates(result.coordinates, {
                      edgePadding,
                      animated: true,
                    });
                    //  mapRef.current.animateToRegion( result.coordinates, 1000)
                    setRouteCoordinates(result.coordinates);
                  }}
                  apikey={Googlekey}
                  strokeWidth={4}
                  strokeColor="#00bfff"
                  //  strokeColors={['#4782F8']}
                  optimizeWaypoints={true}
                />
              )}
          </MapView>
        )}
      </View>
      <Text style={[styles.txtcov, { marginTop: 30 }]}>
        <Text style={styles.drivnametxt}>Date: </Text>
        <Text style={styles.boxtxt}>
          {moment(data?.date).format('dddd, DD MMMM')}
        </Text>
      </Text>
      <Text style={styles.txtcov}>
        <Text style={styles.drivnametxt}>Time: </Text>
        <Text style={styles.boxtxt}>At {data?.selectedTime}</Text>
      </Text>
      <Text style={styles.txtcov}>
        <Text style={styles.drivnametxt}>Pickup Address: </Text>
        <Text style={styles.boxtxt}>{data?.pickup_address}</Text>
      </Text>
      <View style={styles.butcov}>
        <TouchableOpacity
          style={styles.contactopt}
          onPress={() => Linking.openURL(`tel:${data?.user?.phone}`)}
        >
          <CallIcon color={Constants.custom_blue} height={20} width={20} />
          <Text style={styles.othrttxt2}>Contact {data?.user?.name}</Text>
        </TouchableOpacity>

        {userLocation?.long && data?.user_location?.coordinates?.length > 0 && (
          <TouchableOpacity
            style={styles.contactopt}
            onPress={() => {
              let origin = `${data?.user_location?.coordinates[0]},${data?.user_location?.coordinates[1]}`;
              let destination = `${userLocation?.lat},${userLocation?.long}`;
              Linking.openURL(
                `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`,
              );
            }}
          >
            <LocationIcon
              color={Constants.custom_blue}
              height={20}
              width={20}
            />
            <Text style={styles.othrttxt2}>Go to google map</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.shdbtn}
        onPress={() => setmodelvsible(true)}
      >
        <Text style={styles.shdbtntxt}>Schedule session for later</Text>
      </TouchableOpacity>
      <Modal
        animationType="none"
        transparent={true}
        visible={modelvsible}
        onRequestClose={() => {
          setmodelvsible(!modelvsible);
        }}>
        <View style={styles.centeredView2}>
          <View style={styles.modalView2}>
            <Text style={styles.alrt}>Alert !</Text>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}>
              <Text style={styles.textStyle}>
                Are you sure you want to finish this session !
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setmodelvsible(false);
                  }}
                  style={styles.cancelButtonStyle}>
                  <Text
                    style={[
                      styles.modalText,
                      {color: Constants.custom_yellow},
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                    finishsession(), setmodelvsible(false);
                  }}>
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookingDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: '#00bfff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  othrttxt2: {
    color: Constants.custom_blue,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  contactopt: {
    borderWidth: 1.5,
    borderColor: Constants.custom_blue,
    borderRadius: 10,
    flexDirection: 'row',
    height: 55,
    width: '48%',
    justifyContent: 'center',
    // flex:1,
    alignItems: 'center',
    alignSelf: 'center',
    gap: 10,
  },
  butcov: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'space-evenly',
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  shdbtn: {
    backgroundColor: Constants.custom_blue,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  shdbtntxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  },
  drivnametxt: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
  },
  boxtxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  txtcov: {
    marginTop: 7,
    marginHorizontal: 20,
  },
    //////Model////////

  textStyle: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Regular,
    fontSize: 16,
    margin: 20,
    marginBottom: 10,
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 3,
  },
  alrt: {
    color: Constants.black,
    fontSize: 18,
    fontFamily: FONTS.Medium,
    // backgroundColor: 'red',
    width: '100%',
    textAlign: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: Constants.customgrey2,
    paddingBottom: 20,
  },
  modalText: {
    color: Constants.white,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    fontSize: 14,
  },
  centeredView2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView2: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    width: '90%',
  },
  cancelButtonStyle: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginRight: 10,
    borderColor: Constants.custom_blue,
    borderWidth: 1,
    borderRadius: 10,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.custom_blue,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
