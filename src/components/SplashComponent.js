import React,{Component} from 'react';
import {
  View,
  Image,
  Platform,
  NativeModules,
  PermissionsAndroid
} from 'react-native';
//
import Flurry from 'react-native-flurry-sdk';
//
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import {setToken} from '../redux/actions/SetTokenActions';
import {setLatitude,setLongitude,setCityData} from '../redux/actions/SetLatLongAction';
import {setCartCounter} from '../redux/actions/cartCounterAction';
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
//
import DefaultPreference from 'react-native-default-preference';
import { StackActions,NavigationActions } from 'react-navigation';
//
import Geolocation from '@react-native-community/geolocation';
//
import Geocoder from 'react-native-geocoder';
//
var currentToken='1'
var cartCounterValue=0
var languageCode='en'
class SplashComponent extends Component{

  constructor(props){
    super(props)
    const deviceLanguage =
          Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
              NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
            : NativeModules.I18nManager.localeIdentifier;
    //
    this.settingFlurryData()
    //
    // this.props.setLatitude(3.44448)
    // this.props.setLongitude(6.677788)
    // this.props.setCityData('Ahmedabad')
    //
    this.permissonFunction()
  }

    settingFlurryData=()=>{
        //
        // Flurry.getVersions().then((versions) => {
        //   //alert('Versions: ' + versions.agentVersion + ' : ' + versions.releaseVersion + ' : ' + versions.sessionId);
        // });
        //
        //Flurry.setAge(36);
      //  Flurry.setGender(Flurry.Gender.FEMALE);
        Flurry.setReportLocation(true);
        Flurry.setUserId('1');
        Flurry.setDataSaleOptOut(true);
        Flurry.UserProperties.set('userToken','123')
        Flurry.UserProperties.set('userName','test')
        Flurry.UserProperties.set('userEmailId','test70506@gmail.com')
        // Set user properties.
        Flurry.UserProperties.set(Flurry.UserProperties.PROPERTY_REGISTERED_USER, 'True');

        // Log Flurry events.
        // Flurry.logEvent('React Native Event');
        // Flurry.logEvent('React Native Timed Event', {param: 'true'}, true);
        // Flurry.endTimedEvent('React Native Timed Event');
    }

    performTimeConsumingTask = async() => {
      return new Promise((resolve) =>
        setTimeout(
          () => { resolve('result') },
          4000
        )
      );
    }

    getCityNameFromLatLong=(that,latitude,longitude)=>{
      //
      // fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&key='+googleMapKey, {
      //       method: 'GET'
      // })
      // .then((response) => JSON.stringify(response))
      // .then((responseJson) => {
      //     //Success
      //     // alert('City '+JSON.stringify(responseJson))
      //     that.props.setCityData(responseJson.plus_code.compound_code.split(',')[0].split(' ')[1])
      //     //
      // })
      // .catch((error) => {
      //   // alert(error)
      //   console.log('City error '+JSON.stringify(error));
      // });
      //
      if(longitude!='' && latitude!=''){
         //alert(latitude+' '+longitude)
      Geocoder.geocodePosition({lat:parseFloat(latitude),lng:parseFloat(longitude)}).then(res => {
               //alert(JSON.stringify(res[0].locality))
                that.props.setCityData(res[0].locality)
            })
            .catch(err => console.log(err))
       }
    }
    permissonFunction(){
            var that=this;
                  if(Platform.OS === 'android'){

                    async function requestLocationPermission() {
                        try {
                                const granted = await PermissionsAndroid.request(
                                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                                    'title': 'Location Access Required',
                                    'message': 'This App needs to Access your location'
                                  })
                                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                    that.callLocation(that);
                                }else{
                                  requestLocationPermission();
                                }
                            } catch (err) {
                              // alert(JSON.stringify(err))
                                console.warn(err)
                           }
                        }
                    requestLocationPermission();
                  }else{
                    this.callLocation(that);
                 }
            }
          //
        callLocation(that){
            //

            try {
                Geolocation.getCurrentPosition(info =>{
                    //
                    // alert('latitude---> '+info.coords.latitude+'longitude---> '+info.coords.longitude);
                    // console.log('Splash screen longitude---> '+info.coords.longitude);
                    //
                    that.props.setLatitude(info.coords.latitude)
                    that.props.setLongitude(info.coords.longitude)
                    // that.props.setCityData('Ahmedabad')
                    that.getCityNameFromLatLong(that,info.coords.latitude,info.coords.longitude)
                    //
                  },(error) => {
                     // alert('error happens '+(JSON.stringify(error.message)))
                  }
                );
            }catch (err) {
          }
       }

    async componentDidMount() {
      //
      var that = this
      //
      DefaultPreference.get('userToken').then(function(value) {
        currentToken = value
        return value;
      });
      DefaultPreference.get('cartCounterValue').then(function(value) {
        cartCounterValue = value
        return value;
      });
      DefaultPreference.get('changeLanguage').then(function(value) {
        //
        if(value==null){
          languageCode = (deviceLanguage.split('_')[0]==='fr')?'fr':'en'
        }else{
          languageCode = value
        }
        return value;
      });
      //

      //
      const data = await this.performTimeConsumingTask();
      //
      if (data !== null) {
        const {navigate} = this.props.navigation;
        //
        this.props.setCartCounter((cartCounterValue==undefined)?0:cartCounterValue)
        this.props.setToken(currentToken)
        this.props.setLanguageCode(languageCode)
        //
        DefaultPreference.get('isLogin')
        .then(function(value) {
          console.log(value)
          if(value == undefined){
            //
            const deviceLanguage =
                  Platform.OS === 'ios'
                    ? NativeModules.SettingsManager.settings.AppleLocale ||
                      NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
                    : NativeModules.I18nManager.localeIdentifier;
            navigate('Login',{languageCode:(deviceLanguage.split('_')[0]=='fr')?"1":"0"});
          }else{
            navigate('Dashboard');
          }
        })
      }
    }

  render(){
    return(
      <View style={{flexGrow:1}}>
          <Image  source={require('../../images/backgrounds/splash.png')}
                 style={{flex:1 , width: undefined, height: undefined}}/>
      </View>
    );
  }
}

mapStateToProps=state=>{
  return{
     splashData:state
  }
}

export default connect(mapStateToProps,{setToken,setCartCounter,setLanguageCode,setLatitude,setLongitude,setCityData})(SplashComponent);
