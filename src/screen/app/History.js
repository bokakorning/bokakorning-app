import { Animated, Dimensions, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import UserHeader from '../../Assets/Component/UserHeader'
import Constants, { FONTS } from '../../Assets/Helpers/constant'
import { useDispatch } from 'react-redux'
import { getUserBookings } from '../../../redux/booking/bookingAction'
import moment from 'moment'
import { RightArrowIcon } from '../../../Theme'
import { navigate } from '../../../utils/navigationRef'
import { useIsFocused } from '@react-navigation/native'

const History = () => {
  const dispatch = useDispatch();
  const [bookinglist, setbookingList] = useState([]);
  const [selOpt, setselOpt] = useState("upcomming");
  const IsFocused = useIsFocused();

  useEffect(() => {
    {IsFocused&&getUserBooking(),setselOpt('upcomming')}
  }, [IsFocused]);

  const getUserBooking = (status) => {
      dispatch(getUserBookings(status))
        .unwrap()
        .then(data => {
          console.log('data', data);
          setbookingList(data);
        })
        .catch(error => {
          console.error('User booking failed:', error);
        });
    };
    const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setselOpt("upcomming")
    getUserBooking()
  }, []);
      const [layouts, setLayouts] = useState({}); // store measurements

  const underlineX = useRef(new Animated.Value(0)).current;
  const underlineW = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (layouts[selOpt]) {
      Animated.parallel([
        Animated.spring(underlineX, {
          toValue: layouts[selOpt].x,
          useNativeDriver: false,
        }),
        Animated.spring(underlineW, {
          toValue: layouts[selOpt].width,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [selOpt, layouts]);

  const options = [
    { key: "upcomming", label: "Upcoming" },
    { key: "complete", label: "Completed" },
    { key: "cancel", label: "Cancelled" },
  ];
  return (
    <View style={styles.container}>
      <UserHeader item={"Lesson History"} showback={false}/>
      <View style={styles.optcov}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.key}
            activeOpacity={0.7}
            onPress={() => {setselOpt(opt.key),getUserBooking(opt.key)}}
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              setLayouts(prev => ({ ...prev, [opt.key]: { x, width } }));
            }}
          >
            <Text
              style={[
                styles.opttxt,
                selOpt === opt.key && {
                  color: Constants.custom_blue,
                }
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* underline */}
        {layouts[selOpt] && (
          <Animated.View
            style={[
              styles.underline,
              {
                left: underlineX,
                width: underlineW,
              },
            ]}
          />
        )}
      </View>
      <FlatList 
            data={bookinglist}
            style={{marginBottom:70}}
            showsVerticalScrollIndicator={false}
            renderItem={({item,index})=><View style={[styles.card,{marginTop:index+1===1?15:0}]}>
              <Text style={styles.boxtxt}>Session Request From {item?.user?.name}</Text>
              <Text style={styles.boxtxt}>{moment(item?.date).format('dddd, DD MMMM')}</Text>
              <Text style={styles.boxtxt}>At {item?.selectedTime}</Text>
              <View style={styles.frow}>
              <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={()=>navigate('AssignedInstructor',{...item?.instructer,type:item?.status!='cancel'?"show_invoice":null,booking_id:item?._id})}
                >
                  <Text style={styles.viwdetxt}>Details</Text>
                  <RightArrowIcon height={15} width={15} />
                </TouchableOpacity>
                 {item?.status==='cancel'&& <Text style={styles.booktxt} onPress={()=>navigate('ReBookInstructer',item)}>Book another instructer</Text>}
                  </View>
            </View>
            }
            ListEmptyComponent={() => (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: Dimensions.get('window').height - 300,
            }}>
            <Text
              style={{
                color: Constants.black,
                fontSize: 18,
                fontFamily: FONTS.Medium,
              }}>
              No Booking Available
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }/>
    </View>
  )
}

export default History

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:Constants.white
  },
  card:{
    backgroundColor:Constants.light_blue3,
    borderRadius:10,
    padding:10,
    boxShadow:'0px 2px 4px 0.01px grey',
    marginBottom:15,
    width:'90%',
    alignSelf:'center'
  },
  boxtxt:{
    fontSize:14,
    color:Constants.black,
    fontFamily:FONTS.SemiBold,
    marginVertical:5
  },
  opttxt:{
    fontSize:16,
    color:Constants.black,
    fontFamily:FONTS.SemiBold
  },
  optcov:{
    flexDirection:'row',
    gap:15,
    marginVertical:10,
    marginLeft:20,
    position:'relative',
  },
   underline:{
    position:'absolute',
    bottom:-4,
    height:2,
    backgroundColor: Constants.custom_blue,
    borderRadius: 2,
  },
  viwdetxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  booktxt: {
    fontSize: 14,
    color: Constants.custom_blue,
    fontFamily: FONTS.SemiBold,
  },
  frow:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
})