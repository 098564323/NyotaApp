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
  Plateform,
  PermissionsAndroid,
  TouchableOpacity
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { CheckBox } from 'react-native-elements'
import Footer from '../utils/Footer';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import {setToken} from '../redux/actions/SetTokenActions';
import * as Utils from '../utils/Utils';
import {connect} from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import DefaultPreference from 'react-native-default-preference';
import Geolocation from '@react-native-community/geolocation';
//
import NumberFormat from 'react-number-format';
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
var filteredData;
var isDeleteData=false
var isFromCurrentLocation=false;
//
class AddressComponent extends Component{

    constructor(props){
      super(props);
      //
      client.defaults.headers.common['Authorization'] = (this.props.addressData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.addressData.getCurrentToken.currentToken;
      //
      this.state={
        responseData:{},
        addressData:[],
        clickPos: -1,
        addressCount:0,
        isPaymentProcess:false,
        currentLongitude:0,
        currentLatitude:0,
        selectedAddressData:{}
      }
      //
      stringsoflanguages.setLanguage((this.props.addressData.getLanguageCode.languageCode=='en')?'en':'fr');
      //
     this.permissonFunction()
     // alert(this.props.navigation.state.params.deliveryType)
    }
    deleteAddress = addressID => {
      //
      isDeleteData = true;
      if(filteredData == undefined){
        filteredData = this.state.responseData.data.filter(item => item.id !== addressID);
      }else{
        filteredData = filteredData.filter(item => item.id !== addressID);
      }
      //
      this.setState({addressData: filteredData})

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
                                console.warn(err)
                             }
                      }
                    requestLocationPermission();
                  }else{
                    this.callLocation(that);
                 }
          }
        callLocation(that){
            //
            try {
                Geolocation.getCurrentPosition(info =>{
                    that.setState({
                    currentLongitude:info.coords.longitude,
                    currentLatitude:info.coords.latitude
                    })
                  },(error) => {
                    //alert('error happens '+(error.code))
                  }
                );
            }catch (err) {
        }
    }

    callAPIfun=()=>{
      //
      isDeleteData = false;
      //
      client.get('getuseraddress')
      .then((response) => {
            //
            this.setState({
              responseData:response.data,
              addressCount:response.data.count_address
            })
            //
           }, (error) => {
             //
             this.setState({
               responseData:error.response.data
             })
      });
    }

    render(){
        const {navigate} = this.props.navigation;
        return (
          <View style={{flexGrow:1}}>
                <NavigationEvents
                  onWillFocus={payload => {filteredData=null}}
                  onDidFocus={this.callAPIfun}
                  onWillBlur={payload => console.log('test')}
                  onDidBlur={payload => console.log('')}
                 />
                <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
                <SafeAreaView style={{flexGrow:1}}>
                    <Header headerTitle={stringsoflanguages.address} headerNavigation={this.props.navigation} isSearch={(this.props.navigation.state.params.isFromCart)?false:true} isNotification={(this.props.navigation.state.params.isFromCart)?false:true} isBack={true} notificationCount={this.props.addressData.getNotificationCounter.notificatinCounter}/>
                    <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,justifyContent: 'center',alignItems: 'center'}}>
                          <View style={{flexGrow: 1,width: Dimensions.get('window').width,height: undefined,flexBasis: 0}}>
                              <View style={{flexGrow:1,flex:1}}>
                                    <Image  source={require('../../images/profile/addresslogo.png')}
                                            style={{resizeMode:'contain',width:Dimensions.get('window').width-30,margin:40,height: 140,alignSelf:'center'}}/>
                               </View>

                              <View style={{flex:0.4,marginTop:5}}>
                                  <TouchableOpacity onPress={this.fromCurrentLocation.bind()}>
                                            <Image  source={(this.props.addressData.getLanguageCode.languageCode=='en')?require('../../images/profile/current_location.png'):require('../../images/profile/current_location_fr.png')}
                                                    style={{resizeMode:'contain',width:Dimensions.get('window').width-80,height:50,alignSelf:'center'}}/>
                                  </TouchableOpacity>
                              </View>
                          </View>
                          <View style={{flexGrow: 1,width: Dimensions.get('window').width,height: undefined,flexBasis: 0}}>
                                <View style={{backgroundColor: 'white',flexDirection: 'column',elevation: 5,margin: 10,paddingBottom: 10,height: (this.state.responseData.status=='200'?
                                  ((this.state.addressData.length>1 || this.state.responseData.data.length>1)?(Dimensions.get('window').height/2)-100:undefined):undefined)}}>
                                  {(this.state.responseData.status=='200')?
                                        <FlatList
                                              data={ (isDeleteData)?this.state.addressData:this.state.responseData.data }
                                              extraData={this.state.clickPos}
                                              keyExtractor={(item, index) => index.toString()}
                                              renderItem={ ({item,index}) =>
                                                  <this.addressRow itemData={item} deleteAddress={()=>this.deleteAddress(item.id)} indexPos={index}/>
                                         }/>:null
                                   }

                                   {(this.props.navigation.state.params.isFromCart==true && this.state.addressCount!=0)?

                                     <TouchableOpacity onPress={this.onPaymentAPI.bind(this)}>
                                     <NumberFormat decimalScale={2} value={this.props.navigation.state.params.totalAmt} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                        <Text style={{color:'green',marginLeft: 10,fontSize: 16,padding: 10,alignSelf: 'center'}}>{`${stringsoflanguages.makePaymentOf} ${value} XAF`}</Text>} />
                                     </TouchableOpacity>
                                     :
                                       <TouchableOpacity onPress={()=>{navigate('AddAddress',{isFromCurrentLocation:1})}}>
                                           <View style={{flexDirection:'row',alignItems: 'center',padding: 10,marginLeft: 10}}>

                                                <Image  source={require('../../images/category/add_address_plus.png')}
                                                        style={{resizeMode:'contain',width:15,height:15}}/>
                                                <Text style={{color:'green',marginLeft: 10,fontSize: 16}}>{stringsoflanguages.addNewAddress}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                          </View>
                          <Text style={{alignSelf:'center',color:'grey',position: 'absolute',padding:8}}>{stringsoflanguages.orText}</Text>
                          {
                            (this.state.isPaymentProcess)
                            ?<ActivityIndicator style={{alignSelf:'center',position: 'absolute'}}/>
                            :null
                          }
                    </View>
                </SafeAreaView>
          </View>
        );
    }
    addressRow=({itemData,deleteAddress,indexPos})=>{
      //
      return(
              <View style={{flexDirection:'column'}}>
              <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-between'}}>
                  <CheckBox
                      onPress={() => this.setState({clickPos: indexPos,selectedAddressData:itemData})}
                      checkedIcon={<Image source={require('../../images/category/radio_selected.png')} />}
                      uncheckedIcon={<Image source={require('../../images/category/radio_unselected.png')} />}
                      containerStyle={{borderWidth: 0,backgroundColor: "transparent",flex:1}}
                      title={(itemData.apartment_name!=='')?itemData.apartment_name:'  '}
                      checked={(this.state.clickPos==indexPos)?true:false}/>

                         <View style={{backgroundColor: 'transparent',flexDirection:'row',paddingRight:15}}>
                                <TouchableOpacity onPress={this.onDeleteClick.bind(this,itemData,deleteAddress)}>
                                  <Text style={{paddingLeft:  5,paddingRight: 5,marginRight: 10,borderWidth: 1,borderRadius: 3,borderColor: global.DARK_GREEN,color:global.LIGHT_GREEN,fontSize: 15,textAlign:'center'}}>{stringsoflanguages.delete}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.onEditClick.bind(this,itemData)}>
                                  <Text style={{paddingLeft:  5,paddingRight: 5,borderRadius: 3,borderWidth: 1,borderColor: global.DARK_GREEN,color:global.LIGHT_GREEN,fontSize: 15,textAlign:'center'}}>{stringsoflanguages.edit}</Text>
                                </TouchableOpacity>
                         </View>

              </View>
              <Text style={{marginLeft:55,marginHorizontal:15}}>{`${itemData.neighbourhood},${itemData.street},${itemData.city},${itemData.state.split(" ")[0]}\n${itemData.pincode}`}</Text>
              <Text style={{marginHorizontal:15,marginLeft:55,marginTop: 8}}>{itemData.phone}</Text>
              <View style={{marginHorizontal:25,height:1,backgroundColor: 'grey',marginTop: 5,marginHorizontal: 25}}/>
              </View>
      );
    }
    //Payment API Called
    onPaymentAPI=()=>{
        if(this.state.clickPos!=-1){
          const {navigate} = this.props.navigation;
          //
          this.setState({
            isPaymentProcess:true
          })
          //
          // alert(this.state.selectedAddressData.id)

          navigate('paymentMode',{
            'totalAmt':this.props.navigation.state.params.totalAmt.toFixed(2),
            'addressId':this.state.selectedAddressData.id,
            'deliveryType':this.props.navigation.state.params.deliveryType
          })
          //
        }else{
          alert(stringsoflanguages.selectAddressFirst)
        }
    }
    onDeleteClick=(addressData,deleteAddress)=>{
        //
        deleteAddress(addressData.id)
        //
        let requestData={
          "address_id":addressData.id
        };
        client.post('deleteaddress',requestData)
        .then((response) => {
         }, (error) => {
               console.log('Delete Address  '+JSON.stringify(error.response.data));
        });
    }
    onEditClick=(addressData)=>{
        //

        const {navigate} = this.props.navigation;
        navigate('AddAddress',{
          addressData:addressData,
          isFromCurrentLocation:2,
        })
    }

   fromCurrentLocation=()=>{
     //
     const {navigate} = this.props.navigation;
     //
     navigate('AddAddress',{
            isFromCurrentLocation:0,
            userLongitude:this.state.currentLongitude,
            userLatitude:this.state.currentLatitude,
     })
   }
}

mapStateToProps=state=>{
  return{
     addressData:state
  }
}

export default connect( mapStateToProps,{setToken,setNotificationCounter,setLanguageCode}) (AddressComponent);
