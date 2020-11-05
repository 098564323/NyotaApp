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
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';

import EmptyCartRow from '../componentRow/EmptyCartRow'
import Footer from '../utils/Footer';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
//
import {getRequest,reset} from '../redux/actions/ApiCallerAction';
import {setToken} from '../redux/actions/SetTokenActions';
import {setCartCounter} from '../redux/actions/cartCounterAction';
import {connect} from 'react-redux';
import {CART_DATA} from '../utils/ApiMethods';
import { NavigationEvents } from 'react-navigation';
import CartRow from '../componentRow/CartRow';
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
import NumberFormat from 'react-number-format';
//
import { CheckBox } from 'react-native-elements';
import DefaultPreference from 'react-native-default-preference';
//import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
//
var isAvailable=true
var isEmptycartvisible=false
//
var isDeleteData=true
var filteredData;
//
var addressId=''
var orderId=''
//
import {BASE_URL} from '../utils/ApiMethods';
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
class CartComponent extends Component{

        constructor(props){
          super(props)
          //
          client.defaults.headers.common['Authorization'] = (this.props.cartData.getCurrentToken.currentToken==-1)?'':'Bearer '+this.props.cartData.getCurrentToken.currentToken;
          stringsoflanguages.setLanguage((this.props.cartData.getLanguageCode.languageCode=='en')?'en':'fr');
          //
          this.state={
            tempCartData:[],
            isDelete:false,
            subtotal:-1,
            deliveryCharge:10,
            taxamt:5,
            totalAmt:0,
            isDeleteFromCart:false,
            maxPrice:0,
            serverTaxAmt:0,
            deliveryType:'1',
            cartApiResponse:[],
            isStandard:true,
            deliveryData:'',
            shippingPrice:0
          }
        }

      callAPIfun=()=>{
        //
        DefaultPreference.get('orderId').then(function(value) {
              orderId=value
              console.log('Inside cart order id-->'+orderId)
        });
        //
        DefaultPreference.get('addressId').then(function(value) {
              addressId=value
              console.log('Inside cart Address id-->'+addressId);
        });
        //
        isDeleteData = true;
        isAvailable = true;
        //
        client.defaults.headers.common['Authorization'] = (this.props.cartData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.cartData.getCurrentToken.currentToken;
        //
        let requestData={
          "latitude":this.props.latitude,
          "longitude":this.props.longitude,
          "city":this.props.cityName
        };
        //
        console.log('Cart request Data---> '+JSON.stringify(requestData))
        client.post('getcart',requestData)
        .then((response) => {
          console.log('Cart response Data---> '+JSON.stringify(response))
              DefaultPreference.set('cartId',response.data.data[0].cart_id).then(function() {});
              //
              isAvailable = false
              isDeleteData = false
              //
              this.setState({
                deliveryCharge:Number(response.data.standard_delievery),
                taxamt:response.data.tax,
                serverTaxAmt:response.data.tax,
                maxPrice:response.data.maximum_price,
                cartApiResponse:response.data.data,
                deliveryData:response.data,
                shippingPrice:response.data.shipping_price
              })
              // alert(this.state.shippingPrice)
              //
              this.checkoutData(Number(this.state.deliveryData.standard_delievery),response.data.tax,response.data.data)
              this.props.setCartCounter(Number(response.data.data.length))
              //
           }, (error) => {
             alert(JSON.stringify(response))
             if(error.response.data.status=='401'){
               this.setState({
                 subtotal:0
               })
             }
          });
      }

      updateAddToCartItem = cart_id =>{
        var tempData = this.state.cartApiResponse.filter(item => item.cart_id === cart_id);
        //
        var tempSubTotal = this.state.subtotal+(1*parseInt(tempData[0].attribute[0].sale_price.slice(0,-1),10))
        var tempTaxAmt = (tempSubTotal*this.state.serverTaxAmt)/100

        //
        this.setState({
          taxamt:tempTaxAmt,
          subtotal: this.state.subtotal+(1*parseInt(tempData[0].attribute[0].sale_price.slice(0,-1),10)),
          totalAmt: (this.state.subtotal+(1*parseInt(tempData[0].attribute[0].sale_price.slice(0,-1),10))+this.state.deliveryCharge+tempTaxAmt+parseInt(this.state.shippingPrice))
        })
      }

      updateRemoveToCartItem = cart_id =>
      {
        var tempData = this.state.cartApiResponse.filter(item => item.cart_id === cart_id);
        //
        var tempSubTotal = this.state.subtotal-(1*parseInt(tempData[0].attribute[0].sale_price.slice(0,-1),10))
        var tempTaxAmt = (tempSubTotal*this.state.serverTaxAmt)/100
        //
        this.setState({
          taxamt:tempTaxAmt,
          subtotal: this.state.subtotal-(1*parseInt(tempData[0].attribute[0].sale_price.slice(0,-1),10)),
          totalAmt: (this.state.subtotal-(1*parseInt(tempData[0].attribute[0].sale_price.slice(0,-1),10))+this.state.deliveryCharge+tempTaxAmt+parseInt(this.state.shippingPrice))
        })
      }
      deleteCartItem = cart_id => {
        //
        this.props.setCartCounter(0)
        //
        this.props.reset()
        //
        isAvailable = true;
        isDeleteData = true;
        //
        this.setState({
          subtotal:-1
        })
        //
        this.callAPIfun()
        //this.props.getRequest(CART_DATA);
      }
      render(){
          //
          const {navigate} = this.props.navigation;
          //
          if(this.props.cartData.apiData.isFetchning===false
            && this.props.cartData.apiData.data.data!==undefined
            && isAvailable==true){
                isAvailable = false
                isDeleteData = false
                this.setState({
                  deliveryCharge:Number(this.state.deliveryData.standard_delievery),
                  taxamt:this.state.deliveryData.tax,
                  serverTaxAmt:this.state.deliveryData.tax,
                  maxPrice:this.state.deliveryData.maximum_price
                })
                this.checkoutData(Number(this.state.deliveryData.standard_delievery),this.state.deliveryData.tax,this.state.cartApiResponse)
                this.props.setCartCounter(Number(this.state.cartApiResponse.length))
          }
          if(this.props.cartData.apiData.error.error=='Unauthenticated.' && isDeleteData == true){
            //
            this.setState({
              subtotal:0
            })
            //
            isDeleteData = false
            isAvailable = false
          }
          if(this.props.cartData.apiData.isFetchning===false
            && this.props.cartData.apiData.error.status==401
            && isDeleteData == true){
              this.setState({
                subtotal:0
              })
              //
              isDeleteData = false
              isAvailable = false
          }
          //
          return (
              <View style={{flexGrow:1}}>
                    <NavigationEvents
                      onWillFocus={payload => {this.props.reset()}}
                      onDidFocus={this.callAPIfun}
                      onWillBlur={payload => {this.props.reset(),this.setState({subtotal:-1})}}
                      onDidBlur={payload => {isAvailable = false}}/>

                    <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
                    <SafeAreaView style={{flexGrow:1}}>
                        <Header headerTitle={stringsoflanguages.cart} headerNavigation={this.props.navigation} isSearch={true} isNotification={true} isBack={true} notificationCount={this.props.cartData.getNotificationCounter.notificatinCounter}/>
                        <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,justifyContent: 'center',alignItems: 'center'}}>
                        {
                            (this.state.subtotal==-1)?<ActivityIndicator/>
                            :(this.state.subtotal==0)
                                ?<EmptyCartRow screenNavigate={navigate}
                                               emptyCartRow={stringsoflanguages.cartEmpty}
                                               languageCode={(this.props.cartData.getLanguageCode.languageCode=='en')?'en':'fr'}/>
                                :<FlatList
                                        data={this.state.cartApiResponse}
                                        extraData={this.state.cartApiResponse}
                                        style={{backgroundColor: global.APP_BG, width: Dimensions.get('window').width}}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={ ({item,index}) =>
                                          <CartRow cartData={item} cartNavigation={navigate} indexPos={index}
                                          deleteCart={() => this.deleteCartItem(item.cart_id)}
                                          updateAddToCartItem={()=> this.updateAddToCartItem(item.cart_id)}
                                          updateRemoveToCartItem={()=> this.updateRemoveToCartItem(item.cart_id)}
                                          userToken={this.props.cartData.getCurrentToken.currentToken}/>}/>
                          }

                          {(this.state.subtotal>0)?
                          <View style={styles.bottomViewStyle}>
                                    <View style={{flexDirection:'row',marginTop:20,marginLeft:20,justifyContent:'space-between'}}>
                                        <Text style={{fontSize:18,color:'#626161'}}>{stringsoflanguages.subTotal}</Text>
                                        <NumberFormat value={this.state.subtotal} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                            <Text style={{color:'#38A935',fontSize:18,fontWeight:'bold',marginRight:20}}>{`${value} XAF`}</Text>
                                          } />
                                    </View>

                                    <View style={{flexDirection:'row',marginTop:5,marginLeft:20,justifyContent:'space-between'}}>
                                        <Text style={{fontSize:18,color:'#626161'}}>{stringsoflanguages.deliveryChanges}</Text>
                                        <NumberFormat decimalScale={2} value={this.state.deliveryCharge} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                            <Text style={{color:'#38A935',fontSize:18,fontWeight:'bold',marginRight:20}}>{`${value} XAF`}</Text>
                                          } />
                                    </View>

                                    <View  style={{flexDirection:'row',marginTop:5,marginLeft:20,justifyContent:'space-between',marginBottom:10}}>
                                        <Text style={{fontSize:18,color:'#626161'}}>{stringsoflanguages.tax}</Text>
                                        <NumberFormat decimalScale={2} value={this.state.taxamt} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                            <Text style={{color:'#38A935',fontSize:18,fontWeight:'bold',marginRight:20}}>{`${value} XAF`}</Text>
                                          } />
                                    </View>
                                    <View  style={{flexDirection:'row',marginTop:5,marginLeft:20,justifyContent:'space-between',marginBottom:10}}>
                                        <Text style={{fontSize:18,color:'#626161'}}>{stringsoflanguages.shippingPrice}</Text>
                                        <NumberFormat decimalScale={2} value={this.state.shippingPrice} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                            <Text style={{color:'#38A935',fontSize:18,fontWeight:'bold',marginRight:20}}>{`${value} XAF`}</Text>
                                          } />
                                    </View>
                                    <View style={{backgroundColor:'white',height:50,marginTop:5,marginLeft:20}}>
                                          <Text style={{fontSize:18,color:'#626161',fontWeight:'bold'}}>{stringsoflanguages.deliveryOption}</Text>
                                      <View style={{flexDirection:'row',flex:(Platform.OS === 'android')?1:0}}>
                                              <CheckBox
                                                  onPress={() => {this.setState({isStandard:true,deliveryCharge:Number(this.state.deliveryData.standard_delievery),deliveryType:'1'})
                                                                                 this.checkoutData(Number(this.state.deliveryData.standard_delievery),this.state.deliveryData.tax,this.state.cartApiResponse)}}
                                                  checkedIcon={<Image source={require('../../images/category/radio_selected.png')} />}
                                                  uncheckedIcon={<Image source={require('../../images/category/radio_unselected.png')} />}
                                                  containerStyle={{borderWidth:0,backgroundColor: "transparent"}}
                                                  title={stringsoflanguages.standard}
                                                  checked={this.state.isStandard}/>
                                              <CheckBox
                                                  onPress={() => {this.setState({isStandard:false,deliveryCharge:Number(this.state.deliveryData.express_delievery),deliveryType:'0'})
                                                                                 this.checkoutData(Number(this.state.deliveryData.express_delievery),this.state.deliveryData.tax,this.state.cartApiResponse)}}
                                                  checkedIcon={<Image source={require('../../images/category/radio_selected.png')} />}
                                                  uncheckedIcon={<Image source={require('../../images/category/radio_unselected.png')} />}
                                                  containerStyle={{borderWidth: 0,backgroundColor: "transparent"}}
                                                  title={stringsoflanguages.express}
                                                  checked={!this.state.isStandard}/>
                                        </View>
                                    </View>
                                  <View style={{width: undefined,height: 1,marginTop:20,marginHorizontal: 15,backgroundColor: global.LIGHT_GRAY}}>
                                  </View>

                                  <View  style={{flexDirection:'row',marginLeft:20,justifyContent:'space-between',marginTop:15,marginBottom: 25}}>
                                      <Text style={{fontSize:18,color:'#626161',fontWeight:'bold'}}>{stringsoflanguages.totalAmount}</Text>
                                      <NumberFormat decimalScale={2} value={this.state.totalAmt} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                          <Text style={{color:'#38A935',fontSize:18,fontWeight:'bold',marginRight:20}}>{`${value} XAF`}</Text>
                                        } />
                                  </View>
                                  <TouchableOpacity onPress={this.onPressCheckoutBtn.bind(this)}>
                                        <Image source={(this.props.cartData.getLanguageCode.languageCode=='en')?require('../../images/profile/Checkoutbtn.png'):require('../../images/profile/Checkoutbtn_fr.png')}
                                                style={{height:40,width:200,alignSelf:'center',borderRadius:20,marginBottom: 25}}/>
                                  </TouchableOpacity>
                         </View>:null
                       }
                        </View>
                        <Footer footerNavigate={navigate} screenPos={3} footerCartCounter={Number(this.props.cartData.getCartCounter.cartCounter)}/>
                    </SafeAreaView>
              </View>
          );
    }
    onPressCheckoutBtn=()=>{
      if(this.state.totalAmt>=this.state.maxPrice){
          alert(stringsoflanguages.reachWithmaxPrice)
      }else{
          client.get(BASE_URL+'checkout')
          .then((response)=>{
            if(response.data.status==200){
              const {navigate} = this.props.navigation;

              if(addressId==undefined && addressId==null && orderId==undefined && orderId==null ){
                  navigate('Address',{
                    isFromCart:true,
                    totalAmt:this.state.totalAmt,
                    deliveryType:this.state.deliveryType})
                  }else{
                    navigate('paymentMode',{
                        totalAmt:this.state.totalAmt,
                        deliveryType:this.state.deliveryType})
                  }
            }else{
              var strTemp = ''
              for(var i=0;i<response.data.data.length;i++){
                strTemp+=response.data.data[i]+' '
              }
              // alert(strTemp)
            }
          },(error)=>{
           console.log('Full Address Error--->'+JSON.stringify(error));
          });
       }
    }

   checkoutData=(deliveryCharge,taxAmount,responseData)=>{
       //
       var tempSubTotal = 0
       //
       for(let i=0;i<responseData.length;i++){
           tempSubTotal+=(responseData[i].attribute[0].quantity*parseInt(responseData[i].attribute[0].sale_price.substr(0,responseData[i].attribute[0].sale_price.length-1),10))
       }
       //
       var tempTaxAmt = (tempSubTotal*Number(taxAmount))/100
       //
       this.setState({
         subtotal:tempSubTotal,
         taxamt:tempTaxAmt,
         totalAmt:(tempSubTotal+tempTaxAmt+deliveryCharge+parseInt(this.state.shippingPrice))
       })
    }
}
const styles = StyleSheet.create({
    bottomViewStyle:{
      width: Dimensions.get('window').width-60,
      backgroundColor:'#FFFFFF',
      flexDirection:'column',
      elevation:5,
      marginTop: 10,
      borderTopLeftRadius:10,
      borderTopRightRadius:10
    }
});
mapStateToProps=(state,propsData)=>{
  return{
     cartData:state,
     screenName:propsData.navigation.state.routeName,
     latitude:state.getLatitudeLongitude.currentLatitude,
     longitude:state.getLatitudeLongitude.currentLongitude,
     cityName:state.getLatitudeLongitude.city,
  }
}

export default connect(mapStateToProps,{getRequest,reset,setToken,setCartCounter,setNotificationCounter,setLanguageCode})(CartComponent);
