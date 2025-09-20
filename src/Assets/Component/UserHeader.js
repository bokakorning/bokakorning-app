import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Constants, { FONTS } from '../Helpers/constant';
import { goBack } from '../../../utils/navigationRef';
import { BackIcon } from '../../../Theme';

const UserHeader = props => {

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
      </View>
    </View>
  );
};

export default UserHeader;

const styles = StyleSheet.create({
  backtxt: {
    color: Constants.black,
    fontSize: 18,
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
