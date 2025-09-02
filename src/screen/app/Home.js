import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { LocationIcon, RightArrowIcon, SearchIcon } from '../../../Theme';
import { hp, wp } from '../../../utils/responsiveScreen';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { mapStyle } from '../../../Theme/MapStyle';

const Home = () => {
  const [vehicleType, setvehicleType] = useState('automatic');
  return (
    <View style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.topcov}>
        <View style={styles.toppart}>
          <Image
            source={
              // orderdetail?.seller_profile?.image
              //   ? {
              //       uri: `${orderdetail?.seller_profile?.image}`,
              //     }:
              require('../../Assets/Images/profile4.png')
            }
            style={styles.imgst}
          />
          <View>
            <Text style={styles.nametxt}>Regina Title</Text>
            <View style={styles.loccov}>
              <LocationIcon />
              <Text style={styles.loctxt} numberOfLines={1}>
                Sweden hsgvc hsgvcs hsgchs hsg ch shgcvs
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.iconcov}>
          <SearchIcon height={25} width={25} color={Constants.white} />
        </TouchableOpacity>
      </View>
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
            onPress={() => setvehicleType('automatic')}
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
            onPress={() => setvehicleType('manual')}
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
        <MapView
          style={styles.mapThumbnailView}
          provider={PROVIDER_GOOGLE}
          // ref={mapRef}
          customMapStyle={mapStyle}
          // region={location}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        ></MapView>
      </View>
      <Text style={styles.headtxt2}>Available Instructors</Text>
      {[1,2,3,4,5].map((item,index)=><View style={[styles.box,{marginBottom:[1,2,3,4,5].length===index+1?150:0}]} key={index}>
        <View style={styles.frow}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../../Assets/Images/profile4.png')}
              style={styles.proimg}
            />
            <Text style={styles.awatxt}>3 Miles Away</Text>
          </View>
          <View>
            <Text style={styles.drivtxt}>Ron</Text>
            <Text style={styles.drivinftxt}>Experience/Lesson Type</Text>
            <Text style={styles.drivtxt}>$150/h</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.bookbtn}>
            <Text style={styles.booktxt}>Book</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={styles.viwdetxt}>View Details</Text>
            <RightArrowIcon height={15} width={15}/>
          </TouchableOpacity>
        </View>
      </View>)}
    </ScrollView>
      <TouchableOpacity style={styles.shdbtn}>
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
    marginTop:10
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
    marginTop:hp(2),
    paddingVertical:5,
    marginBottom:5
  },
  frow: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  shdbtn:{
    backgroundColor:Constants.black,
    borderRadius:10,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    bottom:85,
    width:wp(90),
    alignSelf:'center'
  },
  shdbtntxt:{
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  }
});
