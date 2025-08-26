const prodUrl = 'http://192.168.0.187:3000/api/';
//  const prodUrl = 'http://192.168.25.1:3000/api/';
// const prodUrl = 'https://api.mybrainspeed.com/api/';
// const prodUrl = 'http://10.80.19.68:3000/api/';

let apiUrl = prodUrl;
export const Googlekey = ''

const Constants = {
  baseUrl: apiUrl,
  red: '#FF0000',
  light_red: '#462128',
  customgrey: '#252b2b',
  black: '#000000',
  white: '#FFFFFF',
  custom_green: '#01B763',
  custom_green2: '#00FF00',
  tabgrey: '#8B8B8B',
  customgrey2: '#A4A4A4',
  customgrey3: '#858080',
  customgrey4: '#F1F1F1',
  customgrey5: '#dedede',
  custom_blue: '#4EB0CF',
  light_blue: '#74d7fa',


  emailValidationRegx:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  numberValidationRegx: /^\d+$/,
  passwordValidation: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,


};
export const FONTS = {
  Regular: 'FuturaCyrillicBook',
  Bold: 'FuturaCyrillicBold',
  Medium: 'Poppins-Medium',
  SemiBold: 'FuturaCyrillicDemi',
  Heavy: 'FuturaCyrillicHeavy',
};


export default Constants;
