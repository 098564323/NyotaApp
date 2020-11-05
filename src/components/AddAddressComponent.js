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
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Picker
} from 'react-native';
import { NavigationEvents } from 'react-navigation';

import { CheckBox } from 'react-native-elements'
import Footer from '../utils/Footer';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {checkPassword} from '../redux/actions/CheckValidationAction';
import {setToken} from '../redux/actions/SetTokenActions';
import {connect} from 'react-redux';
import DefaultPreference from 'react-native-default-preference';
import { Dropdown } from 'react-native-material-dropdown';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
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
var isStateValid= false
var isApartmentValid= false
var isCityValid= false
var isStreetValid= false
var isPhoneNoValid= false
var isPincodeValid=false
//
var stateStr= ''
var addressIdStr=''
var apartmentStr= ''
var cityStr= ''
var streetStr= ''
var phoneNoStr= ''
var pincodeStr=''
let drop_down_data = [];
var nID='';
var i=0;
var neighbourhood_txt = ''
var screenPosition=0;
//
const googleMapKey = 'AIzaSyAXK80uLS7feCZxxGgRlt7cpBxr5don89Q'
//
class AddAddressComponent extends Component{

    constructor(props){
      super(props);
      //
      screenPostion = this.props.navigation.state.params.isFromCurrentLocation
      stringsoflanguages.setLanguage((this.props.addAddressData.getLanguageCode.languageCode=='en')?'en':'fr');
      client.defaults.headers.common['Authorization'] = (this.props.addAddressData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.addAddressData.getCurrentToken.currentToken;
      //
      this.state={
            isApartmentValid  : (screenPostion==0||screenPostion==1)?false:true,
            isCityValid       : (screenPostion==1)?false:true,
            isStreetValid     : (screenPostion==0||screenPostion==1)?false:true,
            isStateValid      : (screenPostion==1)?false:true,
            isPhoneNoValid    : (screenPostion==0||screenPostion==1)?false:true,
            isPincodeValid    : (screenPostion==1)?false:true,
            address           : '',
            isLoading         : true,
            addressId         : (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.id,
            apartment         : (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.apartment_name,
            street            : (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.street,
            city              : (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.city,
            cstate            : (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.state,
            phoneNo           : (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.phone,
            pincode           : (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.pincode,
            isCallAddAPI:false
      }
        addressID = (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.id
        addressIdStr = (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.id
        apartmentStr = (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.apartment_name
        cityStr = (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.city
        streetStr = (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.street
        stateStr = (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.state
        phoneNoStr = (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.phone
        pincodeStr = (screenPostion==0||screenPostion==1)?'':this.props.navigation.state.params.addressData.pincode
        neighbourhood_txt = ((screenPostion==0||screenPostion==1))?stringsoflanguages.selectNeighbourhood:this.props.navigation.state.params.addressData.neighbourhood
        //
        nID=''
        //
        // alert(this.props.navigation.state.params.isFromCurrentLocation)
    }

    componentDidMount(){

      console.log('Latitude :: '+this.props.navigation.state.params.userLatitude);
      console.log('Longitude :: '+this.props.navigation.state.params.userLongitude);
          (screenPostion==0)?this.getFullAddress(this.props.navigation.state.params.userLongitude,this.props.navigation.state.params.userLatitude):null
          //
          this.callNeighbourhoodApi()
          }

      getFullAddress=(longitude,latitude)=>{
        //
        // alert('called')
        client.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&key='+googleMapKey)
             .then((response)=>{
               //
               //alert('Address Response '+JSON.stringify(response))
              tempFilterData = response.data.results[0].address_components
                                              .filter(item =>
                                                item.types[0] === 'locality'
                                             || item.types[0] === 'administrative_area_level_1'
                                             || item.types[0] === 'administrative_area_level_2'
                                             || item.types[0] === 'postal_code');
              //

              for(let i = 0; i < tempFilterData.length; i++){
                    if(tempFilterData[i].types[0]=='postal_code'){
                        pincodeStr = tempFilterData[i].long_name
                        this.setState({pincode:tempFilterData[i].long_name})
                    }else if(tempFilterData[i].types[0]=='administrative_area_level_1'){
                        stateStr = tempFilterData[i].long_name
                        this.setState({cstate:tempFilterData[i].long_name})
                    }else if(tempFilterData[i].types[0]=='administrative_area_level_2'){
                        cityStr = tempFilterData[i].long_name
                        this.setState({city:tempFilterData[i].long_name})
                    }else if(tempFilterData[i].types[0]=='locality'){
                        cityStr = tempFilterData[i].long_name
                        this.setState({city:tempFilterData[i].long_name})
                    }
              }

             },(error)=>{
               console.log('Full Address Error--->'+JSON.stringify(error));
             });
      }

     checkApartment = (inputText) => {

        this.setState({apartment:inputText})
        apartmentStr = inputText
        if(inputText === ''){
          this.setState({
            isApartmentValid:false,
            apartment:inputText
          })
          isApartmentValid = false
        }else{
          this.setState({
            isApartmentValid:true,
            isApartmentValid:inputText
          })
          isApartmentValid = true
        }
    }

     checkCity = (inputText) => {
       this.setState({city:inputText})
       cityStr = inputText
       if(inputText === ''){
         this.setState({
           isCityValid:false,
           city:inputText
         })
         isCityValid = false
       }else{
         this.setState({
           isCityValid:true,
           city:inputText
         })
         isCityValid = true
       }
    }

     checkState = (inputText) => {
       //
       stateStr = inputText
       if(inputText === ''){
         this.setState({
           isStateValid:false,
           cstate:inputText
         })
         isStateValid = false
       }else{
         this.setState({
           isStateValid:true,
           cstate:inputText
         })
         isStateValid = true
       }
    }

     checkPhoneNo = (inputText) => {
       //
       this.setState({phoneNo:inputText})
       phoneNoStr = inputText
       //
       if(inputText === ''){
         this.setState({
           isPhoneNoValid:false,
           phoneNo:inputText
         })
         isPhoneNoValid = false
       }else{
         this.setState({
           isPhoneNoValid:true,
           phoneNo:inputText
         })
         isPhoneNoValid = true
       }
    }

     checkStreet = (inputText) => {
       this.setState({street:inputText})
       streetStr = inputText
       if(inputText === ''){
         this.setState({
           isStreetValid:false,
           street:inputText
         })
         isStreetValid = false
       }else{
         this.setState({
           isStreetValid:true,
           street:inputText
         })
         isStreetValid = true
       }
    }

    checkPincode = (inputText) => {
      this.setState({pincode:inputText})
      pincodeStr = inputText
      if(inputText === ''){
        this.setState({
          isPincodeValid:false,
          pincode:inputText
        })
        isStreetValid = false
      }else{
        this.setState({
          isPincodeValid:true,
          pincode:inputText
        })
        isPincodeValid = true
      }
   }

   onChangeHandler = (value) => {
   console.log(`${value} Items`);

   }

   callNeighbourhoodApi =()=>{
     //
     client.get('neighbourhood')
     .then((response) => {
       //
       var count = Object.keys(response.data.data).length;
       //
       for(i=0;i<count;i++){
            console.log(response.data.data[i].neighbour_hood)
            if(neighbourhood_txt==response.data.data[i].neighbour_hood){
              nID=response.data.data[i].id
            }
            drop_down_data.push({ value: response.data.data[i].neighbour_hood,id:response.data.data[i].id});
          }
          //
          }, (error) => {
            console.log('Neightbourhood Error  '+JSON.stringify(error.response.data));
       });
   }

    submitAddressData=()=>{
        //
        var stateText = ''
        if(this.props.navigation.state.params.userLongitude==undefined &&
           this.props.navigation.state.params.userLatitude==undefined){
          stateText =  stateStr
        }else{
          stateText =  stateStr + ' lat '+this.props.navigation.state.params.userLatitude+' long '+this.props.navigation.state.params.userLongitude
        }
        //
        //var isSubmitData = false;
        //
        // if(isApartmentValid &&
        //   isStreetValid &&
        //   (isCityValid||!this.state.isCityValid) &&
        //   (isStateValid||!this.state.isStateValid) &&
        //   isPhoneNoValid &&
        //   (isPincodeValid||!this.state.isPincodeValid)){
        //     isSubmitData = true
        // }else if(isApartmentValid || isStreetValid){
        //     isSubmitData = true
        // }
        //
        //alert(isSubmitData)
        //
        if(this.props.navigation.state.params.isFromCurrentLocation==0){
                if(nID!==''){
                    this.setState({
                      isCallAddAPI:true
                    })
                      //
                      let requestData={
                        "apartment_name":apartmentStr,
                        "neighbourhood_id":nID,
                        "street":streetStr,
                        "city":cityStr,
                        "state":stateText,
                        "phone":phoneNoStr,
                        "pincode":pincodeStr
                      };
                      //
                      client.post('addaddress',requestData)
                      .then((response) => {
                            //
                            this.setState({
                              isCallAddAPI:false
                            })
                            //
                            Alert.alert(
                                '',
                                stringsoflanguages.successfullyAdded,
                                [
                                  {text: 'OK', onPress: () => {this.props.navigation.goBack()}},
                                ],
                                {cancelable: false},
                              );
                           }, (error) => {
                             console.log('Add Address Error  '+JSON.stringify(error.response.data));
                      });
                    }else{
                      alert(stringsoflanguages.pleaseSelectNeighBourhood)
                    }
        }else{
                if(isApartmentValid && isStreetValid && (isCityValid||!this.state.isCityValid) && (isStateValid||!this.state.isStateValid) && isPhoneNoValid && (isPincodeValid||!this.state.isPincodeValid)){
                  //
                  if(nID!==''){
                      this.setState({
                        isCallAddAPI:true
                      })
                        //
                        let requestData={
                          "apartment_name":apartmentStr,
                          "neighbourhood_id":nID,
                          "street":streetStr,
                          "city":cityStr,
                          "state":stateText,
                          "phone":phoneNoStr,
                          "pincode":pincodeStr
                        };
                        //
                        client.post('addaddress',requestData)
                        .then((response) => {
                              //
                              this.setState({
                                isCallAddAPI:false
                              })
                              //
                              Alert.alert(
                                  '',
                                  stringsoflanguages.successfullyAdded,
                                  [
                                    {text: 'OK', onPress: () => {this.props.navigation.goBack()}},
                                  ],
                                  {cancelable: false},
                                );
                             }, (error) => {
                               console.log('Add Address Error  '+JSON.stringify(error.response.data));
                        });
                      }else{
                        alert(stringsoflanguages.pleaseSelectNeighBourhood)
                      }
                  //
                }else{
                    alert(stringsoflanguages.pleaseEnterAllFields)
                }
        }

    }

    submitEditAddressData(){
      //
      if(nID!==''){
            //
            this.setState({
              isCallAddAPI:true
            })
            //
            let requestData={
              "address_id":addressID,
              "apartment_name":apartmentStr,
              "neighbourhood_id":nID,
              "street":streetStr,
              "city":cityStr,
              "state":stateStr,
              "phone":phoneNoStr,
              "pincode":pincodeStr
            };
            //
            client.post('updateaddress',requestData)
            .then((response) => {
                    //
                    this.setState({
                      isCallAddAPI:false
                    })
                    //
                    Alert.alert(
                        '',
                        stringsoflanguages.successfullyUpdate,
                        [
                          {text: 'OK', onPress: () => {this.props.navigation.goBack()}},
                        ],
                        {cancelable: false},
                      );
                 }, (error) => {
                  console.log('Add Address Error  '+JSON.stringify(error.response.data));
            });
          }else{
                alert(stringsoflanguages.pleaseSelectNeighBourhood)
          }
    }

    render(){
        const {navigate} = this.props.navigation;
        return (
                (Platform.OS=='ios')?
                  <KeyboardAvoidingView style={{flex:1 }} behavior="padding" enabled>
                  <View style={{flexGrow:1}}>
                        <NavigationEvents
                          onWillFocus={payload => console.log('')}
                          onDidFocus={payload => console.log('')}
                          onWillBlur={payload => {drop_down_data=[],nID=''}}
                          onDidBlur={payload => console.log('')}
                         />
                        <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
                        <SafeAreaView style={{flexGrow:1}}>
                            <Header headerTitle={stringsoflanguages.addNewAddress} headerNavigation={this.props.navigation} isSearch={true} isNotification={true} isBack={true} notificationCount={this.props.addAddressData.getNotificationCounter.notificatinCounter}/>
                            <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,justifyContent: 'center',alignItems: 'center'}}>
                                    <ScrollView>
                                                <View style={{flexGrow:1}}>
                                                <View style={{elevation:10,alignItems: 'center',marginTop: 10}}>
                                                    <Image  source={require('../../images/backgrounds/register_bg.png')}
                                                            style={{resizeMode:'stretch',width:Dimensions.get('window').width-30,height: 825}}/>
                                                    <View style={{flexDirection:'column',width:Dimensions.get('window').width-30,paddingRight: 20,alignItems: 'center',position:'absolute'}}>
                                                                <Text style={styles.textBGStyle}>{stringsoflanguages.referencePoint}</Text>
                                                                <View style={styles.textInputUserMod}>
                                                                      <TextInput  style={[styles.textInputBgStyle,{color:(this.state.isApartmentValid)?global.DARK_GREEN:'red'}]}
                                                                                  placeholder={(screenPostion==0||screenPostion==1?stringsoflanguages.enterReferencePoint:this.props.navigation.state.params.addressData.apartment_name)}
                                                                                  autoCapitalize = 'none'
                                                                                  onChangeText={(text) => this.checkApartment(text)}
                                                                                  value={this.state.apartment}
                                                                                  returnKeyLabel={"next"}
                                                                                  onSubmitEditing={() => { this.apartment.focus(); }}/>
                                                                </View>
                                                                <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.street1}</Text>
                                                                <View style={styles.textInputUserMod}>
                                                                      <TextInput  style={[styles.textInputBgStyle,{color:(this.state.isStreetValid)?global.DARK_GREEN:'red'}]}
                                                                                  placeholder={(screenPostion==0||screenPostion==1?stringsoflanguages.enterStreet:this.props.navigation.state.params.addressData.apartment_name)}
                                                                                  ref={(input) => this.apartment = input}
                                                                                  autoCapitalize = 'none'
                                                                                  onChangeText={(text) => this.checkStreet(text)}
                                                                                  value={this.state.street}
                                                                                  returnKeyLabel={"next"}
                                                                                  onSubmitEditing={() => { this.street.focus(); }}/>
                                                                </View>
                                                                <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.neighbourhood}</Text>
                                                                        <Dropdown
                                                                                containerStyle={{width: Dimensions.get('window').width-120, height: 50,marginLeft:30}}
                                                                                pickerStyle={{width: Dimensions.get('window').width-130,marginLeft: 20}}
                                                                                data={drop_down_data}
                                                                                value={neighbourhood_txt}
                                                                                onChangeText={(value,index,data) => {nID=data[index].id}}/>
                                                                <Text style={[styles.textBGStyle,{marginTop:30}]}>{stringsoflanguages.city}</Text>
                                                                <View style={styles.textInputUserMod}>
                                                                      <TextInput  style={[styles.textInputBgStyle,{color:(this.state.isCityValid)?global.DARK_GREEN:'red'}]}
                                                                                  placeholder={(screenPostion==0||screenPostion==1?stringsoflanguages.enterCity:this.props.navigation.state.params.addressData.city)}
                                                                                  onChangeText={(text) => this.checkCity(text)}
                                                                                  value={this.state.city}
                                                                                  autoCapitalize = 'none'
                                                                                  maxLength={10}
                                                                                  ref={(input) => this.street = input}
                                                                                  returnKeyLabel={"next"}
                                                                                  onSubmitEditing={() => { this.city.focus(); }}/>
                                                                </View>
                                                                <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.state}</Text>
                                                                <View style={styles.textInputUserMod}>
                                                                      <TextInput  style={[styles.textInputBgStyle,{color:(this.state.isStateValid)?global.DARK_GREEN:'red'}]}
                                                                                  placeholder={(screenPostion==0||screenPostion==1?stringsoflanguages.enterState:this.props.navigation.state.params.addressData.state)}
                                                                                  onChangeText={(text) => this.checkState(text)}
                                                                                  value={this.state.cstate}
                                                                                  autoCapitalize = 'none'
                                                                                  ref={(input) => this.city = input}
                                                                                  onSubmitEditing={() => { this.state.focus(); }}
                                                                                  returnKeyLabel={"next"}  />
                                                                </View>
                                                                <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.phoneNo}</Text>
                                                                <View style={styles.textInputUserMod}>
                                                                      <TextInput  style={[styles.textInputBgStyle,{color:(this.state.isPhoneNoValid)?global.DARK_GREEN:'red'}]}
                                                                                  placeholder={(screenPostion==0||screenPostion==1?stringsoflanguages.enterPhoneNo:this.props.navigation.state.params.addressData.phone)}
                                                                                  onChangeText={(text) => this.checkPhoneNo(text)}
                                                                                  value={this.state.phoneNo}
                                                                                  autoCapitalize = 'none'
                                                                                  keyboardType="numeric"
                                                                                  maxLength={10}
                                                                                  ref={(input) => this.state = input}
                                                                                  returnKeyLabel={"next"}  />
                                                                </View>
                                                                <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.pincode}</Text>
                                                                <View style={styles.textInputUserMod}>
                                                                      <TextInput  style={[styles.textInputBgStyle,{color:(this.state.isPincodeValid)?global.DARK_GREEN:'red'}]}
                                                                                  placeholder={(screenPostion==0||screenPostion==1?stringsoflanguages.enterPinCode:this.props.navigation.state.params.addressData.pincode)}
                                                                                  onChangeText={(text) => this.checkPincode(text)}
                                                                                  value={this.state.pincode}
                                                                                  autoCapitalize = 'none'
                                                                                  keyboardType="numeric"
                                                                                  maxLength={10}
                                                                                  ref={(input) => this.state = input}
                                                                                  returnKeyLabel={"next"}  />
                                                                </View>
                                                                    {
                                                                      (this.state.isCallAddAPI)?
                                                                                <ActivityIndicator style={{width:60,height:60,marginLeft: 20,marginTop: 20,alignSelf: 'center'}} size="large" color="#035B00"/>:
                                                                                <TouchableOpacity onPress={(screenPostion==0||screenPostion==1)?
                                                                                  this.submitAddressData.bind(this):this.submitEditAddressData.bind(this)}>
                                                                                            <Image  source={require('../../images/icon/btn.png')}
                                                                                                    style={{resizeMode:'contain',marginTop:Platform.OS === 'ios' ? 20:5,marginLeft: 20,width:60,height:60,alignSelf:'center'}}/>
                                                                                </TouchableOpacity>
                                                                    }
                                                                  </View>
                                                                </View>
                                                        </View>
                                      </ScrollView>
                            </View>
                        </SafeAreaView>
                  </View>
                </KeyboardAvoidingView>
                :
                <View style={{flexGrow:1}}>
                      <NavigationEvents
                        onWillFocus={payload => console.log('')}
                        onDidFocus={payload => console.log('')}
                        onWillBlur={payload => {drop_down_data=[]}}
                        onDidBlur={payload => console.log('')}
                       />
                      <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
                      <SafeAreaView style={{flexGrow:1}}>
                          <Header headerTitle={stringsoflanguages.addNewAddress} headerNavigation={this.props.navigation} isSearch={true} isNotification={true} isBack={true} notificationCount={this.props.addAddressData.getNotificationCounter.notificatinCounter}/>
                          <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,justifyContent: 'center',alignItems: 'center'}}>
                                  <ScrollView>
                                              <View style={{flexGrow:1}}>
                                              <View style={{elevation:10,alignItems: 'center',marginTop: 10}}>
                                                  <Image  source={require('../../images/backgrounds/register_bg.png')}
                                                          style={{resizeMode:'stretch',width:Dimensions.get('window').width-30,height: 825}}/>
                                                  <View style={{flexDirection:'column',width:Dimensions.get('window').width-30,paddingRight: 20,alignItems: 'center',position:'absolute'}}>
                                                              <Text style={styles.textBGStyle}>{stringsoflanguages.referencePoint}</Text>
                                                              <View style={styles.textInputUserMod}>
                                                                    <TextInput  style={[styles.textInputBgStyle,{color:(this.state.isApartmentValid)?global.DARK_GREEN:'red'}]}
                                                                                placeholder={(screenPostion==0||screenPostion==1?stringsoflanguages.enterReferencePoint:this.props.navigation.state.params.addressData.apartment_name)}
                                                                                autoCapitalize = 'none'
                                                                                onChangeText={(text) => this.checkApartment(text)}
                                                                                value={this.state.apartment}
                                                                                returnKeyLabel={"next"}
                                                                                onSubmitEditing={() => { this.apartment.focus(); }}/>
                                                              </View>
                                                              <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.street1}</Text>
                                                              <View style={styles.textInputUserMod}>
                                                                    <TextInput  style={[styles.textInputBgStyle,{color:(this.state.isStreetValid)?global.DARK_GREEN:'red'}]}
                                                                                placeholder={(screenPostion==0||screenPostion==1?stringsoflanguages.enterStreet:this.props.navigation.state.params.addressData.apartment_name)}
                                                                                ref={(input) => this.apartment = input}
                                                                                autoCapitalize = 'none'
                                                                                onChangeText={(text) => this.checkStreet(text)}
                                                                                value={this.state.street}
                                                                                returnKeyLabel={"next"}
                                                                                onSubmitEditing={() => { this.street.focus(); }}/>
                                                              </View>
                                                              <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.neighbourhood}</Text>
                                                              <Dropdown
                                                                      containerStyle={{width: Dimensions.get('window').width-120, height: 50,marginLeft:30}}
                                                                      pickerStyle={{width: Dimensions.get('window').width-130,marginLeft: 20}}
                                                                      data={drop_down_data}
                                                                      value={neighbourhood_txt}
                                                                      onChangeText={(value,index,data) => {nID=data[index].id}}/>
                                                              <Text style={[styles.textBGStyle,{marginTop:30}]}>{stringsoflanguages.city}</Text>
                                                              <View style={styles.textInputUserMod}>
                                                                    <TextInput  style={[styles.textInputBgStyle,{color:(this.state.isCityValid)?global.DARK_GREEN:'red'}]}
                                                                                placeholder={(screenPostion==0||screenPostion==1)?stringsoflanguages.enterCity:this.props.navigation.state.params.addressData.city}
                                                                                onChangeText={(text) => this.checkCity(text)}
                                                                                value={this.state.city}
                                                                                autoCapitalize = 'none'
                                                                                maxLength={10}
                                                                                ref={(input) => this.street = input}
                                                                                returnKeyLabel={"next"}
                                                                                onSubmitEditing={() => { this.city.focus(); }}/>
                                                              </View>
                                                              <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.state}</Text>
                                                              <View style={styles.textInputUserMod}>
                                                                    <TextInput  style={[styles.textInputBgStyle,{color:(this.state.isStateValid)?global.DARK_GREEN:'red'}]}
                                                                                placeholder={(screenPostion==0||screenPostion==1?stringsoflanguages.enterState:this.props.navigation.state.params.addressData.state)}
                                                                                onChangeText={(text) => this.checkState(text)}
                                                                                value={this.state.cstate}
                                                                                autoCapitalize = 'none'
                                                                                ref={(input) => this.city = input}
                                                                                onSubmitEditing={() => { this.state.focus(); }}
                                                                                returnKeyLabel={"next"}  />
                                                              </View>
                                                              <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.phoneNo}</Text>
                                                              <View style={styles.textInputUserMod}>
                                                                    <TextInput  style={[styles.textInputBgStyle,{color:(this.state.isPhoneNoValid)?global.DARK_GREEN:'red'}]}
                                                                                placeholder={(screenPostion==0||screenPostion==1?stringsoflanguages.enterPhoneNo:this.props.navigation.state.params.addressData.phone)}
                                                                                onChangeText={(text) => this.checkPhoneNo(text)}
                                                                                value={this.state.phoneNo}
                                                                                autoCapitalize = 'none'
                                                                                keyboardType="numeric"
                                                                                maxLength={10}
                                                                                ref={(input) => this.state = input}
                                                                                returnKeyLabel={"next"}  />
                                                              </View>
                                                              <Text style={[styles.textBGStyle,{marginTop:20}]}>{stringsoflanguages.pincode}</Text>
                                                              <View style={styles.textInputUserMod}>
                                                                    <TextInput  style={[styles.textInputBgStyle,{color:(this.state.isPincodeValid)?global.DARK_GREEN:'red'}]}
                                                                                placeholder={(screenPostion==0||screenPostion==1?stringsoflanguages.enterPinCode:this.props.navigation.state.params.addressData.pincode)}
                                                                                onChangeText={(text) => this.checkPincode(text)}
                                                                                value={this.state.pincode}
                                                                                autoCapitalize = 'none'
                                                                                keyboardType="numeric"
                                                                                maxLength={10}
                                                                                ref={(input) => this.state = input}
                                                                                returnKeyLabel={"next"}  />
                                                              </View>
                                                                  {
                                                                    (this.state.isCallAddAPI)?
                                                                                <ActivityIndicator style={{width:60,height:60,marginLeft: 20,marginTop: 20,alignSelf: 'center'}} size="large" color="#035B00"/>:
                                                                                <TouchableOpacity onPress={(screenPostion==0||screenPostion==1)?
                                                                                  this.submitAddressData.bind(this):this.submitEditAddressData.bind(this)}>
                                                                                              <Image  source={require('../../images/icon/btn.png')}
                                                                                                    style={{resizeMode:'contain',marginTop:Platform.OS === 'ios' ? 20:10,marginLeft: 20,width:60,height:60,alignSelf:'center'}}/>
                                                                                </TouchableOpacity>
                                                                  }
                                                                </View>

                                                              </View>
                                                      </View>
                                    </ScrollView>
                          </View>
                      </SafeAreaView>
                </View>
        );
    }
}
const styles = StyleSheet.create({
    textBGStyle:{
      marginLeft:50,
      marginTop:40,
      color:'#6B6B6B',
      fontSize:14,
      alignSelf: 'flex-start'
    },
    textInputUserMod:{
      width:Dimensions.get('window').width-100,
      marginLeft:20,
      marginTop:10,
      height:50,
      flexDirection:'row',
      alignItems:'center',
      borderRadius:50,
      backgroundColor:'#FCF8F0',
      borderWidth: 1,
      borderColor: '#F8F3EB'
   },

    dropdownStyle:{
      top:30,
      marginLeft:10
    },

    textInputBgStyle:{
      flex:1,height: 40,marginLeft:8,color:'#6B6B6B',paddingLeft: 10
    }
});

mapStateToProps=state=>{
  return{
     addAddressData:state
  }
}
export default connect(mapStateToProps,{setToken,setNotificationCounter,setLanguageCode})(AddAddressComponent);
