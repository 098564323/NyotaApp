import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  Image,
  StatusBar,
  TouchableOpacity,
  Platform,
  NativeModules
} from 'react-native';
//
import DefaultPreference from 'react-native-default-preference';
import Share from 'react-native-share';
import { StackActions,NavigationActions } from 'react-navigation';
import { LoginManager } from 'react-native-fbsdk'
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
//
const ProfileRow =({itemData,profileNavigate,propsNavigation,socialTypeCode})=>{
  return(
          <TouchableOpacity onPress={onProfileOptionClick.bind(this,itemData.screenName,profileNavigate,propsNavigation,socialTypeCode)}>
                    <View style={{flexDirection:'row',marginTop:10,marginLeft:15,padding:5,alignItems:'center'}}>
                          <Image source={itemData.image}
                                  style={{resizeMode:'contain',width:15,height:15}}/>
                             <Text style={{color:'#626161',fontSize:16,flex:1,marginLeft:5}}>{itemData.title}</Text>
                             {
                                (itemData.title==='LogOut'||itemData.title==='Se déconnecter')?
                                  null:
                                   <Image source={require('../../images/profile/next_arrow.png')}
                                      style={{resizeMode:'contain',width:15,height:15,marginRight:10}}/>
                              }
                    </View>
          </TouchableOpacity>
        );
};

function onProfileOptionClick(screenName,profileNavigate,propsNavigation,socialTypeCode) {
    //
    const deviceLanguage =
                          Platform.OS === 'ios'
                            ? NativeModules.SettingsManager.settings.AppleLocale ||
                              NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
                            : NativeModules.I18nManager.localeIdentifier;
    const languageCode = (deviceLanguage.split('_')[0]==='fr')?'fr':'en'
    //
    const shareOptions = {
        url: (Platform.OS=='ios')?'https://apps.apple.com/in/app/nyota/id1499976807':'https://play.google.com/store/apps/details?id=com.icreative.nyota&hl=en'
    };
    //
    switch (screenName) {
      case 'Address':
          profileNavigate(screenName,{
            isFromCart:false,
            totalAmt:0
          })
        break;
      case 'Login':
            //
            if(socialTypeCode=='1'){
                LoginManager.logOut()
            }else if(socialTypeCode=='2'){
                onAppleLogout()
            }
            //
            const resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: screenName,params: {languageCode: (languageCode=='fr')?"1":"0"} })],
            });
            const currentNavigation = profileNavigate;
            //
            DefaultPreference.clearAll()
            .then(function() {
                console.log('Clear All Called');
                new Promise((resolve, reject) => {
                      propsNavigation.dispatch(resetAction);
                });
            });
        break;
      case 'PrivactAboutUs':
            profileNavigate(screenName,{title:'Privacy Policy',
            id:1,
            languageCode:(languageCode=='fr')?"1":"0"})
      break;
      case 'ShareApp':
            Share.open(shareOptions)
            .then((res) => { console.log(res) })
            .catch((err) => { err && console.log(err); });
      break;
      case 'WishList':
          profileNavigate(screenName)
      break;
      case 'Payment':
          profileNavigate(screenName,{addressId:0,totalAmt:0})
      break;
      case 'Chat':
          profileNavigate(screenName)
      break;
      default:
        profileNavigate(screenName)
    }
}

onAppleLogout = async () => {
    //
    const requestOptions = {
      requestedOperation: AppleAuthRequestOperation.LOGOUT,
    };
    //
    const { user } = await appleAuth.performRequest(requestOptions);
    const credentialState = await appleAuth.getCredentialStateForUser(user);
    //
    if (credentialState === AppleAuthCredentialState.REVOKED) {
      alert('REVOKED')
    }else if(credentialState === AppleAuthCredentialState.NOT_FOUND){
      alert('NOT_FOUND')
    }else if(credentialState === AppleAuthCredentialState.TRANSFERRED){
      alert('TRANSFERRED')
    }
};

export default ProfileRow;
