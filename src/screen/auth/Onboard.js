import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import styles from './styles';
import Constants from '../../Assets/Helpers/constant';
import { navigate } from '../../../utils/navigationRef';

const Onboard = () => {
  return (
    <ImageBackground
      source={require('../../Assets/Images/onboard.png')}
      style={styles.container}
      resizeMode="stretch"
    >
      <View style={styles.itemscov}>
        <Text style={styles.weltxt}>Welcome To</Text>
        <Image
          source={require('../../Assets/Images/logo.png')}
          style={styles.proimg2}
        />
        <Text style={styles.logo1}>Boka</Text>
        <Text style={styles.logo2}>Korning.se</Text>
        <Text style={styles.infotxt}>Your driving school for your needs.</Text>
        <View style={styles.onbbtncov}>
            <TouchableOpacity style={styles.onbbtn} onPress={()=>navigate("SignUp")}><Text style={styles.onbbtntxt}>Sign Up</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.onbbtn,{backgroundColor:Constants.custom_blue}]} onPress={()=>navigate("SignIn")}><Text style={[styles.onbbtntxt,{color:Constants.white}]}>Login</Text></TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Onboard;
