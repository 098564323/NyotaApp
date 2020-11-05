import React,{Component} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Animated,
  Keyboard,
  Alert,
  UIManager
} from 'react-native';
import { CheckBox } from 'react-native-elements'
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
//
import {checkEmail,checkPassword,checkCity,checkName,checkNumber,checkReset} from '../redux/actions/CheckValidationAction';
import {connect} from 'react-redux';
import {setToken} from '../redux/actions/SetTokenActions';
import {postRequest,reset} from '../redux/actions/ApiCallerAction';
import {REGISTER} from '../utils/ApiMethods';
import { StackActions,NavigationActions } from 'react-navigation';
//
import firebase from 'react-native-firebase';
import { NavigationEvents } from 'react-navigation';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';
import {BASE_URL} from '../utils/ApiMethods';
import axiosMiddleware from 'redux-axios-middleware';
//
var fcmTokenStr = '';
var languageCode = '';
var isAlert = false;
//
let drop_down_data = [];
var city_txt = '';
var cityID='';
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);

//
class RegisterComponent extends Component{
    constructor(props) {
      super(props);
      //
      languageCode = this.props.navigation.state.params.languageCode;
      stringsoflanguages.setLanguage((this.props.data.getLanguageCode.languageCode=='en')?'en':'fr');
      //
      firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          fcmTokenStr = fcmToken
        } else {
          fcmTokenStr = fcmToken
        }
      });
      this.state = {
        checked:false
      }
    }
    componentDidMount(){
      if(drop_down_data==''){
        this.callGetCityApi()
      }
    }

    callGetCityApi =()=>{
      //
      let requestData = {
        "languageCode":languageCode
      };

      client.post('http://nyota-app.com/nyotastaging/api/getcity',requestData)
      .then((response) => {
        //
        console.log('city --> '+JSON.stringify(response));
        var count = Object.keys(response.data.data).length;
        //
        for(i=0;i<count;i++){
             console.log(response.data.data[i].name)
             if(this.props.data.validation.cityText==response.data.data[i].name){
               nID=response.data.data[i].id
             }
             drop_down_data.push({ value: response.data.data[i].name,id:response.data.data[i].id});
           }
           //
           }, (error) => {
             console.log('GetCity Error  '+JSON.stringify(error.response.data));
        });
    }

    render() {
        const {navigate} = this.props.navigation;
        console.log(JSON.stringify(this.props.data.apiData.data));
        if(this.props.data.apiData.isFetchning===false && (this.props.data.apiData.data.data!==undefined)){
            //
            Alert.alert(
                '',
                this.props.data.apiData.data.message,
                [
                  {text: stringsoflanguages.okText},
                ],
                {cancelable: false},
              );
            //
            this.props.checkReset()
            const resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'Login',params:{languageCode:languageCode} })],
            });
            this.props.navigation.dispatch(resetAction);
            //
        }else{
          if(this.props.data.apiData.error.status!==undefined){
            // alert(this.props.data.apiData.error.message);
            this.props.reset();
          }
        }
        return (

            <View style={{flexGrow:1,backgroundColor:global.LIGHT_YELLOW}}>

                  <NavigationEvents
                    onWillFocus={payload => {this.props.reset()}}
                    onDidFocus={payload => {console.log('')}}
                    onWillBlur={payload => {this.props.checkReset()}}
                    onDidBlur={payload => {this.props.checkReset()}}
                   />

                  <SafeAreaView style={{flexshrink:0}}/>
                  <SafeAreaView style={{flexGrow:1}}>

                              <Image source={require('../../images/backgrounds/login_bg_cover.png')}
                                      style={global.COMMON_STYLES.backgroundImg}/>
                                      {
                                        (Platform.OS === 'ios')?
                                        <KeyboardAvoidingView behavior="padding" enabled>
                                            <this.registerView navigate={navigate}/>
                                        </KeyboardAvoidingView>:
                                            <this.registerView navigate={navigate}/>
                                      }
                  </SafeAreaView>

            </View>

        );
    }

    registerView=({navigate})=>{
      return(
        <ScrollView>
                <View style={{justifyContent: 'center',height:Dimensions.get('window').height/4,alignItems: 'center'}}>
                      <Image  source={require('../../images/icon/app_icon.png')}
                              style={global.COMMON_STYLES.appImageBGUserMod}/>
                </View>
                <View style={{flexDirection:'row',marginLeft: 50,marginRight: 50,justifyContent:'space-between'}}>
                      <TouchableOpacity onPress={() => navigate('Login',{languageCode:languageCode})}>
                      <View style={{flexDirection:'row',alignItems: 'center'}}>
                            <Image  source={require('../../images/icon/login_register/sign_in_grey.png')}
                                    style={{resizeMode:'contain',width:20,height:20}}/>
                            <Text style={{marginLeft:5,color:global.DARK_GRAY,fontSize:18,textAlign:'center'}}>{stringsoflanguages.singIn}</Text>
                      </View>
                      </TouchableOpacity>
                      <View style={{flexDirection:'row',alignItems: 'center'}}>
                            <Image  source={require('../../images/icon/login_register/register_green.png')}
                                    style={{resizeMode:'contain',width:20,height:20}}/>
                            <Text style={{marginLeft:5,color:global.DARK_GREEN,fontSize:18,textAlign:'center'}}>{stringsoflanguages.singUp}</Text>
                      </View>
                </View>
                <View style={{elevation:10,alignItems: 'center',marginTop: 10}}>
                        <Image  source={require('../../images/backgrounds/register_bg.png')}
                                style={{resizeMode:'stretch',width:Dimensions.get('window').width-30,height: 680}}/>
                        <View style={{flexDirection:'column',width:Dimensions.get('window').width-30,paddingRight: 20,alignItems: 'center',position:'absolute'}}>
                                    <Text style={styles.textBGStyle}>{stringsoflanguages.city}</Text>
                                    <View style={global.COMMON_STYLES.textInputUserMod}>
                                          <Image  source={require('../../images/icon/login_register/city.png')}
                                                  style={{resizeMode:'contain',marginLeft:20,width:20,height:20}}/>

                                       <Dropdown
                                                containerStyle={{width: Dimensions.get('window').width-180, height: 35,marginBottom:55,marginHorizontal: 15}}
                                                inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                                pickerStyle={{width: Dimensions.get('window').width-130,marginLeft: 10,marginTop:30}}
                                                data={drop_down_data}
                                                value={this.props.data.validation.cityText}
                                                onChangeText={(value,index,data) => {this.props.checkCity(value);cityID=data[index].id}}/>

                                    </View>
                                    <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.name}</Text>
                                    <View style={global.COMMON_STYLES.textInputUserMod}>
                                          <Image  source={require('../../images/icon/login_register/user_name.png')}
                                                  style={{resizeMode:'contain',marginLeft:20,width:20,height:20}}/>
                                          <TextInput  style={{flex:1,height: 40,marginLeft:8,color:'#6B6B6B',color:(this.props.data.validation.isNameBlank)?'red':global.DARK_GREEN}}
                                                      placeholder={stringsoflanguages.enterName}
                                                      ref={(input) => this.city = input}
                                                      autoCapitalize = 'none'
                                                      onChangeText={(value) => this.props.checkName(value)}
                                                      returnKeyLabel={"next"}
                                                      value={this.props.data.validation.nameText}
                                                      onSubmitEditing={() => { this.name.focus(); }}/>
                                    </View>
                                    <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.emailID}</Text>
                                    <View style={global.COMMON_STYLES.textInputUserMod}>
                                          <Image  source={require('../../images/icon/login_register/enmail.png')}
                                                  style={{resizeMode:'contain',marginLeft:20,width:20,height:20}}/>
                                          <TextInput  style={{flex:1,height: 40,marginLeft:8,color:'#6B6B6B',color:(this.props.data.validation.isEmailValid)?global.DARK_GREEN:'red'}}
                                                      autoCapitalize = 'none'
                                                      placeholder={stringsoflanguages.enterEmailID}
                                                      onChangeText={(value) => this.props.checkEmail(value)}
                                                      returnKeyLabel={"next"}
                                                      ref={(input) => this.name = input}
                                                      value={this.props.data.validation.emailText}
                                                      onSubmitEditing={() => { this.email.focus(); }}/>
                                    </View>
                                    <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.phoneNo}</Text>
                                    <View style={global.COMMON_STYLES.textInputUserMod}>
                                          <Image  source={require('../../images/icon/login_register/phone.png')}
                                                  style={{resizeMode:'contain',marginLeft:20,width:20,height:20}}/>
                                          <TextInput  style={{flex:1,height: 40,marginLeft:8,color:'#6B6B6B',color:(this.props.data.validation.isNumberValid)?'red':global.DARK_GREEN}}
                                                      placeholder={stringsoflanguages.enterPhoneNo}
                                                      maxLength={10}
                                                      keyboardType='numeric'
                                                      autoCapitalize = 'none'
                                                      keyboardType="numeric"
                                                      ref={(input) => this.email = input}
                                                      onChangeText={(value) => this.props.checkNumber(value)}
                                                      value={this.props.data.validation.numberText}
                                                      returnKeyLabel={"next"}
                                                      onSubmitEditing={() => { this.phonenumber.focus(); }}/>
                                    </View>
                                    <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.registerPassword}</Text>
                                    <View style={global.COMMON_STYLES.textInputUserMod}>
                                          <Image  source={require('../../images/icon/login_register/password.png')}
                                                  style={{resizeMode:'contain',marginLeft:20,width:20,height:20}}/>
                                          <TextInput  style={{flex:1,height: 40,marginLeft:8,color:'#6B6B6B',color:(this.props.data.validation.isPasswordValid)?global.DARK_GREEN:'red'}}
                                                      secureTextEntry={true}
                                                      placeholder="Enter Password"
                                                      autoCapitalize = 'none'
                                                      ref={(input) => this.phonenumber = input}
                                                      onChangeText={(value) => this.props.checkPassword(value) }
                                                      value={this.props.data.validation.passwordText}
                                                      returnKeyLabel={"next"}
                                                      />
                                    </View>
                                    <CheckBox containerStyle={{marginLeft: 50,marginTop: 10,backgroundColor: "transparent", borderWidth: 0,alignSelf: 'flex-start'}}
                                              title={stringsoflanguages.privacyPolicy}
                                              textStyle={{color:global.LIGHT_GRAY}}
                                              checkedColor={global.LIGHT_GRAY}
                                              onPress={() => this.setState({checked: !this.state.checked})}
                                              checked={this.state.checked}/>
                                    {
                                    (this.props.data.apiData.isFetchning)?
                                       <ActivityIndicator style={{marginTop:Platform.OS === 'ios' ? 15:5,marginLeft: 20,width:60,height:60,alignSelf:'center'}} size="large" color="#035B00"/>
                                       :<TouchableOpacity onPress={this.onSubmitRegisterData}>
                                                     <Image  source={require('../../images/icon/btn.png')}
                                                             style={{resizeMode:'contain',marginTop:Platform.OS === 'ios' ? 15:5,marginLeft: 20,width:60,height:60,alignSelf:'center'}}/>
                                       </TouchableOpacity>
                                  }

                        </View>
                </View>
                <View style={{height: 60}}/>
        </ScrollView>
      );
    }

    onSubmitRegisterData=()=>{
        if(this.props.data.validation.nameText!=='' &&
           this.props.data.validation.cityText!=='' &&
           this.props.data.validation.emailText!=='' &&
           this.props.data.validation.numberText!=='' &&
           this.props.data.validation.passwordText!=='' &&
           this.props.data.validation.isEmailValid &&
          this.props.data.validation.isPasswordValid &&
          !this.props.data.validation.isCityBlank &&
          !this.props.data.validation.isNameBlank &&
          !this.props.data.validation.isNumberBlank){
          //
            if(this.state.checked===true){
                let requestData = {
                  "name":this.props.data.validation.nameText,
                  "emailID":this.props.data.validation.emailText,
                  "phonenumber":this.props.data.validation.numberText,
                  "city":cityID,
                  "password":this.props.data.validation.passwordText,
                  "deviceId":"",
                  "token":fcmTokenStr,
                  "languageCode":languageCode
                };
                //
                this.props.postRequest(REGISTER,requestData);
                //
          }else{
            alert(stringsoflanguages.acceptPrivacyPolicy)
          }
        }else{
          if(this.props.data.validation.cityText==''){
              alert(stringsoflanguages.cityCantBlank)
          }else if(this.props.data.validation.nameText==''){
              alert(stringsoflanguages.nameCantBlank)
          }else if(this.props.data.validation.emailText==''){
              alert(stringsoflanguages.emailCanNotBlank)
          }else if(!this.props.data.validation.isEmailValid){
              alert(stringsoflanguages.enterValidEmail)
          }else if(this.props.data.validation.numberText==''){
              alert(stringsoflanguages.numberCantBlank)
          }else if(this.props.data.validation.isNumberValid){
              alert(stringsoflanguages.enterValidPhoneNo)
          }else if(this.props.data.validation.passwordText==''){
              alert(stringsoflanguages.passwordCanNotBlank)
          }else if(!this.props.data.validation.isPasswordValid){
              alert(stringsoflanguages.passwordMust6Long)
          }
          if(this.props.data.validation.isEmailBlank){
            console.log('Error :: '+this.props.data.validation.isEmailBlank)
          }else if(this.props.data.validation.isPasswordBlank){
            console.log('Error :: '+this.props.data.validation.isPasswordBlank)
          }
        }
    }
    mobilevalidate(text) {
    const reg = /^[0]?[789]\d{9}$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  }
}
//
const styles = StyleSheet.create({
    textBGStyle:{
      marginLeft:60,
      marginTop:40,
      color:'#6B6B6B',
      fontSize:16,
      alignSelf: 'flex-start'
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
   checkPassword,
   checkCity,
   checkName,
   checkNumber,
   checkReset,
   setToken,
   setLanguageCode
  })
  (RegisterComponent);
