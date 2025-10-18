import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
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
    <ImageBackground
      source={require('../../Assets/Images/onboard.png')}
      style={styles.container}
      resizeMode="stretch"
    >
      <TouchableOpacity
          style={[styles.langView, ]}
          onPress={() => langRef.current.show()}>
          <Text style={[styles.lang,]}>{selectLanguage}</Text>
          <DropdownIcon height={15} width={15} color={Constants.white} />
        </TouchableOpacity>
      <View style={styles.itemscov}>
        <Text style={styles.weltxt}>{t("Welcome To")}</Text>
        <Image
          source={require('../../Assets/Images/logo.png')}
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
    </ImageBackground>
  );
};

export default Onboard;
