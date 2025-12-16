import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState} from 'react';
import moment from 'moment';
import { BackIcon, Notification2Icon } from '../../../Theme';
import { goBack } from '../../../utils/navigationRef';
import { useDispatch } from 'react-redux';
import { getNotification, } from '../../../redux/notification/notificationAction'
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { useTranslation } from 'react-i18next';

const Notification = props => {
  const { t } = useTranslation();
  const [notification, setnotification] = useState([]);
  const [page, setPage] = useState(1);
  const [curentData, setCurrentData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getNotifications(1);

  }, []);
  const getNotifications = p => {
      setPage(p);
      dispatch(getNotification(p))
        .unwrap()
        .then((res) => {
        setCurrentData(res);
        if (p === 1) {
          setnotification(res);
        } else {
          setnotification([...notification, ...res]);
        }
        })
        .catch((error) => {
          console.error("getnotification failed:", error);
        });
  };
  const fetchNextPage = () => {
    if (curentData.length === 20) {
      getNotifications(page + 1);
    }
  };
  return (
    <View style={[styles.container]}>
      <View style={styles.rowbtn}>
        <TouchableOpacity style={styles.backcov} onPress={() => goBack()}>
          <BackIcon color={Constants.black}/>
        </TouchableOpacity>
        <Text style={styles.headtxt}>{t("Notification")}</Text>
        <View></View>
      </View>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <FlatList
          data={notification}
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
                {t("No Notification")}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          renderItem={({item,index}) => (
            <View style={[styles.box,{marginBottom:notification?.length-1===index?110:0}]}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.iconcov}>
                  <Notification2Icon
                    height={20}
                    width={20}
                    color={Constants.black}
                  />
                </View>
              </View>
              <View style={styles.notitxt}>
                <Text style={styles.toptxt1}>{t(item.title)}</Text>
                <Text style={[styles.txtm2]}>{t(item.description)}</Text>
                <Text style={styles.toptxt2}>
                  {moment(item.createdAt).format('DD MMM, hh:mm A')}
                </Text>
              </View>
            </View>
          )}
          onEndReached={() => {
            if (notification && notification.length > 0) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.05}
        />
      </View>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    // padding: 20,
  },
  headtxt: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  rowbtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  backcov: {
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.customgrey4,
  },
  iconcov: {
    backgroundColor: '#F5F5FF',
    borderRadius: 20,
    padding: 10,
  },
  box: {
    flexDirection: 'row',
    alignItems:'center',
    paddingRight: 20,
    marginTop: 15,
    backgroundColor:Constants.light_blue2,
    padding:10,
    borderRadius:7
  },
  toptxt1: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
  },
  toptxt2: {
    color: Constants.black,
    fontSize: 12,
    fontFamily: FONTS.Regular,
    alignSelf: 'flex-end',
    marginRight:5
  },
  txtm2: {
    color: Constants.customgrey,
    fontSize: 14,
    fontFamily: FONTS.Regular,
  },
  notitxt: {
    marginLeft: 10,
    width: '90%',
  },
});
