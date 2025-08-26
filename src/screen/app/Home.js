import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Constants, { FONTS } from '../../Assets/Helpers/constant';

const Home = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        {/* <View style={styles.toppart}>
            <Image
              source={
                // orderdetail?.seller_profile?.image
                //   ? {
                //       uri: `${orderdetail?.seller_profile?.image}`,
                //     }:
                     require('../../../Assets/Images/profile4.png')
              }
              style={styles.imgst}
            />
            <View>
            <Text style={styles.nametxt}>Regina Title</Text>
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    padding: 20,
  },
  toppart: {
    backgroundColor: Constants.custom_blue,
    height: 60,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  imgst: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  nametxt: {
    color: Constants.white,
    fontFamily: FONTS.Medium,
    fontSize: 16,
  },
});
