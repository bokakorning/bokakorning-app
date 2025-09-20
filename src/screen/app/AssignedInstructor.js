import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { hp, wp } from '../../../utils/responsiveScreen';
import UserHeader from '../../Assets/Component/UserHeader'

const AssignedInstructor = props => {
  const data = props?.route?.params;
  // console.log('data', data);
  return (
    <View style={styles.container}>
        <UserHeader item={"Assigned Instructor"} showback={true}/>
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
    marginBottom: 30,
  },
  vehinam: {
    color: Constants.black,
    fontFamily: FONTS.Medium,
    fontSize: 14,
  },
});
