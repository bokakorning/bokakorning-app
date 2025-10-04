// const prodUrl = 'http://192.168.0.187:3000/';
//  const prodUrl = 'http://192.168.25.1:3000/api/';
const prodUrl = 'https://api.bokakorning.online/';
// const prodUrl = 'http://10.80.19.103:3000/';

let apiUrl = prodUrl;
export const Googlekey = 'AIzaSyA4GB0zYGkYF8blPqwF57GKnw4ON2EEN80'
export const Currency = 'KR'

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
  light_blue2: '#cae8f1',
  light_blue3: '#eaf8ff',
  light_blue: '#74d7fa',


  emailValidationRegx:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  numberValidationRegx: /^\d+$/,
  passwordValidation: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,


};
export const FONTS = {
  Regular: 'FuturaCyrillicBook',
  Bold: 'FuturaCyrillicBold',
  Medium: 'FuturaCyrillicMedium',
  SemiBold: 'FuturaCyrillicDemi',
  Heavy: 'FuturaCyrillicHeavy',
};


export default Constants;
