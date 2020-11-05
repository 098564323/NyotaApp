import {Dimensions, PixelRatio} from 'react-native';
import DefaultPreference from 'react-native-default-preference';
const widthPercentageToDP = widthPercent => {
  const screenWidth = Dimensions.get('window').width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};
const heightPercentageToDP = heightPercent => {
  const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};
export {
  widthPercentageToDP,
  heightPercentageToDP
};

//Email Validataion
export const emailValidation = (emailID) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    return reg.test(emailID);
}

//Check BlankField Validataion
export const checkBlankField = (inputText) => {
    return (inputText === '')
}

//Check Password Validataion
export const checkPasswordValidation = (passwordText) => {
  var textLength = passwordText.length.toString();
  return (textLength >= 6)
}

//Check Number Validataion
export const checkNumberValidation = (phoneNoText) => {
  var textLength = phoneNoText.length.toString();
  return !(textLength >= 6 && textLength <= 10)
}

//Store Current Preferense
export const storeCurrentPreference = (screenName) => {
  DefaultPreference.set('currentState', screenName).then(function() {
      console.log('screenName '+screenName);
  });
}

export const getUserToken = ()=>{
  var userToken = ''
  DefaultPreference.get('userToken')
    .then(function(value) {
      console.log('value idfgdfdfs '+value);
      userToken = value;
    });
  return userToken;
}


export const getSearchText = (searchText)=>{
  return searchText;
}
