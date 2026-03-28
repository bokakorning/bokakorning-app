import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CallIcon,
  CarIcon,
  CrossIcon,
  EditIcon,
  LeftarrowIcon,
  LocationIcon,
  PinIcon,
  StripeLabelIcon,
  StripeLogoIcon,
  SwishLogoIcon,
} from '../../../Theme';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import { hp, wp } from '../../../utils/responsiveScreen';
import { Picker } from 'react-native-wheel-pick';
import ActionSheet from 'react-native-actions-sheet';
import { mapStyle } from '../../../Theme/MapStyle';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { goBack, navigate, reset } from '../../../utils/navigationRef';
import { useTranslation } from 'react-i18next';
import { useStripe } from '@stripe/stripe-react-native';
import { createBooking, postStripe } from '../../../redux/payment/paymentAction';

const InstructerDetail = props => {
  const data = props?.route?.params;
  const { t } = useTranslation();
  const {initPaymentSheet, presentPaymentSheet, confirmPayment} = useStripe();
  // console.log('data', data);

  const [paymentMethod, setPaymentMethod] = useState(null); // null | 'stripe' | 'swish'
    const [paymentconf, setPaymentconf] = useState(false);

  const timeRef = createRef();
  const dispatch = useDispatch();
  const userAddress = useSelector(state => state.location.userAddress);
  const userLocation = useSelector(state => state.location.userLocation);
  const userEnteredAddress = useSelector(state => state.location.userEnteredAddress);
  const user = useSelector(state => state.auth.user);
  const rateData = useSelector(state => state.transaction.rateData);
  const rate_per_hour = user?.firstbook
  ? rateData?.per_hour_hour
  : Math.round(rateData?.per_hour_hour * (1 - 0.386));
  const [timeconf, settimeconf] = useState(false);
  const [selectedTime, setSelectedTime] = useState();
  const [times, setTimes] = useState();
  useEffect(() => {
    const generatedSlots = generateTimeSlots();
    setTimes(generatedSlots);
    setSelectedTime(generatedSlots[0]);
  }, []);
  //  const submit = async () => {
  //   const body={
  //   instructer: data?._id,
  //   date: new Date(),
  //   total: data?.rate_per_hour,
  //   selectedTime: selectedTime,
  //   payment_mode:"online",
  //   user_location: {
  //       type: 'Point',
  //       coordinates: [data?.selloc?.long?data?.selloc?.long:userLocation?.long, data?.selloc?.lat?data?.selloc?.lat:userLocation?.lat],
  //     },
  //   pickup_address: userEnteredAddress?userEnteredAddress:userAddress
  //   }
  //     dispatch(createBooking(body))
  //       .unwrap()
  //       .then(res => {
  //         console.log('res', res);
  //         reset("BookingConfirm",{name:data?.name,image:data?.image,selectedTime})
  //       })
  //       .catch(error => {
  //         console.error('Booking failed:', error);
  //       });
  //   };
  // console.log('times', times);
  function generateTimeSlots(start = '00:00', end = '23:50', gapMinutes = 30) {
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
      if (current >= now) {
      slots.push(
        current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      );
      }
      current = new Date(current.getTime() + gapMinutes * 60000); // add 30 min
    }

    return slots;
  }
  const PackageIcon = () => {
    return (
      <TouchableOpacity style={{ height: 60, width: 60, position: 'relative' }}>
        <PinIcon height={50} width={50} />
      </TouchableOpacity>
    );
  };
  const PackageIcon2 = () => {
    return (
      <TouchableOpacity style={{ height: 60, width: 60, position: 'relative' }}>
        <CarIcon height={50} width={50} />
      </TouchableOpacity>
    );
  };

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 sec
  const countdownRef = useRef(null);
  const expiryRef = useRef(null);

const pollInterval = useRef(null);
  const startSwishPayment = async () => {
    try {
  console.log("Initiating Swish payment...");

  const body={
    instructer: data?._id,
    date: new Date(),
    // total: rate_per_hour,
    selectedTime: selectedTime,
    payment_mode:"swish",
    user_location: {
        type: 'Point',
        coordinates: [data?.selloc?.long?data?.selloc?.long:userLocation?.long, data?.selloc?.lat?data?.selloc?.lat:userLocation?.lat],
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

      if (resdata?.data?.status === 'PAID') {
        clearInterval(pollInterval.current);
        clearInterval(countdownRef.current);
        setShowPaymentModal(false);
        reset("BookingConfirm",{name:data?.name,image:data?.image,selectedTime})
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
    instructer: data?._id,
    date: new Date(),
    selectedTime: selectedTime,
    payment_mode:"stripe",
    user_location: {
        type: 'Point',
        coordinates: [data?.selloc?.long?data?.selloc?.long:userLocation?.long, data?.selloc?.lat?data?.selloc?.lat:userLocation?.lat],
      },
    pickup_address: userEnteredAddress?userEnteredAddress:userAddress,
    amount: rate_per_hour,
    paymentid:res.clientSecret,
    payment_status:'PAID'
    }
          dispatch(createBooking(body)).unwrap().then(()=>reset("BookingConfirm",{name:data?.name,image:data?.image,selectedTime}));
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topcov}>
          <View style={styles.toppart}>
            <Image
              source={
                user?.image
                  ? {
                      uri: `${user?.image}`,
                    }
                  : require('../../Assets/Images/profile4.png')
              }
              style={styles.imgst}
            />
            <View>
              <Text style={styles.nametxt}>{user?.name}</Text>
              <View style={styles.loccov}>
                <LocationIcon />
                <Text style={styles.loctxt} numberOfLines={1}>
                  {userAddress}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.frow} onPress={()=>goBack()}>
          <LeftarrowIcon height={20} width={20} />
          <Text style={styles.bactxt}>{t("Back to Instructors List")}</Text>
        </TouchableOpacity>
        <View style={styles.frow2}>
          <Text style={styles.instytxt}>
            {data?.transmission === 'Automatic'
              ? t('Auto-Car')
              : data?.transmission === 'Both'
              ? t('Auto & Manual')
              : t('Manual')}{' '}
            {t("Instructor")}
          </Text>
          <Text style={styles.awatxt}>
            {data?.distance > 0 ? (data?.distance / 1609.34).toFixed(0) : 0}{' '}
            {t("Miles Away")}
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
        <Text style={{marginTop:7}}>
          <Text style={styles.drivnametxt}>{t("Rate")} </Text>
          <Text style={styles.vehinam}>{Currency} {rate_per_hour}/{t("Hour")}</Text>
        </Text>
        <Text style={styles.ratetxt}>
          <Text style={styles.drivnametxt}>{t("Session Duration")} </Text>
          <Text style={styles.vehinam}>{t("60 Mins")}</Text>
          </Text>
        <Text style={[styles.bactxt, { fontSize: 16 }]}>{t("Vehicle")}</Text>
        <Text style={{ marginTop: 7 }}>
          <Text style={styles.drivnametxt}>{t("Vehicle")} </Text>
          <Text style={styles.vehinam}>{data?.vehicle_model}</Text>
        </Text>
        <Text style={{ marginTop: 7,marginBottom:100 }}>
          <Text style={styles.drivnametxt}>{t("Category")} </Text>
          <Text style={styles.vehinam}>{t("Car")}</Text>
        </Text>
        {/* <TouchableOpacity
              style={styles.contactopt}
              onPress={() =>
                Linking.openURL(`tel:${data?.phone}`)
              }>
              <CallIcon color={Constants.custom_blue} height={20} width={20} />
              <Text style={styles.othrttxt2}>
                Contact {data?.name}
              </Text>
            </TouchableOpacity> */}
      </ScrollView>
      <View style={styles.btmpart}>
        <TouchableOpacity
          style={styles.shdbtn}
          onPress={() => timeRef.current.show()}
        >
          <Text style={styles.shdbtntxt}>{t("Book a Session")}</Text>
        </TouchableOpacity>
      </View>
      <ActionSheet
        ref={timeRef}
        closeOnTouchBackdrop={true}
        containerStyle={{ backgroundColor: Constants.white }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 15,
            paddingHorizontal: 10,
          }}
        >
         {paymentconf? <Text style={styles.sheetheadtxt}>
            {t("Select payment method")}
          </Text>:
          <Text style={styles.sheetheadtxt}>
            {t("Pickup")} {timeconf ? t('Location') : t('Time')}
          </Text>}
          <CrossIcon
            style={styles.popupcross}
            height={26}
            width={26}
            onPress={() => {timeRef.current.hide(); settimeconf(false),setPaymentconf(false);setPaymentMethod(null);}}
          />
        </View>
        {!paymentconf&&<View>
        {!timeconf && <View style={styles.horline}></View>}
        {timeconf&&<Text style={styles.mapinstxt}>{t("Your instructor will some pick you up at location below")}</Text>}
        {timeconf ? (
          <View style={styles.mapThumbnail}>
            {userLocation?.long && (
              <MapView
                style={styles.mapThumbnailView}
                provider={PROVIDER_GOOGLE}
                // ref={mapRef}
                customMapStyle={mapStyle}
                region={{
                  latitude: data?.selloc?.lat?data?.selloc?.lat:userLocation?.lat,
                  longitude: data?.selloc?.long?data?.selloc?.long:userLocation?.long,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                {userLocation?.long && (
                  <Marker
                    zIndex={8}
                    draggable={false}
                    coordinate={{
                      latitude: data?.selloc?.lat?data?.selloc?.lat:userLocation?.lat,
                      longitude: data?.selloc?.long?data?.selloc?.long:userLocation?.long,
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                  >
                    <PackageIcon />
                  </Marker>
                )}
                {data?.location?.coordinates?.length > 0 && (
                  <Marker
                    zIndex={8}
                    draggable={false}
                    coordinate={{
                      latitude: data?.location.coordinates[1],
                      longitude: data?.location.coordinates[0],
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                  >
                    <PackageIcon2 />
                  </Marker>
                )}
              </MapView>
            )}
          </View>
        ) : (
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
        )}

        {!timeconf && <View style={styles.horline}></View>}
        {timeconf&&<View>
        <Text style={styles.sheetheadtxt2}>{t("At")}</Text>
        <View style={styles.ndpart}>
          <Text style={styles.seltimtxt}>{selectedTime}</Text>
          <TouchableOpacity style={styles.editcov} onPress={() => settimeconf(false)}>
            <Text style={styles.seltimtxt}>{t("Edit")}</Text>
            <EditIcon color={Constants.black}/>
          </TouchableOpacity>
        </View>
        </View>}
        </View>}

        {paymentconf && timeconf && (
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
)}

        <TouchableOpacity
          style={[styles.shdbtn, { marginBottom: 20, marginTop: 10,opacity:paymentconf&&!paymentMethod?0.6:1 }]}
          disabled={paymentconf&&!paymentMethod}
          onPress={() => {
  if (!timeconf) {
    settimeconf(true);
  } else if (!paymentconf) {
    setPaymentconf(true);  // Step 2 → Step 3: show payment selection
  } else {
    // Step 3: fire chosen gateway
    timeRef.current.hide();
    if (paymentMethod === 'swish') {
      startSwishPayment();
    } else {
      startStripePayment();
    }
  }}}>
          <Text style={styles.shdbtntxt}>
            {!timeconf? t('Confirm Time'): !paymentconf? t('Proceed to Pay'): paymentMethod === 'swish'? t('Pay with Swish'): t('Pay with Stripe')}
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

export default InstructerDetail;

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
  topcov: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: '80%',
  },
  bactxt: {
    color: Constants.black,
    fontFamily: FONTS.Heavy,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  frow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
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
  awatxt: {
    fontSize: 13,
    color: Constants.white,
    fontFamily: FONTS.Medium,
    backgroundColor: Constants.black,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 3,
  },
  proimg: {
    height: hp(35),
    // width: 50,
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
  },
  vehinam: {
    color: Constants.black,
    fontFamily: FONTS.Medium,
    fontSize: 14,
  },
  shdbtn: {
    backgroundColor: Constants.custom_blue,
    borderRadius: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(90),
    alignSelf: 'center',
  },
  shdbtntxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  },
  btmpart: {
    position: 'absolute',
    bottom: 0,
    paddingTop: 15,
    paddingBottom: 8,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    boxShadow: '0px 1px 15px 0.1px #74d7fa',
    width: wp(100),
    backgroundColor:Constants.white
  },
  timePickerStyle: {
    backgroundColor: Constants.white,
    width: '90%',
    height: 170,
    alignSelf: 'center',
    fontFamily: FONTS.Medium,

    // borderRadius: 10,
    // borderWidth: 2,
    // borderColor: Constants.normal_green,
  },
  timePickerView: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    paddingVertical: 20,
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
  sheetheadtxt2: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    marginLeft:20
  },
  seltimtxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  mapinstxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    marginLeft:20
  },
  mapThumbnailView: {
    height: '100%',
    width: '100%',
  },
  mapThumbnail: {
    height: 170,
    width: '93%',
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
  },
  ndpart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  editcov:{
    flexDirection:'row',
    borderWidth:1,
    borderColor:Constants.black,
    paddingHorizontal:10,
    paddingVertical:5,
    gap:3,
    borderRadius:18,
    alignItems:'center'
  },
  othrttxt2: {
    color: Constants.custom_blue,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  contactopt: {
    borderWidth: 1.5,
    borderColor: Constants.custom_blue,
    borderRadius: 40,
    flexDirection: 'row',
    height: 60,
    width: '70%',
    justifyContent: 'center',
    // flex:1,
    alignItems: 'center',
    alignSelf: 'center',
    gap: 15,
    marginTop:20,
    marginBottom:90
  },
  ratetxt:{ 
    marginTop: 7,
    marginBottom: 30,
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
});
