import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Constants, { FONTS } from '../Helpers/constant';
import { goBack } from '../../../utils/navigationRef';
import { BackIcon } from '../../../Theme';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../../redux/auth/authAction';
import { useTranslation } from 'react-i18next';

const InstructerHeader = props => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const UpdateAvailability = stat => {
    const formData = new FormData();
    formData.append('available', stat);
    console.log(formData);
    dispatch(updateProfile(formData))
      .unwrap()
      .then(data => {
        console.log('data', data);
      })
      .catch(error => {
        console.error('UpdateProfile failed:', error);
      });
  };
  return (
    <View style={styles.toppart}>
      <View style={styles.secndcov}>
        <View style={styles.rowga}>
          {props.showback && (
            <BackIcon
              color={Constants.black}
              height={25}
              width={25}
              style={{ alignSelf: 'center' }}
              onPress={() => goBack()}
            />
          )}
          <Text style={styles.backtxt}>{props?.item}</Text>
        </View>
        <View style={styles.rowga}>
          <Text style={styles.avltxt}>{t("Availability")}</Text>
          {user?.available ? (
            <TouchableOpacity onPress={() => UpdateAvailability(false)}>
              <Image
                source={require('../Images/on.png')}
                resizeMode="contain"
                style={{ width: 43, height: 23 }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => UpdateAvailability(true)}>
              <Image
                source={require('../Images/off.png')}
                resizeMode="contain"
                style={{ width: 43, height: 23 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default InstructerHeader;

const styles = StyleSheet.create({
  backtxt: {
    color: Constants.black,
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },
  avltxt: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
  },
  toppart: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Constants.light_blue2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  hi: {
    marginRight: 10,
    height: 25,
    width: 25,
    borderRadius: 15,
  },
  aliself: {
    alignSelf: 'center',
  },
  secndcov: {
    flexDirection: 'row',
    gap: 10,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowga:{
    flexDirection:'row',
    gap:10
  }
});
