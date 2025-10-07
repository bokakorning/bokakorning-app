import {
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import InstructerHeader from '../../Assets/Component/InstructerHeader';
import CuurentLocation from '../../Assets/Component/CuurentLocation';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { updateInstLocation } from '../../../redux/location/locationAction';
import { useDispatch, useSelector } from 'react-redux';
import RequestCurrentLocation from '../../Assets/Component/RequestCurrentLocation';
import {
  getInstructerReqs,
  updateInstructerReqs,
} from '../../../redux/booking/bookingAction';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';

const Request = () => {
  const dispatch = useDispatch();
  const loginuser = useSelector(state => state.auth.loginuser);
  const [startupdateloc, setStartupdateloc] = useState(false);
  const [modelvsible, setmodelvsible] = useState(false);
  const [reqtype, setreqtype] = useState('');
  const [reqid, setreqid] = useState('');
  const [reqlist, setreqList] = useState([]);
  const intervalRef = useRef(null);
  const IsFocused = useIsFocused();
  useEffect(() => {
    {
      loginuser && RequestCurrentLocation(dispatch, loginuser);
    }
  }, [loginuser]);

  useEffect(() => {
    setStartupdateloc(true);
    getInstructerReqscall();
  }, []);

  useEffect(() => {
    if (startupdateloc) {
      console.log('Starting location tracking...');
      intervalRef.current = setInterval(() => {
        updateTrackLocation();
      }, 30000);
    }

    return () => {
      console.log('Cleaning up interval...');
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startupdateloc]);

  const updateTrackLocation = () => {
    CuurentLocation(res => {
      const data = {
        track: {
          type: 'Point',
          coordinates: [res.coords.longitude, res.coords.latitude],
        },
      };

      dispatch(updateInstLocation(data))
        .unwrap()
        .then(() => {
          console.log('Location updated successfully');
        })
        .catch(error => {
          console.error('Update location failed:', error);
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
  const updatebookingreq = (id, status) => {
    const body = {
      status: status,
      id: id,
    };
    console.log('body', body);
    dispatch(updateInstructerReqs(body))
      .unwrap()
      .then(data => {
        console.log('data', data);
        getInstructerReqscall();
      })
      .catch(error => {
        console.error('Instructer req failed:', error);
      });
  };
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getInstructerReqscall();
  }, []);
  return (
    <View style={styles.container}>
      <InstructerHeader item={'Lesson Request'} showback={false} />
      <FlatList
        data={reqlist}
        style={{ marginBottom: 70 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={[styles.card, { marginTop: index + 1 === 1 ? 15 : 0 }]}>
            <Text style={styles.boxtxt}>
              Session Request From {item?.user?.name}
            </Text>
            <Text style={styles.boxtxt}>
              {moment(item?.date).format('dddd, DD MMMM')}
            </Text>
            <Text style={styles.boxtxt}>At {item?.selectedTime}</Text>
            <Text style={styles.boxtxt}>{item?.pickup_address}</Text>
            <View style={styles.btncov}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#B5FC7F' }]}
                onPress={() => {setreqtype('accepted'),setreqid(item?._id),setmodelvsible(true)}}
              >
                <Text style={styles.boxtxt2}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#FFA6A6' }]}
                onPress={() => {setreqtype('cancel'),setreqid(item?._id),setmodelvsible(true)}}
              >
                <Text style={styles.boxtxt2}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: Dimensions.get('window').height - 200,
            }}
          >
            <Text
              style={{
                color: Constants.black,
                fontSize: 18,
                fontFamily: FONTS.Medium,
              }}
            >
              No Request Available
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
                    if (reqtype==='cancel') {
                      updatebookingreq(reqid, 'cancel')
                    } else{
                      updatebookingreq(reqid, 'accepted')
                    }
                    setmodelvsible(false);
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

export default Request;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
  },
  card: {
    backgroundColor: Constants.light_blue3,
    borderRadius: 10,
    padding: 10,
    boxShadow: '0px 2px 4px 0.01px grey',
    marginBottom: 15,
    width: '90%',
    alignSelf: 'center',
  },
  boxtxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    marginVertical: 5,
  },
  boxtxt2: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  btncov: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  btn: {
    width: '40%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
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
