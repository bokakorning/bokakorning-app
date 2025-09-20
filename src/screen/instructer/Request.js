import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import InstructerHeader from '../../Assets/Component/InstructerHeader'
import CuurentLocation from '../../Assets/Component/CuurentLocation'
import Constants, { FONTS } from '../../Assets/Helpers/constant'
import { updateInstLocation } from '../../../redux/location/locationAction'
import { useDispatch, useSelector } from 'react-redux'
import RequestCurrentLocation from '../../Assets/Component/RequestCurrentLocation'
import { getInstructerReqs, updateInstructerReqs } from '../../../redux/booking/bookingAction'
import moment from 'moment'

const Request = () => {
  const dispatch = useDispatch();
  const loginuser = useSelector(state => state.auth.loginuser);
  const [startupdateloc, setStartupdateloc] = useState(false);
  const [reqlist, setreqList] = useState([]);
  const intervalRef = useRef(null);
  useEffect(() => {
      {loginuser&&RequestCurrentLocation(dispatch,loginuser);}
    }, [loginuser]);

  useEffect(() => {
    setStartupdateloc(true);
    getInstructerReqscall()
  }, []);

  useEffect(() => {
    if (startupdateloc) {
      console.log("Starting location tracking...");
      intervalRef.current = setInterval(() => {
        updateTrackLocation();
      }, 30000);
    }

    return () => {
      console.log("Cleaning up interval...");
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startupdateloc]);

  const updateTrackLocation = () => {
    CuurentLocation((res) => {
      const data = {
        track: {
          type: "Point",
          coordinates: [res.coords.longitude, res.coords.latitude],
        },
      };

      dispatch(updateInstLocation(data))
        .unwrap()
        .then(() => {
          console.log("Location updated successfully");
        })
        .catch((error) => {
          console.error("Update location failed:", error);
          if (intervalRef.current) clearInterval(intervalRef.current);
        });
    });
  };
  const getInstructerReqscall = () => {
      dispatch(getInstructerReqs())
        .unwrap()
        .then(data => {
          console.log('data', data);
          setreqList(data);
        })
        .catch(error => {
          console.error('Instructer req failed:', error);
        });
    };
  const updatebookingreq = (id,status) => {
    const body={
      status:status,
      id:id
    }
    console.log('body', body);
      dispatch(updateInstructerReqs(body))
        .unwrap()
        .then(data => {
          console.log('data', data);
          getInstructerReqscall()
        })
        .catch(error => {
          console.error('Instructer req failed:', error);
        });
    };
  return (
    <View style={styles.container}>
      <InstructerHeader item={"Lesson Request"} showback={false}/>
      <FlatList 
      data={reqlist}
      style={{marginBottom:70}}
      showsVerticalScrollIndicator={false}
      renderItem={({item,index})=><View style={[styles.card,{marginTop:index+1===1?15:0}]}>
        <Text style={styles.boxtxt}>Session Request From {item?.user?.name}</Text>
        <Text style={styles.boxtxt}>{moment(item?.date).format('dddd, DD MMMM')}</Text>
        <Text style={styles.boxtxt}>At {item?.selectedTime}</Text>
        <Text style={styles.boxtxt}>{item?.pickup_address}</Text>
        <View style={styles.btncov}>
          <TouchableOpacity style={[styles.btn,{backgroundColor:'#B5FC7F'}]} onPress={()=>updatebookingreq(item?._id,"accepted")}><Text style={styles.boxtxt2}>Accept</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.btn,{backgroundColor:'#FFA6A6'}]} onPress={()=>updatebookingreq(item?._id,"cancel")}><Text style={styles.boxtxt2}>Decline</Text></TouchableOpacity>
          </View>
      </View>
      }/>
    </View>
  )
}

export default Request

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
  }
})