import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import InstructerHeader from '../../Assets/Component/InstructerHeader'
import Constants, { FONTS } from '../../Assets/Helpers/constant'
import { useDispatch, useSelector } from 'react-redux'
import { getAccepInstructerReqs } from '../../../redux/booking/bookingAction'
import moment from 'moment'
import { useIsFocused } from '@react-navigation/native'
import { RightArrowIcon } from '../../../Theme'
import { navigate } from '../../../utils/navigationRef'
import { useTranslation } from 'react-i18next'

const MyBookings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [reqlist, setreqList] = useState([]);
const IsFocused = useIsFocused();
  useEffect(() => {
    if (IsFocused) {
      getInstructerReqscall()
    }
  }, [IsFocused]);

  const getInstructerReqscall = () => {
      dispatch(getAccepInstructerReqs())
        .unwrap()
        .then(data => {
          console.log('data', data);
          setreqList(data);
          setRefreshing(false)
        })
        .catch(error => {
          console.error('Instructer req failed:', error);
        });
    };
      const [refreshing, setRefreshing] = useState(false);
      const onRefresh = useCallback(() => {
        setRefreshing(true);
        getInstructerReqscall()
      }, []);
  return (
    <View style={styles.container}>
      <InstructerHeader item={t("Accepted Request")} showback={false}/>
      <FlatList 
      data={reqlist}
      style={{marginBottom:70}}
      showsVerticalScrollIndicator={false}
      renderItem={({item,index})=><View style={[styles.card,{marginTop:index+1===1?15:0}]}>
        <Text style={styles.boxtxt}>{t("Session Request From")} {item?.user?.name}</Text>
        <Text style={styles.boxtxt}>{moment(item?.sheduleDate?item?.sheduleDate:item?.date).format('dddd, DD MMMM')}</Text>
        <Text style={styles.boxtxt}>{t("At")} {item?.selectedTime}</Text>
        <Text style={styles.boxtxt}>{item?.pickup_address}</Text>
        <TouchableOpacity
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                          onPress={()=>navigate('BookingDetail',item)}
                        >
                          <Text style={styles.viwdetxt}>{t("Details")}</Text>
                          <RightArrowIcon height={18} width={18} color={Constants.black}/>
                        </TouchableOpacity>
      </View>
      }
      ListEmptyComponent={() => (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: Dimensions.get('window').height - 200,
            }}>
            <Text
              style={{
                color: Constants.black,
                fontSize: 18,
                fontFamily: FONTS.Medium,
              }}>
              {t("No Request Available")}
            </Text>
          </View>
        )}
        refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }/>
    </View>
  )
}

export default MyBookings

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
  boxtxt2:{
    fontSize:14,
    color:Constants.black,
    fontFamily:FONTS.SemiBold
  },
  btncov:{
    flexDirection:'row',
    gap:10,
    alignSelf:'center',
    marginTop:10
  },
  btn:{
    width:'40%',
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    height:40
  },
  viwdetxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
})