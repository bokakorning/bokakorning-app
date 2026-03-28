import {
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { createRef, useEffect, useRef, useState } from 'react';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { BackIcon, CalenderIcon, ClockIcon, CrossIcon, PinIcon, StripeLabelIcon, StripeLogoIcon, SwishLogoIcon, } from '../../../Theme';
import { hp, wp } from '../../../utils/responsiveScreen';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { mapStyle } from '../../../Theme/MapStyle';
import { useDispatch, useSelector } from 'react-redux';
import { goBack, navigate } from '../../../utils/navigationRef';
import LocationDropdown from '../../Assets/Component/LocationDropdown'
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from 'react-native-wheel-pick';
import ActionSheet from 'react-native-actions-sheet';
import { showToaster } from '../../../utils/toaster';
import { useTranslation } from 'react-i18next';
import { useStripe } from '@stripe/stripe-react-native';
import { createBooking, postStripe } from '../../../redux/payment/paymentAction';

const Schedule = () => {
  const { t } = useTranslation();
  const {initPaymentSheet, presentPaymentSheet, confirmPayment} = useStripe();
  const [vehicleType, setvehicleType] = useState('automatic');
  const [sheduleDate, setSheduleDate] = useState();
  const [dateModel, setDateModel] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState(null); // null | 'stripe' | 'swish'

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const userAddress = useSelector(state => state.location.userAddress);
  const userLocation = useSelector(state => state.location.userLocation);
  const userEnteredLocation = useSelector(state => state.location.userEnteredLocation);
  const userEnteredAddress = useSelector(state => state.location.userEnteredAddress);
  const rateData = useSelector(state => state.transaction.rateData);
  const rate_per_hour = user?.firstbook
  ? rateData?.per_hour_hour
  : Math.round(rateData?.per_hour_hour * (1 - 0.386));
  const timeRef = createRef();
  const paymentRef = createRef();
  const [selectedTime, setSelectedTime] = useState();
    const [times, setTimes] = useState();
    useEffect(() => {
      const generatedSlots = generateTimeSlots();
      setTimes(generatedSlots);
      // setSelectedTime(generatedSlots[0]);
    }, []);

const onDateChange=(event,selectDate)=>{
  if (event.type === "dismissed") {
    // User cancelled → do not update date
    setDateModel(false);
    return;
  }
setSheduleDate(selectDate)
setDateModel(false)
}
function generateTimeSlots(start = '07:00', end = '22:00', gapMinutes = 30) {
   const now = new Date();
   const [startHour, startMin] = start.split(':').map(Number);
   const [endHour, endMin] = end.split(':').map(Number);

   const startTime = new Date();
   startTime.setHours(startHour, startMin, 0, 0);

   const endTime = new Date();
   endTime.setHours(endHour, endMin, 0, 0);

   const slots = [];
   let current = new Date(startTime);

   while (current <= endTime) {
     // Only push slots that are in the future (>= now)
     // if (current >= now) {
     slots.push(
       current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
     );
     // }
     current = new Date(current.getTime() + gapMinutes * 60000); // add 30 min
   }

   return slots;
 }
 const PackageIcon = () => {
   return (
     <TouchableOpacity style={{ height: 60, width: 60, position: 'relative' }}>
         <PinIcon height={50} width={50}  />
     </TouchableOpacity>
   );
 };
// const submit = async () => {
//   if (!selectedTime) {
//     showToaster('error',"Please select the time");
//     return
//   }
//   if (!sheduleDate) {
//     showToaster('error',"Please select the date");
//     return
//   }
//     const body={
//     selectedTime: selectedTime,
//     sheduleDate: sheduleDate,
//     sheduleSeesion:true,
//     payment_mode:"online",
//     user_location: {
//         type: 'Point',
//         coordinates: [userEnteredLocation?.long?userEnteredLocation.long:userLocation?.long, userEnteredLocation?.lat?userEnteredLocation.lat:userLocation?.lat],
//       },
//     pickup_address: userEnteredAddress?userEnteredAddress:userAddress
//     }
//       dispatch(createBooking(body))
//         .unwrap()
//         .then(res => {
//           console.log('res', res);
//           navigate("App",{screen:"History"})
//         })
//         .catch(error => {
//           console.error('Booking failed:', error);
//         });
//     };

    const [showPaymentModal, setShowPaymentModal] = useState(false);
      const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 sec
      const countdownRef = useRef(null);
      const expiryRef = useRef(null);
    
    const pollInterval = useRef(null);
      const startSwishPayment = async () => {
        try {
      console.log("Initiating Swish payment...");
    
      const body={
        selectedTime: selectedTime,
    sheduleDate: sheduleDate,
    sheduleSeesion:true,
    payment_mode:"swish",
             user_location: {
        type: 'Point',
        coordinates: [userEnteredLocation?.long?userEnteredLocation.long:userLocation?.long, userEnteredLocation?.lat?userEnteredLocation.lat:userLocation?.lat],
      },
    pickup_address: userEnteredAddress?userEnteredAddress:userAddress,
        amount: rate_per_hour,
        message: 'Order payment',
        user:user?._id
        }
      
      const res = await fetch('https://api.bokakorning.online/payment/createPaymentRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
     console.log('Payment request response status:', res);
      const res2 = await res.json();
      console.log('Payment request created:', res2);
    
      const paymentToken = res2?.data?.token; // your instructionUUID
      const paymentId = res2?.data?.id; // your instructionUUID
    
      const callbackUrl = encodeURIComponent(
        `BokaKorning://payment-result?ref=${paymentId}`
      );
    
      startCountdown();
      // Start polling
      pollPaymentStatus(paymentId);
      
      // Token IS the payment request ID — no getAuthToken() needed
      // const swishUrl = `swish://paymentrequest?token=${paymentId}`;
    
      // const callbackUrl = `https://myfrontend.com/receipt?ref=${paymentRequest.id}`;
    const swishUrl = `swish://paymentrequest?token=${paymentToken}&callbackurl=${callbackUrl}`;
    
      console.log("swishUrl", swishUrl);
    
    try {
      setTimeout(() => {
        Linking.openURL(swishUrl);
      }, 1000); // slight delay to ensure modal is shown before switching apps
    } catch (err) {
      Alert.alert(
        "Swish not installed",
        "Download Swish to complete payment?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Download",
            onPress: () => {
              const storeUrl =
                Platform.OS === 'ios'
                  ? 'https://apps.apple.com/se/app/swish-payments/id563204724'
                  : 'https://play.google.com/store/apps/details?id=se.bankgirot.swish';
    
              Linking.openURL(storeUrl);
            }
          }
        ]
      );
    }
    
    } catch (err) {
        console.log('Error in startSwishPayment:', err.message); // add this
      }
    };
    
    const pollPaymentStatus = (paymentId) => {
      console.log('Polling payment status for:', paymentId);
    
      // Clear any existing interval first
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    
      let attempts = 0;
      const MAX_ATTEMPTS = 100; // stop after 300 seconds (30 * 2000ms)
    
      pollInterval.current = setInterval(async () => {
        try {
          attempts++;
    
          // Use same base URL where payment was created
          const res = await fetch(
            `https://api.bokakorning.online/payment/paymentStatus/${paymentId}`
          );
    
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            console.log('Non-JSON response from status API:', text);
            return;
          }
    
          const resdata = await res.json();
          console.log('Payment status:', resdata);
    
          if (resdata?.data?.payment_status === 'PAID') {
            clearInterval(pollInterval.current);
            clearInterval(countdownRef.current);
            setShowPaymentModal(false);
            navigate("App",{screen:"History"})
            Alert.alert("Success", "Payment completed!");
          }
    
          if (resdata?.data?.payment_status === 'DECLINED' || resdata?.data?.payment_status === 'ERROR') {
      clearInterval(pollInterval.current);
      clearInterval(countdownRef.current);
    
      setShowPaymentModal(false);
    
      Alert.alert("Failed", "Payment failed.");
    }
    
    
          // Stop polling after max attempts
          if (attempts >= MAX_ATTEMPTS) {
            clearInterval(pollInterval.current);
            Alert.alert("Timeout", "Payment status unknown. Please check your Swish app.");
          }
    
        } catch (err) {
          console.log('Polling error:', err.message);
        }
      }, 3000);
    };
    
    // Clean up interval when component unmounts
    useEffect(() => {
      return () => {
        if (pollInterval.current) {
          clearInterval(pollInterval.current);
        }
      };
    }, []);
    
    useEffect(() => {
      return () => {
        if (pollInterval.current) {
          clearInterval(pollInterval.current);
        }
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
      };
    }, []);
    
    useEffect(() => {
      const sub = Linking.addEventListener('url', ({ url }) => {
        console.log("Returned from Swish:", url);
        // User came back from Swish app - polling will handle the status
      });
      return () => sub.remove();
    }, []);
    
    const startCountdown = () => {
      const expiryTime = Date.now() + 300 * 1000; // 5 minutes from now
      expiryRef.current = expiryTime;
    
      setShowPaymentModal(true);
      updateRemainingTime(); // immediately calculate
    
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    
      countdownRef.current = setInterval(updateRemainingTime, 1000);
    };
    
    const updateRemainingTime = () => {
      const now = Date.now();
      const remaining = Math.max(
        Math.floor((expiryRef.current - now) / 1000),
        0
      );
    
      setTimeLeft(remaining);
    
      if (remaining <= 0) {
        clearInterval(countdownRef.current);
        clearInterval(pollInterval.current);
        setShowPaymentModal(false);
        Alert.alert("Timeout", "Payment time expired. Please try again.");
      }
    };

    const startStripePayment = () => {
      if (!selectedTime) {
    showToaster('error',"Please select the time");
    return
  }
  if (!sheduleDate) {
    showToaster('error',"Please select the date");
    return
  }
  if (Number(rate_per_hour)<3) {
    showToaster('error',"Price must be at least 3 SEK")
    return;
  }
        dispatch(postStripe({price: Number(rate_per_hour), currency: 'sek', version: 1})).unwrap().then(
          async res => {
            console.log(res);
            const {error} = await initPaymentSheet({
              merchantDisplayName: 'BokaKorning',
              paymentIntentClientSecret: res.clientSecret,
              allowsDelayedPaymentMethods: true,
              returnURL: "BokaKorning://stripe-redirect",
            });
            if (error) {
              console.log(error);
              return;
            }
            setTimeout(async () => {
            const { error: paymentError } = await presentPaymentSheet();
            if (paymentError) {
              console.log(`Error code: ${paymentError.code}`, paymentError.message);
              setModalVisible(true)
            } else {
              const body={
        paymentid:res.clientSecret,
        selectedTime: selectedTime,
        sheduleDate: sheduleDate,
        sheduleSeesion:true,
        payment_mode:"swish",
        user_location: {
        type: 'Point',
        coordinates: [userEnteredLocation?.long?userEnteredLocation.long:userLocation?.long, userEnteredLocation?.lat?userEnteredLocation.lat:userLocation?.lat],
        },
        pickup_address: userEnteredAddress?userEnteredAddress:userAddress,
        amount: rate_per_hour,
        message: 'Order payment',
        user:user?._id,
        payment_status:'PAID'
        }

              dispatch(createBooking(body)).unwrap().then(()=>navigate("App",{screen:"History"}));
            }
          }, 100);
                },
                err => {
                  setLoading(false);
                  console.log(err);
                },
              );};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backcov} onPress={() => goBack()}>
          <BackIcon  color={Constants.black}/>
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        <Text style={styles.headtxt}>{t("Schedule session for later")} </Text>
        <Text style={styles.seltxt}>{t("Select your preferred vehicle")}</Text>
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
                setvehicleType('automatic')
              }}
            >
              <Image source={require('../../Assets/Images/smart-car.png')} style={{height:'50%',width:'65%'}}/>
              <Text style={styles.seltxt}>{t("Automatic Car")}</Text>
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
                setvehicleType('manual')
              }}
            >
              <Image source={require('../../Assets/Images/smart-car.png')} style={{height:'50%',width:'65%'}}/>
              <Text style={styles.seltxt}>{t("Manual Car")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.seltxt, { marginVertical: 10 }]}>
          {t("Select your pickup location")}
        </Text>
        <View style={styles.textInput}>
          <LocationDropdown
          />
          </View>
        <Text style={[styles.seltxt2, { marginVertical: 10 }]}>
          {t("Or find it on map")}
        </Text>
        <View style={styles.mapThumbnail}>
          {userLocation?.long&&<MapView
            style={styles.mapThumbnailView}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            region={{
              latitude: userEnteredLocation?.lat?userEnteredLocation.lat:userLocation?.lat,
              longitude: userEnteredLocation?.long?userEnteredLocation.long:userLocation?.long,
              latitudeDelta: 0.115,
              longitudeDelta: 0.1121,
            }}
          >
            {userLocation?.long && (
              <Marker
                zIndex={8}
                draggable={false}
                coordinate={{
                  latitude: userEnteredLocation?.lat?userEnteredLocation.lat:userLocation?.lat,
                  longitude: userEnteredLocation?.long?userEnteredLocation.long:userLocation?.long,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <PackageIcon />
              </Marker>
            )}
          </MapView>}
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-evenly',marginTop:30,marginBottom:100}}>
         <TouchableOpacity style={styles.actionButton} onPress={() => setDateModel(true)}>
            <CalenderIcon color={Constants.white}/>
            <Text style={styles.actionText}>{sheduleDate ? moment(sheduleDate).format('DD MMM') : t("Schedule Date")}</Text>
          </TouchableOpacity>
         <TouchableOpacity style={styles.actionButton} onPress={() => timeRef?.current.show()}>
            <ClockIcon color={Constants.white} height={17} width={17}/>
            <Text style={styles.actionText}>{selectedTime?selectedTime : t("Schedule Time")}</Text>
          </TouchableOpacity>
          </View>
      </ScrollView>
      {dateModel&&<DateTimePicker
        mode='date'
        textColor='black'
        minimumDate={new Date()}
        value={sheduleDate?sheduleDate:new Date()}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={onDateChange}
      />}
<ActionSheet
        ref={timeRef}
        closeOnTouchBackdrop={true}
        containerStyle={{ backgroundColor: Constants.white }}
      >
        <View
          style={styles.actshetcov}
        >
          <Text style={styles.sheetheadtxt}>
            {t("Pickup Time ")}
          </Text>
          <CrossIcon
            style={styles.popupcross}
            height={26}
            width={26}
            onPress={() => {timeRef.current.hide()}}
          />
        </View>
         <View style={styles.horline}></View>
          <View style={styles.timePickerView}>
            {times && times?.length > 0 && (
              <Picker
                textSize={20}
                textColor="#888"
                selectTextColor="#000000"
                isShowSelectLine={true}
                selectLineColor="#F3F4F8"
                selectLineSize={20}
                style={styles.timePickerStyle}
                selectedValue={selectedTime}
                pickerData={times}
                onValueChange={value => {
                  setSelectedTime(value);
                }}
              />
            )}
          </View>

        <View style={styles.horline}></View>
        <View>
        
        </View>

        <TouchableOpacity
          style={styles.shdbtn2}
          onPress={() => {
              timeRef.current.hide();
          }}
        >
          <Text style={styles.shdbtntxt}>
            {t("Confirm Time")}
          </Text>
        </TouchableOpacity>
      </ActionSheet>
      {(!dateModel||Platform.OS==='android')&&<TouchableOpacity style={styles.shdbtn} onPress={()=>paymentRef?.current?.show()}>
        <Text style={styles.shdbtntxt}>{t("Confirm")}</Text>
      </TouchableOpacity>}

      <ActionSheet
        ref={paymentRef}
        closeOnTouchBackdrop={true}
        containerStyle={{ backgroundColor: Constants.white }}
      >
        <View
          style={styles.actshetcov}
        >
         <Text style={styles.sheetheadtxt}>
            {t("Select payment method")}
          </Text>
          <CrossIcon
            style={styles.popupcross}height={26}width={26}
            onPress={() => {paymentRef.current.hide();setPaymentMethod(null);}}
          />
        </View>

  <View style={styles.paymentGrid}>
    <TouchableOpacity
      style={[styles.paymentCard,styles.paymentCard2, paymentMethod === 'stripe' && styles.paymentCardSelected]}
      onPress={() => setPaymentMethod('stripe')}
    >
      <Text><StripeLogoIcon height={25} width={35}/><StripeLabelIcon height={25} width={55}/></Text>
      <Text style={styles.paymentCardName}>{t('Card payment')}</Text>
      <Text style={styles.paymentCardDesc}>{t("Visa, Mastercard, Amex")}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.paymentCard,styles.paymentCard2, paymentMethod === 'swish' && styles.paymentCardSelected]}
      onPress={() => setPaymentMethod('swish')}
    >
      {/* Swish logo + label */}
      <SwishLogoIcon height={35} width={85}/>
      <Text style={styles.paymentCardName}>{t('Swish payment')}</Text>
      <Text style={styles.paymentCardDesc}>{t('Swedish mobile pay')}</Text>
    </TouchableOpacity>
  </View>

        <TouchableOpacity
          style={[styles.shdpaybtn, { marginBottom: 20, marginTop: 10,opacity:!paymentMethod?0.6:1 }]}
          disabled={!paymentMethod}
          onPress={() => {
    paymentRef.current.hide();
    if (paymentMethod === 'swish') {
      startSwishPayment();
    } else {
      startStripePayment();
    }
  }}>
          <Text style={styles.shdbtntxt}>
            { paymentMethod === 'swish'? t('Pay with Swish'): t('Pay with Stripe')}
          </Text>
        </TouchableOpacity>
      </ActionSheet>

      <Modal
  visible={showPaymentModal}
  transparent
  animationType="fade"
>
  <View style={{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <View style={{
      backgroundColor: 'white',
      width: '85%',
      borderRadius: 20,
      padding: 25,
      alignItems: 'center'
    }}>
      <Text style={{
        fontSize: 16,
        fontFamily: FONTS.Bold,
        marginBottom: 15
      }}>
        {t("Complete Your Payment")}
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 10,fontFamily: FONTS.Regular }}>
        {t("Please complete payment in Swish app.")}
      </Text>

      <Text style={{
        fontSize: 18,
        fontFamily: FONTS.Bold,
        color: Constants.red
      }}>
        {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, '0')}
      </Text>

      <Text style={{
        marginTop: 10,
        fontSize: 14,
        color: Constants.customgrey3,
        textAlign: 'center',
        fontFamily: FONTS.Regular,
      }}>
        {t("Do not leave this page until payment is completed.")}
      </Text>
    </View>
  </View>
</Modal>
    </View>
  );
};

export default Schedule;

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
    fontSize: 18,
  },
  seltxt2: {
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    textAlign:'center'
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
    height: 250,
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
    bottom: 15,
    width: wp(90),
    alignSelf: 'center',
  },
  shdbtn2: {
    backgroundColor: Constants.black,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(90),
    alignSelf: 'center',
    marginBottom: 20, 
    marginTop: 10
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
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Constants.custom_blue,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap:5,
    minWidth:wp(35)
    // marginRight: 10,
  },
  actionText: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  },

  horline: {
    borderTopWidth: 1,
    borderColor: Constants.customgrey5,
  },
  popupcross: {
    alignSelf: 'flex-end',
    marginRight: 15,
    // marginTop: -5,
    // marginBottom: 20,
  },
  sheetheadtxt: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
    timePickerStyle: {
    backgroundColor: Constants.white,
    width: '90%',
    height: 170,
    alignSelf: 'center',
    fontFamily: FONTS.Medium,
  },
  timePickerView: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    paddingVertical: 20,
  },
  backcov: {
    height: 35,
    width: 35,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.customgrey4,
  },

  actshetcov:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
          },
  paymentGrid: {
  flexDirection: 'row',
  gap: 10,
  paddingHorizontal: 16,
  marginBottom: 16,
},
paymentCard: {
  flex: 1,
  borderWidth: 0.5,
  borderColor: '#D3D1C7',
  borderRadius: 12,
  padding: 14,
  alignItems: 'flex-start',
  gap: 6,
  backgroundColor: '#fff',
},
paymentCard2: {
  borderWidth: 1.5,
  // borderColor: '#D3D1C7',
},
paymentCardSelected: {
  borderWidth: 2,
  borderColor: '#378ADD',
  backgroundColor: '#E6F1FB',
},
paymentCardName: {
  fontSize: 13,
  fontWeight: '500',
  color: '#1a1a1a',
},
paymentCardDesc: {
  fontSize: 11,
  color: '#888780',
  lineHeight: 16,
},
paymentCardTag: {
  fontSize: 10,
  fontWeight: '500',
  paddingHorizontal: 7,
  paddingVertical: 2,
  borderRadius: 20,
  overflow: 'hidden',
  marginTop: 2,
},
paymentCardTagStripe: {
  backgroundColor: '#EAF3DE',
  color: '#3B6D11',
},
paymentCardTagSwish: {
  backgroundColor: '#E6F1FB',
  color: '#185FA5',
},
paymentRadioOuter: {
  width: 16,
  height: 16,
  borderRadius: 8,
  borderWidth: 1.5,
  borderColor: '#B4B2A9',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'flex-end',
  marginBottom: 4,
},
paymentRadioOuterSelected: {
  borderColor: '#378ADD',
  backgroundColor: '#378ADD',
},
paymentRadioInner: {
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: '#fff',
},
shdpaybtn: {
    backgroundColor: Constants.custom_blue,
    borderRadius: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(90),
    alignSelf: 'center',
  },
});
