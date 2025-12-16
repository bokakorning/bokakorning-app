import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { createRef, useEffect, useState } from 'react';
import styles from './styles';
import Constants from '../../Assets/Helpers/constant';
import { navigate } from '../../../utils/navigationRef';
import { DropdownIcon } from '../../../Theme';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLanguage } from '../../../redux/location/locationSlice';
import LanguageChange from '../../Assets/Component/LanguageChange';
import { hp, wp } from '../../../utils/responsiveScreen';

const Onboard = () => {
  const dispatch = useDispatch();
  const [selectLanguage, setSelectLanguage] = useState('English');
      const { t } = useTranslation();
      const langRef = createRef()
    useEffect(() => {
    checkLng();
  }, []);
  const checkLng = async () => {
    const x = await AsyncStorage.getItem('LANG');
    if (x != null) {
      let lng = x == 'sv' ? 'Swedish':'English';
      setSelectLanguage(lng);
      dispatch(setLanguage(lng))
    }
  };
  return (
    <View style={{flex:1}}>
    {/* <ImageBackground
      source={require('../../Assets/Images/onboard_bg.png')}
      style={{height:hp(100),width:wp(100)}}
      resizeMode="cover"
    > */}
    <View style={StyleSheet.absoluteFillObject}>
     <Image
      source={require('../../Assets/Images/onboard_bg.png')}
      style={{height:hp(100),width:wp(100)}}
      resizeMode="cover"
    />
    </View>
      <TouchableOpacity
          style={[styles.langView, ]}
          onPress={() => langRef.current.show()}>
          <Text style={[styles.lang,]}>{selectLanguage}</Text>
          <DropdownIcon height={15} width={15} color={Constants.white} />
        </TouchableOpacity>
      <View style={styles.itemscov}>
        <Text style={styles.weltxt}>{t("Welcome To")}</Text>
        <Image
          source={require('../../Assets/Images/app_logo_main.png')}
          style={styles.proimg2}
        />
        <Text style={styles.logo1}>Boka</Text>
        <Text style={styles.logo2}>Korning.se</Text>
        <Text style={styles.infotxt}>{t("Your driving school for your needs.")}</Text>
        <View style={styles.onbbtncov}>
            <TouchableOpacity style={styles.onbbtn} onPress={()=>navigate("SignUp")}><Text style={styles.onbbtntxt}>{t("Sign Up")}</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.onbbtn,{backgroundColor:Constants.custom_blue}]} onPress={()=>navigate("SignIn")}><Text style={[styles.onbbtntxt,{color:Constants.white}]}>{t("Login")}</Text></TouchableOpacity>
        </View>
      </View>
      <LanguageChange refs={langRef} selLang={(item)=>{setSelectLanguage(item)}}/>
    {/* </ImageBackground> */}
    </View>
  );
};

export default Onboard;
