/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  Button,
  Dimensions,
  PixelRatio,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
//
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
//
import {checkEmail,checkReset} from '../redux/actions/CheckValidationAction';
import {connect} from 'react-redux';
import {setToken} from '../redux/actions/SetTokenActions';
import {postRequest,reset} from '../redux/actions/ApiCallerAction';
import {FORGOTPASSWORD} from '../utils/ApiMethods';
import { StackActions,NavigationActions } from 'react-navigation';
import DefaultPreference from 'react-native-default-preference';
import { NavigationEvents } from 'react-navigation';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
var isFirst = true;
class ForgotPassword extends Component{
    constructor(props){
      super(props);
      stringsoflanguages.setLanguage((this.props.data.getLanguageCode.languageCode=='fr')?'fr':'en');
    }
    render(){
        const {navigate} = this.props.navigation;

        if(this.props.data.apiData.isFetchning===false && (this.props.data.apiData.data.data!==undefined) && this.props.data.apiData.screenName=='ForgotPassword'){
            DefaultPreference.set('currentState', 'Login').then(function() {

            });
            this.props.reset();
            Alert.alert(
                '',
                this.props.data.apiData.data.message,
                [
                  {text: stringsoflanguages.okText, onPress: () => {this.props.checkReset(),navigate('Login')}},
                ],
                {cancelable: false},
              );
        }else{
          if(this.props.data.apiData.error.status!==undefined){
            this.props.reset();
          }
        }
        return(
              <KeyboardAvoidingView style={{flexGrow:1,backgroundColor:global.LIGHT_YELLOW}} behavior="padding" enabled>
                  <View style={{flexGrow:1,backgroundColor:global.LIGHT_YELLOW}}>
                        <NavigationEvents
                          onWillFocus={payload => console.log('CatCom will focus', payload)}
                          onDidFocus={payload => console.log('CatCom will focus', payload)}
                          onWillBlur={payload => {this.props.checkReset()}}
                          onDidBlur={payload => {this.props.checkReset()}}
                         />
                        <SafeAreaView style={{flexshrink:0}}/>
                        <SafeAreaView style={{flexGrow:1}}>
                              <Image  source={require('../../images/backgrounds/login_bg_cover.png')}
                                      style={global.COMMON_STYLES.backgroundImg}/>

                              {/* All View as showing inside View Tag*/}
                              <View style={{flexGrow:1,flexDirection:'column',position:'relative'}}>

                                    <View style={{flexGrow:1,flexBasis:0,justifyContent:'center',alignItems:'center'}}>
                                          <Image  source={require('../../images/icon/app_icon.png')}
                                                  style={styles.appImageStyle}/>
                                    </View>
                                    <View style={{flexGrow:1,flexBasis:0,padding:30,flexDirection:'column'}}>
                                          <View style={{flexDirection:'row',marginLeft:30,justifyContent:'flex-start',marginBottom:10}}>
                                                <Image  source={require('../../images/icon/login_register/forgot_green.png')}
                                                        style={{resizeMode:'contain',width:25,height:25}}/>
                                                <Text style={{marginLeft:10,color:global.DARK_GREEN,fontSize:20,textAlign:'center'}}>{stringsoflanguages.forgotPasswordCaps}</Text>
                                          </View>
                                          <View style={{elevation:10,flexGrow:1}}>
                                                <Image  source={require('../../images/backgrounds/forgot_bg.png')}
                                                        style={{resizeMode:'stretch',width:Dimensions.get('window').width-30,height:250,alignSelf:'center'}}/>
                                                <View style={{flexDirection:'column',width:Dimensions.get('window').width-30,position:'absolute'}}>
                                                        <Text style={{marginLeft:30,marginTop:40,color:'#6B6B6B',fontSize:16}}>{stringsoflanguages.emailID}</Text>
                                                        <View style={global.COMMON_STYLES.textInputUserMod}>
                                                                      <Image  source={require('../../images/icon/login_register/enmail.png')}
                                                                              style={{resizeMode:'contain',marginLeft:20,width:20,height:20}}/>
                                                                      <TextInput  style={{flex:1,height: 40,marginLeft:8,color:'#6B6B6B',color:(this.props.data.validation.isEmailValid)?global.DARK_GREEN:'red'}}
                                                                                  autoCapitalize = 'none'
                                                                                  placeholder={stringsoflanguages.enterEmailID}
                                                                                  onChangeText={(value) => this.props.checkEmail(value)}
                                                                                  returnKeyLabel={"next"}
                                                                                  value={this.props.data.validation.emailText} />
                                                        </View>
                                                        {
                                                        (this.props.data.apiData.isFetchning)?
                                                           <ActivityIndicator style={{marginTop:35,marginRight:30,width:60,height:60,alignSelf:'center'}} size="large" color="#035B00"/>
                                                           :<TouchableOpacity onPress={this.onSubmitForgotData}>
                                                                         <Image  source={require('../../images/icon/btn.png')}
                                                                                 style={{resizeMode:'contain',marginTop:35,marginRight:30,width:60,height:60,alignSelf:'center'}}/>
                                                           </TouchableOpacity>
                                                        }

                                                </View>
                                          </View>
                                    </View>
                                    <View style={{flexGrow:1,flexBasis:0}}></View>
                                    <TouchableOpacity style={{backgroundColor:'rgba(227, 70, 30, 0.8)',width:35,height:35,margin:25,
                                                              justifyContent:'center',alignItems:'center',position:'absolute'}}
                                                      onPress={()=>navigate('Login')}>
                                                <Image source={require('../../images/header/back_arrow_white.png')}
                                                       style={{resizeMode:'contain',width:25,height:25}}/>
                                    </TouchableOpacity>
                              </View>
                        </SafeAreaView>
                  </View>
              </KeyboardAvoidingView>
        );
    }

    onSubmitForgotData=()=>{
        //
        if(this.props.data.validation.isEmailValid){
          //
          let requestData = {
            "emailID":this.props.data.validation.emailText,
            "languageCode":(this.props.data.getLanguageCode.languageCode=='fr')?'1':'0'
          };
          //
          this.props.postRequest(FORGOTPASSWORD,requestData);
          //
        }else if(this.props.data.validation.emailText==''){
              alert(stringsoflanguages.pleaseEnterEmailID)
        }else if(this.props.data.validation.isEmailValid==false){
              alert(stringsoflanguages.enterValidEmail)
        }
    }
}

const styles = StyleSheet.create({
      appImageStyle: {
          resizeMode:'contain',
          width:Utils.widthPercentageToDP('65%'),
          height:Utils.heightPercentageToDP('65%')
      },
      shadowBox:{
          elevation: 10,
          flexGrow:1,
          backgroundColor: 'white',
          ...Platform.select({
                ios: {
                   shadowColor:'black',
                   shadowOffset:{width:10,height: 10},
                   shadowRadius: 10,
                   shadowOpacity: 0.6
                },
                android: {

                }
        })
      }
});

mapStateToProps=state=>{
  return{
     data:state
  }
}

export default connect(mapStateToProps,
  {postRequest,
   reset,
   checkEmail,
   checkReset,
   setToken,
   setLanguageCode
  })
  (ForgotPassword);
