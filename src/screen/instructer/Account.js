import {
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState} from 'react';
import Constants, { Currency, FONTS} from '../../Assets/Helpers/constant';
import {
  CrossIcon,
  DeleteIcon,
  LogoutIcon,
  PrivacyIcon,
  ProfileIcon,
  RightArrowIcon,
  SupportIcon,
  TermIcon,
  TransactionIcon,
} from '../../../Theme';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '../../../utils/navigationRef';
import { logout } from '../../../redux/auth/authAction';

const Account = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const user = useSelector(state => state.auth.user);
  
  const InAppBrowserFunc=async(props)=>{
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(props, {
          // Customization options
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: Constants.custom_blue,
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          enableBarCollapsing: false,
        });
      } else {
        Linking.openURL(props);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const logOut=()=>{
dispatch(logout())
  }
  return (
    <View style={styles.container}>
      <View style={styles.toppart}>
      <Text style={styles.headtxt}>Profile Settings</Text>
        <TouchableOpacity
          style={styles.topcard}
          onPress={() => navigate('InstProfile')}>
          <Image
            source={
              user?.image
                ? {
                    uri: `${user.image}`,
                  }
                : require('../../Assets/Images/pro-img.png')
            }
            style={styles.proimg}
          />
        </TouchableOpacity>
        <Text style={styles.headtxt2}>Available Balance</Text>
        <Text style={styles.headtxt3}>{Currency} {user?.wallet?user?.wallet:0}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginTop: 10,
            backgroundColor: Constants.white,
            marginBottom: 70,
          }}>
          <Text style={styles.partheadtxt}>Profile</Text>
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => navigate('InstProfile')}>
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <ProfileIcon height={20} width={20} color={Constants.black}/>
              </View>
              <Text style={styles.protxt}>Personal Data</Text>
            </View>
            <RightArrowIcon
              color={Constants.black}
              height={15}
              width={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => navigate('InstructerTransactionHistory')}>
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <TransactionIcon height={20} width={20} color={Constants.black}/>
              </View>
              <Text style={styles.protxt}>Transaction History</Text>
            </View>
            <RightArrowIcon
              color={Constants.black}
              height={15}
              width={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[styles.box]}
            onPress={()=>langRef.current.show()}>
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <LanguageIcon height={20} width={20} color={Constants.black} />
              </View>
              <Text style={styles.protxt}>Language</Text>
            </View>
            <View style={styles.btmboxfirpart}>
              <Text style={styles.protxt3}>{selectLanguage}</Text>
              <RightArrowIcon
                color={Constants.black}
                height={15}
                width={15}
                style={styles.aliself}
              />
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => InAppBrowserFunc('https://main.d2i61b55rlnfpm.amplifyapp.com/PrivacyPolicy')}
            >
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <PrivacyIcon height={20} width={20} color={Constants.black}/>
              </View>
              <Text style={styles.protxt}>Privacy Policy</Text>
            </View>
            <RightArrowIcon
              color={Constants.black}
              height={15}
              width={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => InAppBrowserFunc('https://main.d2i61b55rlnfpm.amplifyapp.com/TermsandConditions')}
            >
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <TermIcon height={20} width={20} color={Constants.black}/>
              </View>
              <Text style={styles.protxt}>Terms and Conditions</Text>
            </View>
            <RightArrowIcon
              color={Constants.black}
              height={15}
              width={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          <Text style={styles.partheadtxt}>Support</Text>
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => InAppBrowserFunc('https://tawk.to/chat/68e0fa0c4db84c19518e60e8/1j6nd1gbd')}
            >
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <SupportIcon height={20} width={20} color={Constants.black}/>
              </View>
              <Text style={styles.protxt}>Help Center</Text>
            </View>
            <RightArrowIcon
              color={Constants.black}
              height={15}
              width={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => setModalVisible2(true)}>
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <DeleteIcon height={20} width={20} color={Constants.black} />
              </View>
              <Text style={[styles.protxt,{width:'70%'}]}>Request Account Deletion</Text>
            </View>
            <RightArrowIcon
              color={Constants.black}
              height={15}
              width={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn]}
            onPress={async () => {
              setModalVisible(true);
            }}>
            <LogoutIcon color={Constants.red}/>
            <Text style={styles.btntxt}> Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{backgroundColor: 'white', alignItems: 'center'}}>
              <View style={[styles.covline,{width:'100%'}]}>
                <View style={{width:35}}></View>
                <Text style={styles.textStyle5}>Sign Out </Text>
                <TouchableOpacity style={styles.croscov} onPress={()=>setModalVisible(false)}>
                  <CrossIcon color={Constants.black}/>
                </TouchableOpacity>
              </View>
              <Text style={styles.textStyle4}>Where do you want to go after logging out?</Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.cancelButtonStyle2}>
                  <Text style={[styles.modalText,{color:Constants.black}]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setModalVisible(!modalVisible);
                    logOut();
                  }}
                  style={styles.logOutButtonStyle2}>
                  <Text style={styles.modalText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible2(!modalVisible2);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{backgroundColor: 'white', alignItems: 'center'}}>
              <Text style={[styles.textStyle2, {color: Constants.red}]}>
                WARNING: You are about to delete your account. This action is permanent and cannot be undone.
              </Text>
              <Text style={styles.textStyle3}>
                • All your data, including personal information, and settings, will be permanently erased.
              </Text>
              <Text style={styles.textStyle3}>
                • You will lose access to all services and benefits associated with your account.
              </Text>
              <Text style={styles.textStyle3}>
                • You will no longer receive updates, support, or communications from us.
              </Text>
              <Text style={styles.textStyle}>
                Are you sure you want to delete your account?
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible2(!modalVisible2)}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setModalVisible2(!modalVisible2);
                    logOut();
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // backgroundColor: '#F8F8F8',
    // paddingVertical: 20,
  },
  headtxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
    // marginTop: 10,
  },
  protxt: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
  },
  protxt2: {
    color: Constants.customgrey2,
    fontSize: 12,
    fontFamily: FONTS.Regular,
  },
  box: {
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: Constants.white,
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aliself: {
    alignSelf: 'center',
  },
  btntxt: {
    fontSize: 16,
    color: Constants.red,
    fontFamily: FONTS.SemiBold,
  },
  btn: {
    height: 55,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    borderColor: Constants.customgrey2,
    borderWidth: 1,
    marginHorizontal: 20,
    // width: '80%',
    // alignSelf: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  proimg: {
    // marginRight: 10,
    height: 70,
    width: 70,
    borderRadius: 70,
  },
  /////////logout model //////
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 17,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },

  textStyle: {
    color: Constants.black,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 16,
  },
  textStyle5: {
    color: Constants.black,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 18,
  },
  textStyle4: {
    color: Constants.customgrey2,
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    fontSize: 14,
    marginTop:10
  },
  textStyle2: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    fontSize: 16,
  },
  textStyle3: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    fontSize: 16,
  },
  modalText: {
    color: Constants.white,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 14,
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 3,
  },
  cancelButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.black,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginRight: 10,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.red,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  cancelButtonStyle2: {
    flex: 0.5,
    borderColor: Constants.customgrey2,
    borderWidth:1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginRight: 10,
  },
  logOutButtonStyle2: {
    flex: 0.5,
    backgroundColor: Constants.custom_blue,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  covline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horline: {
    height: 1,
    backgroundColor: Constants.customgrey2,
    marginVertical: 10,
  },
  partheadtxt: {
    fontSize: 14,
    color: Constants.customgrey2,
    fontFamily: FONTS.Medium,
    marginTop: 20,
    marginLeft: 20,
  },
  iconcov: {
    backgroundColor: '#F5F5FF',
    borderRadius: 8,
    padding: 10,
  },
  btmboxfirpart: {flexDirection: 'row', alignItems: 'center', gap: 15},
  croscov:{
    padding:10,
    borderRadius:8,
    borderWidth:1,
    borderColor:Constants.customgrey5
  },
  topcard: {
    marginHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  toppart: {
    backgroundColor: Constants.custom_blue,
    padding: 20,
    // minHeight: '20%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headtxt1: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
  },
  headtxt2: {
    fontSize: 14,
    color: Constants.customgrey4,
    fontFamily: FONTS.Light,
    textAlign: 'center',
    marginTop: 10,
  },
  headtxt3: {
    fontSize: 24,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
    marginBottom: 10,
  },
  headtxt4: {
    fontSize: 14,
    color: Constants.customgrey4,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Constants.customgrey4,
    padding: 10,
    width: '30%',
    borderRadius: 15,
    alignSelf: 'center',
  },
});
