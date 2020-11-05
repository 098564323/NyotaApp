import React, {Component} from 'react';

import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Alert,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView
} from 'react-native';

import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import {postRequest,reset} from '../redux/actions/ApiCallerAction';
import {checkEmail,checkPassword,checkReset} from '../redux/actions/CheckValidationAction';
import {setToken} from '../redux/actions/SetTokenActions';
import {setCartCounter} from '../redux/actions/cartCounterAction';
import {LOGIN,REGISTER} from '../utils/ApiMethods';
import DefaultPreference from 'react-native-default-preference';
import { StackActions,NavigationActions } from 'react-navigation';
import { NavigationEvents } from 'react-navigation';
//
import firebase from 'react-native-firebase';
import { LoginManager,AccessToken, GraphRequestManager, GraphRequest,LoginButton } from 'react-native-fbsdk'
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
import appleAuth,{
  AppleButton,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthError } from '@invertase/react-native-apple-authentication';
//
import {BASE_URL} from '../utils/ApiMethods';
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
//
var fcmTokenStr = '';
var languageCode = '0';
//
class LoginComponent extends Component{
    //
   handleFacebookLogin=(currentNavigation,setToken)=>{
    let tempThis = this;
    LoginManager.logInWithPermissions(['public_profile','email'])
      .then(result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
            result.grantedPermissions.toString()
          );

          AccessToken.getCurrentAccessToken().then(data=>{
            //
            const token = data.accessToken.toString();
            //
            const req = new GraphRequest(
              `/me?`,
              {
                httpMethod: 'GET',
                version: 'v3.3',
                parameters: {
                  fields: {
                    string: 'email,name,first_name,middle_name,last_name',
                  },
                },
              },
              (err, res) => {
                if (err) {
                  console.error(err);
                } else {
                  this.socialLoginAPI(res.email,res.name,'1','')
                }
              }
            );
            new GraphRequestManager().addRequest(req).start();
          });
        }
      })
      .catch(error => {
          console.log('Login fail with error: ' + error);
      });
    }
    //Setting Login Data
    setLoginData = (userTokenProps,userLanguageCode) =>{
        this.props.setCartCounter(0)
        //
        client.defaults.headers.common['Authorization'] = 'Bearer '+userTokenProps;
        //
        client.get('getcart')
        .then((response) => {
            //
            if(response.data.data!=undefined)
                this.props.setCartCounter(response.data.data.length)
         }, (error) => {
            console.log(error.message);
        });
        //
        this.props.setLanguageCode((userLanguageCode=='0')?'en':'fr')
        DefaultPreference.set('changeLanguage', (userLanguageCode=='0')?'en':'fr')
          .then(function() {});
        //
        this.props.reset();
        this.props.checkReset();
        this.props.setToken(userTokenProps)
        //
        const resetAction = StackActions.reset({
              index: 0,
              params: {
                'loginToken':userTokenProps
              },
              actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
        });
        const currentNavigation = this.props.navigation;
        //
        DefaultPreference.set('userToken', userTokenProps)
          .then(function() {
              //
              new Promise((resolve, reject) => {
                  currentNavigation.dispatch(resetAction);
              });
          });
        //
        if(userTokenProps!='-1')
          DefaultPreference.set('isLogin', 'success').then(function() {});
        //
    }
    socialLoginAPI = (email,password,socialType,appleID) => {
      this.setState({
        isSocial:true
      })
      //
      let requestData = {
        "emailID":email,
        "password":"",
        "name":password,
        "deviceId":"",
        "token":fcmTokenStr,
        "userType":socialType,
        "appleId":appleID
      };
      client.post('login',requestData)
      .then((response) => {
            //
            this.setState({
              isSocial:false
            })
            //
            DefaultPreference.set('SocialTypeCode', socialType).then(function() {});
            this.setLoginData(response.data.data[0].token,response.data.languageCode);
            //
         }, (error) => {
             //
             this.setState({
               isSocial:false
             })
             ///
      });
    }
    //On Apple Button Press
    onAppleButtonPress = async () => {
      try {
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [
              AppleAuthRequestScope.EMAIL,
              AppleAuthRequestScope.FULL_NAME,
            ],
          });
          const {
            email,
            nonce,
            identityToken,
            realUserStatus,
          } = appleAuthRequestResponse;
          // get current authentication state for user
          const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
          //
          if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
            //
            this.socialLoginAPI(appleAuthRequestResponse.email,
              (appleAuthRequestResponse.fullName.givenName+' '+appleAuthRequestResponse.fullName.familyName),
              '2',appleAuthRequestResponse.user)
            //
            return;
          }
        } catch (err) {
          if (err.code===AppleAuthError.FAILED) {
            alert('FAILED')
          }
          if (err.code===AppleAuthError.INVALID_RESPONSE) {
            alert('INVALID_RESPONSE')
          }
          if (err.code===AppleAuthError.NOT_HANDLED) {
            alert('NOT_HANDLED')
          }
          if (err.code===AppleAuthError.UNKNOWN) {
            alert('UNKNOWN')
          }
      }
    };
    //
    _requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        return result === PermissionsAndroid.RESULTS.GRANTED || result === true
      }
      return true
    }
    //
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
                                //that.callLocation(that);
                            }
                            else{
                              alert("Permission Denied");
                            }
                        } catch (err) {
                            //alert("err",err);
                            console.warn(err)
                         }
                      }
                   requestLocationPermission();
                  }else{
                    //this.callLocation(that);
                 }
     }
    constructor(props) {
        super(props);
        //
        languageCode = this.props.navigation.state.params.languageCode;
        //
        this.onPressFooterOption = this.onPressFooterOption.bind(this);
        this.props.setLanguageCode((languageCode=='1')?'fr':'en')
        stringsoflanguages.setLanguage((languageCode=='1')?'fr':'en');
        //
        DefaultPreference.clear('isLogin').then(function() {
        });
        //
        firebase.messaging().getToken()
        .then(fcmToken => {
          if (fcmToken) {
            fcmTokenStr = fcmToken
          } else {
            fcmTokenStr = fcmToken
          }
        });
        //
        this.state={
          socialEmail:'',
          isSocial:false
        }
    }
    //
   componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        //
        async ({ _, status }) => {
          if (status !== 'PERMISSION_GRANTED') {
            await this._requestPermissions()
          }
        }
        //
    }
    //
    componentWillUnmount() {
      this.backHandler.remove()
    }
    //
    handleBackPress = () => {
      BackHandler.exitApp();
      return true;
    }
    //
    render(){
      const {navigate} = this.props.navigation;
      //
      if(this.props.loginData.apiData.isFetchning===false
        && this.props.loginData.apiData.data.data!==undefined
        && this.props.loginData.apiData.screenName=='Login'){
          //
          this.setLoginData(this.props.loginData.apiData.data.data[0].token,this.props.loginData.apiData.data.languageCode);
          //
      }else{
        if(this.props.loginData.apiData.error.status!==undefined){
          //
          Alert.alert(
              '',
              this.props.loginData.apiData.error.message,
              [
                {text: stringsoflanguages.okText},
              ],
              {cancelable: false},
            );
          this.props.reset();
        }
    }
      return(
          (Platform.OS=='ios')?
          <KeyboardAvoidingView style={{flex:1 }} behavior="padding" enabled>
            <View style={{flexGrow:1,backgroundColor:global.LIGHT_YELLOW}}>
                      <NavigationEvents
                        onWillFocus={payload => {this.props.reset()}}
                        onDidFocus={payload => console.log('')}
                        onWillBlur={payload => console.log('')}
                        onDidBlur={payload => console.log('')}/>
                      <SafeAreaView style={{flexshrink:0}}/>
                        <SafeAreaView style={{flexGrow:1}}>
                                  <Image source={require('../../images/backgrounds/login_bg_cover.png')}
                                             style={global.COMMON_STYLES.backgroundImg}/>
                                  <ScrollView style={{flexBasis: 0,paddingBottom: 20}}>
                                            <View style={{justifyContent:'center',flexBasis: 0,alignItems:'center'}}>
                                                  <Image source={require('../../images/icon/app_icon.png')}
                                                             resizeMode='contain'
                                                             style={[global.COMMON_STYLES.appImageBGUserMod,{height: Dimensions.get('window').height/3.5}]}/>
                                            </View>
                                            <View style={{paddingLeft: 30,paddingRight: 30}}>
                                                  <View style={{flexGrow:1,flexBasis:0,flexDirection:'column'}}>
                                                         <View style={{flexDirection:'row',justifyContent:'space-between',marginLeft: 10,marginRight: 10}}>
                                                                 <View style={{flexDirection:'row',alignItems: 'center'}}>
                                                                              <Image  source={require('../../images/icon/login_register/sign_in_green.png')}
                                                                                      style={{resizeMode:'contain',width:20,height:20}}/>
                                                                              <Text style={{marginLeft:5,color:global.DARK_GREEN,fontSize:18,textAlign:'center'}}>{stringsoflanguages.singIn}</Text>
                                                                </View>
                                                                <TouchableOpacity onPress={() => navigate('Register',{languageCode:languageCode})}>
                                                                        <View style={{flexDirection:'row',alignItems: 'center'}}>
                                                                              <Image  source={require('../../images/icon/login_register/register__grey.png')}
                                                                                      style={{resizeMode:'contain',width:20,height:20}}/>
                                                                              <Text style={{marginLeft:5,color:global.DARK_GRAY,fontSize:18,textAlign:'center'}}>{stringsoflanguages.singUp}</Text>
                                                                        </View>
                                                                </TouchableOpacity>
                                                         </View>
                                                         <View style={{elevation:10,flexShrink: 1,marginTop: 10}}>
                                                              <Image  source={require('../../images/backgrounds/login_bg.png')}
                                                                      style={{resizeMode:'stretch',alignSelf: 'center',width:Dimensions.get('window').width-30,height: 365}}/>
                                                              <View style={{flexDirection:'column',width:Dimensions.get('window').width-30,position:'absolute'}}>
                                                              <Text style={{marginLeft:30,marginTop:40,color:'#6B6B6B',fontSize:16}}>{stringsoflanguages.emailID}</Text>
                                                                    <View style={global.COMMON_STYLES.textInputUserMod}>
                                                                          <Image  source={require('../../images/icon/login_register/enmail.png')}
                                                                                  style={{resizeMode:'contain',marginLeft:20,width:20,height:20}}/>
                                                                          <TextInput  style={{flex:1,height: 40,marginLeft:8,color:'#6B6B6B',color:(this.props.loginData.validation.isEmailValid)?global.DARK_GREEN:'red'}}
                                                                                      autoCapitalize = 'none'
                                                                                      placeholder={stringsoflanguages.enterEmailID}
                                                                                      onChangeText={(value) => this.props.checkEmail(value)}
                                                                                      returnKeyLabel={"next"}
                                                                                      value={this.props.loginData.validation.emailText}
                                                                                      onSubmitEditing={() => { this.email.focus(); }}
                                                                                      />
                                                                    </View>
                                                                    <Text style={{marginLeft:30,marginTop:20,color:'#6B6B6B',fontSize:16}}>{stringsoflanguages.password}</Text>
                                                                    <View style={global.COMMON_STYLES.textInputUserMod}>
                                                                          <Image  source={require('../../images/icon/login_register/password.png')}
                                                                                  style={{resizeMode:'contain',marginLeft:20,width:20,height:20}}/>
                                                                          <TextInput  style={{flex:1,
                                                                                              height: 40,
                                                                                              marginLeft:8,
                                                                                              color:(this.props.loginData.validation.isPasswordValid)?global.DARK_GREEN:'red'}}
                                                                                              secureTextEntry={true}
                                                                                              ref={(input) => this.email = input}
                                                                                              placeholder={stringsoflanguages.enterPassword}
                                                                                              autoCapitalize = 'none'
                                                                                              onChangeText={(value) => this.props.checkPassword(value)}
                                                                                              returnKeyLabel={"focus"}
                                                                                              value={this.props.loginData.validation.passwordText}
                                                                                      />
                                                                    </View>
                                                                    <TouchableOpacity onPress={this.onForgotClick}>
                                                                          <View style={{flexDirection: 'row',marginTop: 15,marginLeft:40}}>
                                                                                <Image  source={require('../../images/icon/login_register/forgot.png')}
                                                                                        style={{resizeMode:'contain',width:20,height:20}}/>
                                                                                <Text style={{height: 40,marginLeft:8,color:'#6B6B6B'}}>{stringsoflanguages.forgotPassword}</Text>

                                                                          </View>
                                                                    </TouchableOpacity>
                                                                    {
                                                                    (this.props.loginData.apiData.isFetchning)?
                                                                       <ActivityIndicator style={{width:60,height:60,marginRight: 30,alignSelf: 'center'}} size="large" color="#035B00"/>
                                                                       :<TouchableOpacity onPress={this.onSubmitLoginData} style={{width:60,height:60,marginRight: 30,alignSelf: 'center'}}>
                                                                             <Image  source={require('../../images/icon/btn.png')}
                                                                                     style={{resizeMode:'contain',width:60,height:60}}/>
                                                                       </TouchableOpacity>
                                                                  }

                                                              </View>
                                                        </View>
                                                        <TouchableOpacity onPress={this.handleFacebookLogin.bind(this,this.props.navigation,this.props.setToken)}>
                                                        <Image  source={(this.props.loginData.getLanguageCode.languageCode=='fr')?require('../../images/icon/login_register/fb_image_fr.png'):require('../../images/icon/login_register/fb_image.png')}
                                                                style={{marginTop: 20,resizeMode:'contain',height:50,width:Dimensions.get('window').width-60}}/>
                                                        </TouchableOpacity>
                                                        <AppleButton
                                                                buttonStyle={AppleButton.Style.BLACK}
                                                                buttonType={AppleButton.Type.SIGN_IN}
                                                                cornerRadius={23}
                                                                style={{
                                                                  marginTop:10,
                                                                  width: Dimensions.get('window').width-60,
                                                                  height: 46
                                                                }}
                                                                onPress={() => this.onAppleButtonPress()}
                                                              />
                                                         <Text style={{color:global.LIGHT_GRAY,fontSize:16,marginTop: 30,width: Dimensions.get('window').width-60,textAlign: 'center'}}>OR</Text>
                                                         <TouchableOpacity onPress={()=>{this.setLoginData('-1','0')}}>
                                                                <Text style={{color:global.LIGHT_GRAY,fontSize:16,marginTop: 20,width: Dimensions.get('window').width-60,textAlign: 'center'}}>Guest User</Text>
                                                         </TouchableOpacity>
                                                        {this.props.loginData.getLanguageCode.languageCode=='en'?
                                                        <View style={{marginTop: 70,paddingBottom: 20,flexDirection:'row',justifyContent:'space-between',marginLeft: 0,marginRight: 0}}>
                                                            <TouchableOpacity onPress={() => this.onPressFooterOption('Privacy Policy',1)}>
                                                                <Text style={{color:global.LIGHT_GRAY,fontSize:16}}>{stringsoflanguages.privacyPolicy}</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => this.onPressFooterOption('About Us',2)}>
                                                                <Text style={{color:global.LIGHT_GRAY,fontSize:16}}>{stringsoflanguages.aboutUs}</Text>
                                                            </TouchableOpacity>
                                                        </View>:
                                                        <View style={{marginTop: 70,paddingBottom: 20,flexDirection:'column',justifyContent:'center',marginLeft: 0,marginRight: 0}}>
                                                            <TouchableOpacity onPress={() => this.onPressFooterOption('Privacy Policy',1)}>
                                                                <Text style={{color:global.LIGHT_GRAY,fontSize:16,alignSelf: 'center'}}>{stringsoflanguages.privacyPolicy}</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => this.onPressFooterOption('About Us',2)}>
                                                                <Text style={{color:global.LIGHT_GRAY,fontSize:16,alignSelf: 'center',marginTop: 15}}>{stringsoflanguages.aboutUs}</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                      }
                                                   </View>

                                             </View>
                                             {/*this.state.isSocial?
                                             <View style={{justifyContent: 'center',alignItems: 'center',width: Dimensions.get('window').width,height:1000,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
                                                    {/*<Text style={{color: 'white',fontSize: 22}}>Fetching Records...</Text>
                                                    <ActivityIndicator/>
                                             </View>:
                                             null
                                            */}
                                  </ScrollView>

                      </SafeAreaView>
                      {this.state.isSocial?
                      <View style={{position:'absolute',justifyContent: 'center',alignItems: 'center',width: Dimensions.get('window').width,height:1000,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
                             <ActivityIndicator/>
                      </View>:null}
                </View>
                </KeyboardAvoidingView>
                :
                <View style={{flexGrow:1,backgroundColor:global.LIGHT_YELLOW}}>
                          <NavigationEvents
                            onWillFocus={payload => {this.props.reset()}}
                            onDidFocus={payload => console.log('')}
                            onWillBlur={payload => console.log('')}
                            onDidBlur={payload => console.log('')}
                           />
                          <SafeAreaView style={{flexshrink:0}}/>
                            <SafeAreaView style={{flexGrow:1}}>
                                      <Image source={require('../../images/backgrounds/login_bg_cover.png')}
                                                 style={global.COMMON_STYLES.backgroundImg}/>
                                      <ScrollView style={{flexBasis: 0,paddingBottom: 20}}>
                                                <View style={{justifyContent:'center',flexBasis: 0,alignItems:'center'}}>
                                                      <Image source={require('../../images/icon/app_icon.png')}
                                                                 resizeMode='cover'
                                                                 style={[global.COMMON_STYLES.appImageBGUserMod,{height: Dimensions.get('window').height/3.5}]}/>
                                                </View>
                                                <View style={{paddingLeft: 30,paddingRight: 30}}>
                                                      <View style={{flexGrow:1,flexBasis:0,flexDirection:'column'}}>
                                                             <View style={{flexDirection:'row',justifyContent:'space-between',marginLeft: 10,marginRight: 10}}>
                                                                     <View style={{flexDirection:'row',alignItems: 'center'}}>
                                                                                  <Image  source={require('../../images/icon/login_register/sign_in_green.png')}
                                                                                          style={{resizeMode:'contain',width:20,height:20}}/>
                                                                                  <Text style={{marginLeft:5,color:global.DARK_GREEN,fontSize:18,textAlign:'center'}}>{stringsoflanguages.singIn}</Text>
                                                                    </View>
                                                                    <TouchableOpacity onPress={() => navigate('Register',{languageCode:languageCode})}>
                                                                            <View style={{flexDirection:'row',alignItems: 'center'}}>
                                                                                  <Image  source={require('../../images/icon/login_register/register__grey.png')}
                                                                                          style={{resizeMode:'contain',width:20,height:20}}/>
                                                                                  <Text style={{marginLeft:5,color:global.DARK_GRAY,fontSize:18,textAlign:'center'}}>{stringsoflanguages.singUp}</Text>
                                                                            </View>
                                                                    </TouchableOpacity>
                                                             </View>
                                                             <View style={{elevation:10,flexShrink: 1,marginTop: 10}}>
                                                                  <Image  source={require('../../images/backgrounds/login_bg.png')}
                                                                          style={{resizeMode:'stretch',alignSelf: 'center',width:Dimensions.get('window').width-30,height: 365}}/>
                                                                  <View style={{flexDirection:'column',width:Dimensions.get('window').width-30,position:'absolute'}}>
                                                                  <Text style={{marginLeft:30,marginTop:40,color:'#6B6B6B',fontSize:16}}>{stringsoflanguages.emailID}</Text>
                                                                        <View style={global.COMMON_STYLES.textInputUserMod}>
                                                                              <Image  source={require('../../images/icon/login_register/enmail.png')}
                                                                                      style={{resizeMode:'contain',marginLeft:20,width:20,height:20}}/>
                                                                              <TextInput  style={{flex:1,height: 40,marginLeft:8,color:'#6B6B6B',color:(this.props.loginData.validation.isEmailValid)?global.DARK_GREEN:'red'}}
                                                                                          autoCapitalize = 'none'
                                                                                          placeholder={stringsoflanguages.enterEmailID}
                                                                                          onChangeText={(value) => this.props.checkEmail(value)}
                                                                                          returnKeyLabel={"next"}
                                                                                          value={this.props.loginData.validation.emailText}
                                                                                          onSubmitEditing={() => { this.email.focus(); }}
                                                                                          />
                                                                        </View>
                                                                        <Text style={{marginLeft:30,marginTop:20,color:'#6B6B6B',fontSize:16}}>{stringsoflanguages.password}</Text>
                                                                        <View style={global.COMMON_STYLES.textInputUserMod}>
                                                                              <Image  source={require('../../images/icon/login_register/password.png')}
                                                                                      style={{resizeMode:'contain',marginLeft:20,width:20,height:20}}/>
                                                                              <TextInput  style={{flex:1,
                                                                                                  height: 40,
                                                                                                  marginLeft:8,
                                                                                                  color:(this.props.loginData.validation.isPasswordValid)?global.DARK_GREEN:'red'}}
                                                                                                  secureTextEntry={true}
                                                                                                  ref={(input) => this.email = input}
                                                                                                  placeholder={stringsoflanguages.enterPassword}
                                                                                                  autoCapitalize = 'none'
                                                                                                  onChangeText={(value) => this.props.checkPassword(value)}
                                                                                                  returnKeyLabel={"focus"}
                                                                                                  value={this.props.loginData.validation.passwordText}
                                                                                          />
                                                                        </View>
                                                                        <TouchableOpacity onPress={this.onForgotClick}>
                                                                              <View style={{flexDirection: 'row',marginTop: 15,marginLeft:40}}>
                                                                                    <Image  source={require('../../images/icon/login_register/forgot.png')}
                                                                                            style={{resizeMode:'contain',width:20,height:20}}/>
                                                                                    <Text style={{height: 40,marginLeft:8,color:'#6B6B6B'}}>{stringsoflanguages.forgotPassword}</Text>

                                                                              </View>
                                                                        </TouchableOpacity>
                                                                        {
                                                                        (this.props.loginData.apiData.isFetchning)?
                                                                           <ActivityIndicator style={{width:60,height:60,marginRight: 30,alignSelf: 'center'}} size="large" color="#035B00"/>
                                                                           :<TouchableOpacity onPress={this.onSubmitLoginData} style={{width:60,height:60,marginRight: 30,alignSelf: 'center'}}>
                                                                                 <Image  source={require('../../images/icon/btn.png')}
                                                                                         style={{resizeMode:'contain',width:60,height:60}}/>
                                                                           </TouchableOpacity>
                                                                      }

                                                                  </View>
                                                            </View>
                                                            <TouchableOpacity onPress={this.handleFacebookLogin.bind(this,this.props.navigation,this.props.setToken)}>
                                                            <Image  source={(this.props.loginData.getLanguageCode.languageCode=='fr')?require('../../images/icon/login_register/fb_image_fr.png'):require('../../images/icon/login_register/fb_image.png')}
                                                                    style={{marginTop: 20,resizeMode:'contain',height:50,width:Dimensions.get('window').width-60}}/>
                                                            </TouchableOpacity>
                                                            {this.props.loginData.getLanguageCode.languageCode=='en'?
                                                            <View style={{marginTop: 15,paddingBottom: 20,flexDirection:'row',justifyContent:'space-between',marginLeft: 0,marginRight: 0}}>
                                                                <TouchableOpacity onPress={() => this.onPressFooterOption('Privacy Policy',1)}>
                                                                    <Text style={{color:global.LIGHT_GRAY,fontSize:16}}>{stringsoflanguages.privacyPolicy}</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => this.onPressFooterOption('About Us',2)}>
                                                                    <Text style={{color:global.LIGHT_GRAY,fontSize:16}}>{stringsoflanguages.aboutUs}</Text>
                                                                </TouchableOpacity>
                                                            </View>:
                                                            <View style={{marginTop: 15,paddingBottom: 20,flexDirection:'column',justifyContent:'center',marginLeft: 0,marginRight: 0}}>
                                                                <TouchableOpacity onPress={() => this.onPressFooterOption('Privacy Policy',1)}>
                                                                    <Text style={{color:global.LIGHT_GRAY,fontSize:16,alignSelf: 'center'}}>{stringsoflanguages.privacyPolicy}</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => this.onPressFooterOption('About Us',2)}>
                                                                    <Text style={{color:global.LIGHT_GRAY,fontSize:16,alignSelf: 'center',marginTop: 15}}>{stringsoflanguages.aboutUs}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            }
                                                       </View>

                                                 </View>
                                                 {this.state.isSocial?
                                                 <View style={{position: 'absolute',justifyContent: 'center',alignItems: 'center',width: Dimensions.get('window').width,height:Dimensions.get('window').height,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
                                                        {/*<Text style={{color: 'white',fontSize: 22}}>Fetching Records...</Text>*/}
                                                        <ActivityIndicator/>
                                                 </View>:null
                                               }
                                      </ScrollView>
                          </SafeAreaView>
                    </View>
      );
    }

    onForgotClick=()=>{
      DefaultPreference.set('currentState', 'ForgotPassword').then(function() {

      });
      this.props.navigation.navigate('ForgotPassword')
    }
    onPressFooterOption=(screenName,screenID)=>{
      //
      DefaultPreference.set('currentState', 'PrivactAboutUs').then(function() {

      });
      //
      this.props.navigation.navigate('PrivactAboutUs', {
              title:screenName,
              id:screenID,
              languageCode:languageCode
            });
    }

    onSubmitLoginData=()=>{

        if(this.props.loginData.validation.isEmailValid && this.props.loginData.validation.isPasswordValid){
            //
            DefaultPreference.set('currentState', 'Login').then(function() {

            });
            //
            let requestData = {
              "emailID":this.props.loginData.validation.emailText,
              "password":this.props.loginData.validation.passwordText,
              "deviceId":"",
              "token":fcmTokenStr,
              "userType":"0",
              "languageCode":languageCode,
              "appleId":""
            };
            //
            this.props.postRequest(LOGIN,requestData);
            //
          }else{
            if(this.props.loginData.validation.emailText==''){
              alert(stringsoflanguages.emailCanNotBlank)
            }else if(!this.props.loginData.validation.isEmailValid){
              alert(stringsoflanguages.enterValidEmail)
            }else if(this.props.loginData.validation.passwordText==''){
              alert(stringsoflanguages.passwordCanNotBlank)
            }else if(!this.props.loginData.validation.isPasswordValid){
              alert(stringsoflanguages.passwordMust6Long)
            }
            //
            if(this.props.loginData.validation.isEmailBlank){
              console.log('Error :: '+this.props.loginData.validation.isEmailBlank)
            }else if(this.props.loginData.validation.isPasswordBlank){
              console.log('Error :: '+this.props.loginData.validation.isPasswordBlank)
            }
          }
    }

    //
    checkCartCounterData=()=>{
      //
      client.defaults.headers.common['Authorization'] = 'Bearer '+this.props.loginData.apiData.data.data[0].token;
      //
      client.get('getcart')
      .then((response) => {
          //
          if(response.data.data!=undefined)
              this.props.setCartCounter(response.data.data.length)
          //
       }, (error) => {
          console.log(error.message);
      });
    }
    //
}
//
mapStateToProps=state=>{
  return{
     loginData:state
  }
}
//
export default connect(mapStateToProps,{checkReset,postRequest,reset,checkEmail,checkPassword,setToken,setCartCounter,setLanguageCode})(LoginComponent);
