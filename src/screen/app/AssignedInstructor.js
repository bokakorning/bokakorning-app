import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { hp, wp } from '../../../utils/responsiveScreen';
import UserHeader from '../../Assets/Component/UserHeader'
import { InvoiceIcon } from '../../../Theme';
import RNBlobUtil from 'react-native-blob-util';
import { showToaster } from '../../../utils/toaster';
import { useDispatch } from 'react-redux';
import { setInvoiceLoading } from '../../../redux/location/locationSlice';

const AssignedInstructor = props => {
  const data = props?.route?.params;
  // console.log('data', data);
  const dispatch = useDispatch();
  const getinvoice = async () => {
  dispatch(setInvoiceLoading(true))
// const x = await AsyncStorage.getItem('LANG');
  const { DownloadDir, DocumentDir } = RNBlobUtil.fs.dirs;
  const filePath = `${
    Platform.OS === 'android' ? DownloadDir : DocumentDir
  }/invoice-${Date.now()}.pdf`;

  try {
    const res = await RNBlobUtil.config({
      fileCache: true,
      path: filePath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        title: 'Invoice',
        description: 'Downloading invoice...',
        mime: 'application/pdf',
        mediaScannable: true,
      },
    }).fetch(
      'GET',
      `http://192.168.0.187:3000/booking/generateInvoice?bookingId=${data?.booking_id}`
      // `https://api.bokakorning.online/booking/generateInvoice?bookingId=${data?._id}`
      // `https://api.chmp.world/v1/api/generateInvoice?orderId=${orderId}&lang=${lang}`
    );

    console.log('Invoice downloaded:', res.path());
    dispatch(setInvoiceLoading(false))
    showToaster('success',"Invoice downloaded successfully");
    // if (Platform.OS === 'ios') Linking.openURL(`file://${res.path()}`);
  } catch (err) {
    console.error('Error downloading invoice:', err);
  }
};
  return (
    <View style={styles.container}>
        <UserHeader item={"Instructor Detail"} showback={true}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding:20}}>
        <View style={styles.frow2}>
          <Text style={styles.instytxt}>
            {data?.transmission === 'Automatic'
              ? 'Auto-Car'
              : data?.transmission === 'Both'
              ? 'Auto & Manual'
              : 'Manual'}{' '}
            Instructor
          </Text>
        </View>
        <Image
          source={
            data?.image
              ? {
                  uri: `${data?.image}`,
                }
              : require('../../Assets/Images/profile4.png')
          }
          style={styles.proimg}
        />
        <Text style={styles.drivnametxt}>{data?.name}</Text>
        <Text style={styles.biotxt}>{data?.bio}</Text>
        <Text style={[styles.bactxt, { fontSize: 16 }]}>Vehicle:</Text>
        <Text style={{ marginTop: 7 }}>
          <Text style={styles.drivnametxt}>Vehicle: </Text>
          <Text style={styles.vehinam}>{data?.vehicle_model}</Text>
        </Text>
        <Text style={{ marginTop: 7 }}>
          <Text style={styles.drivnametxt}>Category: </Text>
          <Text style={styles.vehinam}>Car</Text>
        </Text>
        {data?.type==='show_invoice'&&<TouchableOpacity
              style={styles.contactopt}
              onPress={() =>
                getinvoice()
              }>
              <InvoiceIcon color={Constants.custom_blue} height={20} width={20} />
              <Text style={styles.othrttxt2}>
                Download Invoice
              </Text>
            </TouchableOpacity>}
      </ScrollView>
    </View>
  );
};

export default AssignedInstructor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    // padding: 20,
  },
  bactxt: {
    color: Constants.black,
    fontFamily: FONTS.Heavy,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  frow2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    marginTop: 10,
  },
  bactxt: {
    color: Constants.black,
    fontFamily: FONTS.Heavy,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  instytxt: {
    color: Constants.black,
    fontFamily: FONTS.Heavy,
    fontSize: 18,
    width: '65%',
  },
  proimg: {
    height: hp(35),
    width: '100%',
    borderRadius: 30,
    marginVertical: 20,
  },
  drivnametxt: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    marginVertical: 10,
  },
  biotxt: {
    color: Constants.black,
    fontFamily: FONTS.Medium,
    fontSize: 14,
    marginBottom: 30,
  },
  vehinam: {
    color: Constants.black,
    fontFamily: FONTS.Medium,
    fontSize: 14,
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
    width: '100%',
    justifyContent: 'center',
    // flex:1,
    alignItems: 'center',
    alignSelf: 'center',
    gap: 15,
    marginTop:50,
    marginBottom:90
  },
});
