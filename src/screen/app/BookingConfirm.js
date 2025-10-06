import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import LinearGradient from 'react-native-linear-gradient';
import { TikIcon } from '../../../Theme';
import { hp, wp } from '../../../utils/responsiveScreen';
import moment from 'moment';
import { reset } from '../../../utils/navigationRef';

const BookingConfirm = props => {
  const data = props?.route?.params;
  console.log('data', data);
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={['#4EB0CF', '#FFFFFF', '#FFFFFF', '#4EB0CF']}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.container}
    >
      <View style={styles.buttompart}>
        <TikIcon height={120} width={120} style={{ marginTop: hp(13) }} />
        <Text style={styles.boktxt}>Booking Confirmed</Text>
        <View style={styles.box}>
            <View style={styles.frow}>
                <Text style={styles.boxtoptxt}>{moment(new Date).format('ddddd')},{data?.selectedTime}</Text>
                <Text style={styles.boxtoptxt}>Session Duration: 60 Mins</Text>
            </View>
            <View style={styles.horline}></View>
            <View style={[styles.frow,{marginVertical:15}]}>
                <Text style={styles.boxbuttxt}>Driving session with {data?.name}</Text>
                <Image source={{uri:data?.image}} style={{height:50,width:50,borderRadius:25}} />
            </View>
        </View>
        <TouchableOpacity
                  style={styles.shdbtn}
                  onPress={() =>reset("App")}
                >
                  <Text style={styles.shdbtntxt}>
                    Back to Home
                  </Text>
                </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default BookingConfirm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    padding: Platform.OS==='ios'?0:20,
  },
  buttompart: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boktxt: {
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
    color: Constants.custom_blue,
    marginTop: 15,
  },
  boxtoptxt: {
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
  boxbuttxt: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
  frow:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginVertical:10
  },
  horline:{
    height:1,
    backgroundColor:Constants.black,
    borderRadius:5
  },
  box:{
    borderWidth:3.5,
    borderColor:Constants.black,
    padding:10,
    borderRadius:15,
    width:Platform.OS==='ios'?'90%':'100%',
    marginTop:30
  },
   shdbtn: {
    backgroundColor: Constants.custom_blue,
    borderRadius: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(90),
    alignSelf: 'center',
    marginTop:50
  },
  shdbtntxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  },
});
