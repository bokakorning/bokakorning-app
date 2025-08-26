import { StyleSheet, Dimensions, Platform } from 'react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import{hp,wp} from '../../../utils/responsiveScreen'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    padding: wp(4),
  },
  headtxt: {
    fontSize: wp(10),
    color: Constants.black,
    fontFamily: FONTS.Heavy,
    marginVertical:hp(1.2)
  },
  proimg:{
    height: hp(14),
    width: wp(30),
    marginTop:hp(6)
  },
  buttompart:{
    justifyContent:'center',
    alignItems:'center',
  },
  inpcov:{
    borderWidth:1.5,
    borderColor:Constants.custom_blue,
    width:wp(90),
    borderRadius:wp(3),
    height:hp(6.5),
    flexDirection:'row',
    paddingHorizontal:wp(1.5),
    alignItems:'center',
    marginTop:hp(2.5)
  },
  uploadcov:{
    borderWidth:1.5,
    borderColor:Constants.custom_blue,
    backgroundColor:'#b9e0ec',
    borderRadius:wp(3),
    height:hp(6),
    marginTop:hp(2),
    width:wp(90),
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:10
  },
  upltxt:{
    fontSize:14,
    color:Constants.black,
    fontFamily:FONTS.Medium,
  },
  inputfield:{
    fontSize:14,
    color:Constants.black,
    fontFamily:FONTS.Medium,
    flex:1
  },
  btncov:{
    width:wp(50),
    backgroundColor:Constants.custom_blue,
    borderRadius:wp(3),
    height:hp(6),
    justifyContent:'center',
    alignItems:'center',
    marginTop:hp(2),
    boxShadow: '0px 1.5px 5px 0.1px grey'
  },
  btntxt:{
    fontSize:wp(4.5),
    color:Constants.white,
    fontFamily:FONTS.SemiBold
  },
  forgtxt:{
    fontSize:wp(4),
    color:Constants.custom_blue,
    fontFamily:FONTS.SemiBold,
    marginTop:hp(1),
    textAlign:'center'
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginLeft: wp(2),
    marginTop: hp(0.7),
    fontSize: wp(4),
    alignSelf:'flex-start'
    // marginTop:10
  },
  textcov:{
    // marginTop:hp(7),
    alignSelf:'center',
    position:'absolute',
    bottom:20
  },
  textcov2:{
    marginTop:hp(7),
    alignSelf:'center',
  },
  lasttxt:{
    fontSize:wp(4),
    fontFamily:FONTS.SemiBold,
  },
  
    ////toggle button
btnCov: {
  height: 50,
  flexDirection: 'row',
  backgroundColor: Constants.customgrey5,
  borderRadius: 12,
  marginVertical: 15,
  // marginHorizontal: 20,
  overflow: 'hidden',
  position: 'relative',
},
slider: {
  position: 'absolute',
  width: '50%',
  height: '100%',
  backgroundColor: Constants.custom_blue,
  borderRadius: 10,
  zIndex: 0,
},
cencelBtn: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
},
cencelBtn2: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
},
btntxt: {
  fontSize: 16,
  fontWeight: '500',
},
activeText: {
  color: Constants.white,
},
inactiveText: {
  color: Constants.customgrey,
},
/////

})

export default styles;
