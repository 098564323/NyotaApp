import React,{Component} from 'react';
import {
  View,TouchableOpacity,
  SafeAreaView,
  Text,ScrollView,
  ActivityIndicator,
  Dimensions,
  Image
} from 'react-native';
//
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
//
import { NavigationEvents } from 'react-navigation';
//
import { WebView } from 'react-native-webview';
import { CheckBox } from 'react-native-elements'
import {connect} from 'react-redux';
import {reset,getRequest} from '../redux/actions/ApiCallerAction';
import {setToken} from '../redux/actions/SetTokenActions';
import {setCartCounter} from '../redux/actions/cartCounterAction';

import {ABOUT_US,PRIVACY_POLICY,CURRENT_STATE} from '../utils/ApiMethods';
import DefaultPreference from 'react-native-default-preference';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
import FastImage from 'react-native-fast-image';
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
import {BASE_URL} from '../utils/ApiMethods';
//
var orderId=''
var userId=''
var cartId=''
var addressId=''
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
//
class PaymentModeComponent extends Component{
  constructor(props){
    super(props);

    this.state={
      isSuccess:0,
      paymentURL:'',
      totalAmt:(this.props.navigation.state.params!=undefined)?this.props.navigation.state.params.totalAmt:0,
      addressId:(this.props.navigation.state.params!=undefined)?this.props.navigation.state.params.addressId:0,
      airtelMoney:false,
      mtnMoney:false,
      cod:false
    }
    // alert(this.props.navigation.state.params.addressId)
    //
    DefaultPreference.get('orderId').then(function(value) {
          //
          if(value == null || value == undefined){
            orderId=0
          }else{
            orderId=value
          }
          //
          console.log('Payment Order Id--> '+orderId)
    });
    //
    DefaultPreference.get('cartId').then(function(value){
        cartId=value
        console.log('Payment cartId --> '+cartId)
    });
    //
    DefaultPreference.get('addressId').then(function(value){
      // if(value !== null || value !== undefined){
        // addressId=value
        this.setState({
          addressId:value
        })
      // }
      console.log('Payment addressId --> '+addressId)
    });
    //
    stringsoflanguages.setLanguage((this.props.paymentMode.getLanguageCode.languageCode=='en')?'en':'fr');
    //
    var that = this
    DefaultPreference.get('isSelection').then(function(value) {
      new Promise((resolve, reject) => {
          new Promise(function(resolve, reject) {
              resolve(value);
          }).then(value => {
              if(value=='cod'){
                that.setState({
                  cod:true
                })
              }else if(value=='airtel'){
                that.setState({
                  airtelMoney:true
                })
              }else{
              }
          });
      });
      return value;
    });
    //
  }
  paymentApi=(navigate)=>{
    //
    // alert(this.state.addressId)

    let requestData={
      "address_id":this.state.addressId,
      "order_id":(orderId!=undefined)?orderId:'0',
      "total_price":this.state.totalAmt,
      "delievery_tag":this.props.navigation.state.params.deliveryType,
    };
      client.defaults.headers.common['Authorization'] = (this.props.paymentMode.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.paymentMode.getCurrentToken.currentToken;
      //
      client.post('paymentcod',requestData)
      .then((response) => {
            if(response.data.status==200){
              DefaultPreference.clear('cartCounterValue')
              this.props.setCartCounter(0);
                  navigate('OrderConfirm')
            }else{
                alert(response.data.message)
            }
           }, (error) => {
             alert(error.response.data.message);
      });
  }

  render(){
    const {navigate} = this.props.navigation;
    return(
      <View style={{flexGrow:1,backgroundColor: '#FFFFFF'}}>
            <NavigationEvents
              onWillFocus={payload => console.log('CatCom onWillFocus ')}
              onDidFocus={payload => console.log('CatCom onDidFocus ')}
              onWillBlur={payload => console.log('CatCom onWillBlur ', payload)}
              onDidBlur={payload => {this.props.reset()}}
             />
            <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
            <SafeAreaView style={{flexGrow:1}}>
                <Header headerTitle={stringsoflanguages.payment} headerNavigation={this.props.navigation} isBack={true} notificationCount={0}/>
                <ScrollView style={{flexBasis: 0,width: Dimensions.get('window').width}} nestedScrollEnabled={true}>

                <View style={{flex:1}}>
                      <View style={{flex:1,flexDirection: 'column'}}>
                            <View style={{width: Dimensions.get('window').width-10,justifyContent: 'center',padding: 20,height: 120,margin:  5,marginBottom: 0,borderRadius:25,backgroundColor: '#287100'}}>
                                  <Text style={{color:'white',fontSize: 18}}>{stringsoflanguages.paymentPurchaseTerm}</Text>
                            </View>
                            <View style={{width: Dimensions.get('window').width,height: 100,backgroundColor: '#D6D5D5',justifyContent: 'center',alignItems: 'flex-start',flexDirection: 'column'}}>
                            <CheckBox containerStyle={{backgroundColor: "transparent", borderWidth: 0,marginTop: 0,marginBottom: 0}}
                                      title={stringsoflanguages.airtelMoney}
                                      textStyle={{color:'black'}}
                                      checkedColor='#287100'
                                      uncheckedColor='white'
                                      onPress={() => this.onSavedData(!this.state.airtelMoney,false)}
                                      checked={this.state.airtelMoney}/>
                            <CheckBox containerStyle={{backgroundColor: "transparent", borderWidth: 0,marginTop: 0,marginBottom: 0}}
                                      title={stringsoflanguages.mtnMobileMoney}
                                      textStyle={{color:'black'}}
                                      checkedColor='#287100'
                                      uncheckedColor='white'
                                      onPress={() => this.onSavedData(false,false)}
                                      checked={this.state.mtnMoney}/>
                            </View>
                            <View style={{justifyContent:  'space-between',marginHorizontal:  40 ,flexDirection: 'row'}}>
                                  <Image  source={require('../../images/icon/airtel_money.png')}
                                                          resizeMode='contain'
                                                          style={{width: 100,
                                                              height: 100}}/>
                                  <Image  source={require('../../images/icon/mtn_mobile.png')}
                                                          resizeMode='contain'
                                                          style={{width: 100,
                                                              height: 100}}/>
                          </View>
                          <Text style={{alignSelf: 'center',fontWeight: 'bold',fontSize: 18,margin:15}}>{stringsoflanguages.orText}</Text>

                      </View>
                      <View style={{flex:1,flexDirection: 'column',justifyContent: 'center',alignItems: 'center',margin: 10}}>
                            <View style={{width: Dimensions.get('window').width-10,justifyContent: 'center',alignItems: 'center',padding: 15,height: 120,margin:  5,marginBottom: 0,borderRadius:25,backgroundColor: '#287100'}}>
                                  <Text style={{color:'white',fontSize: 18}}>{stringsoflanguages.paymentOnDelivery}</Text>
                            </View>
                            <View style={{width: Dimensions.get('window').width,height: 100,backgroundColor: '#D6D5D5',justifyContent: 'center',alignItems: 'flex-start',flexDirection: 'column'}}>
                            <CheckBox containerStyle={{backgroundColor: "transparent", borderWidth: 0,marginTop: 0,marginBottom: 0}}
                                      title={stringsoflanguages.cod}
                                      textStyle={{color:'black'}}
                                      checkedColor='#287100'
                                      uncheckedColor='white'
                                      onPress={() => this.onSavedData(false,!this.state.cod)}
                                      checked={this.state.cod}/>
                            </View>
                            {(this.state.cod || this.state.airtelMoney) && this.state.totalAmt !==0 ?
                            <TouchableOpacity onPress={this.onClickPaymentBtn.bind(this,navigate)}>
                                  <View style={{width: Dimensions.get('window').width-50,marginBottom: 20,justifyContent: 'center',alignItems: 'center',padding: 15,margin:  20,borderRadius:25,backgroundColor: '#287100'}}>
                                        <Text style={{color:'white',fontSize: 18,alignSelf: 'center'}}>{stringsoflanguages.confirmYourPayment}</Text>
                                  </View>
                            </TouchableOpacity>:null
                          }
                      </View>
                </View>
                </ScrollView>
            </SafeAreaView>
      </View>
    )
  }

  onSavedData=(airtelMoney,cod)=>{
    //
    this.setState({cod: cod,mtnMoney:false,airtelMoney:airtelMoney})
    DefaultPreference.set('isSelection', (airtelMoney == true)?'airtel':'cod').then(function() {
    });
  }

  onClickPaymentBtn=(navigate)=>{
    //
    //alert(this.state.totalAmt+' '+orderId+' '+addressId)
    //
    if(this.state.cod){
      this.paymentApi(navigate)
      //
      DefaultPreference.clear('orderId')
      DefaultPreference.clear('addressId')
      //
    }else if(this.state.airtelMoney){
      navigate('paymentCC',{
        'totalAmt':this.state.totalAmt,
        'addressId':addressId,
        'userId':this.props.userToken,
        'orderId':orderId
      })
    }
  }
}

mapStateToProps=state=>{
  return{
     paymentMode:state,
     userToken:state.getCurrentToken.currentToken
  }
}

export default connect(mapStateToProps,{getRequest,reset,setToken,setNotificationCounter,setCartCounter,setLanguageCode})(PaymentModeComponent);
