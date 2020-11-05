import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  StatusBar,
  TouchableOpacity,
  Platform
} from 'react-native';
import * as global from '../styles/Global';
import FastImage from 'react-native-fast-image';
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import DefaultPreference from 'react-native-default-preference';
//
import NumberFormat from 'react-number-format';
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
DefaultPreference.get('userToken').then(function(value) {
  client.defaults.headers.common['Authorization'] = (value=='-1')?'':'Bearer '+value;
  return value;
});
//
const CartRow =({cartData,cartNavigation,indexPos,deleteCart,updateAddToCartItem,updateRemoveToCartItem,userToken})=>{
  //
  const [cartCounter, setCartCounter] = React.useState(cartData.attribute[0].quantity);
  const [ttCounter, tempTotalCounter] = React.useState(cartData.attribute[0].quantity);
  return(
        <View>
          <View style={{width: Dimensions.get('window').width,
                        height: undefined,flexDirection: 'row'}}>

                  <View style={{justifyContent: 'center',alignItems: 'center',flexGrow: 1,flexBasis: 0}}>
                        <Image source={{uri:(cartData!=undefined)?cartData.product_image[0]:''}}
                                   style={{width:60,height:60}}/>
                  </View>
                  <View style={{flexGrow: 2,flexBasis: 0,flexDirection: 'column',justifyContent: 'center'}}>
                        <TouchableOpacity>
                              <Text style={{fontSize: 16,paddingTop:25}}>{cartData.product_name}</Text>
                              <Text numberOfLines={1} style={{marginTop: 5,color:global.DARK_GRAY,fontSize: 15}}>{`${cartData.short_description} ${(cartData.attribute[0].Poids!=undefined)?'('+cartData.attribute[0].Poids+')':''}`}</Text>
                              <NumberFormat value={(cartData.attribute!=undefined)?cartData.attribute[0].sale_price:''} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                <Text style={{marginTop: 4,color:global.LIGHT_GREEN,fontSize: 14,fontWeight: 'bold',paddingBottom:25}}>{`${value} XAF`}</Text>} />
                        </TouchableOpacity>
                  </View>

                  <View style={{flexGrow: 1,flexBasis: 0,flexDirection: 'column',justifyContent: 'flex-end',paddingBottom: 5}}>

                      <View style={{flexDirection: 'column',justifyContent: 'center',alignItems: 'center',flexGrow: 1,flexBasis: 0}}>
                           <TouchableOpacity onPress={onClickUpdateCart.bind(this,'add',setCartCounter,cartCounter,deleteCart,cartData,updateAddToCartItem,updateRemoveToCartItem,userToken,ttCounter)}>
                                 <Image source={require('../../images/category/add.png')}
                                        style={{resizeMode: 'contain',width: 20,height: 20}}/>
                            </TouchableOpacity>
                            <Text style={{
                                         backgroundColor: global.LIGHT_YELLOW,
                                         width: 30,
                                         marginTop: 14,
                                         textAlign:'center',
                                         paddingTop: 5,
                                         height: 30,
                                         borderRadius:12,
                                         color:'white',
                                         fontSize: 15}}>{cartCounter}</Text>
                            <TouchableOpacity onPress={onClickUpdateCart.bind(this,'minus',setCartCounter,cartCounter,deleteCart,cartData,updateAddToCartItem,updateRemoveToCartItem,userToken,ttCounter)}>
                                  <Image source={require('../../images/category/remove.png')}
                                         style={{marginTop: 5,resizeMode: 'contain',width: 20,height: 20}}/>
                           </TouchableOpacity>
                     </View>
                     <View style={{position: 'absolute',paddingBottom: 15}}>
                        <TouchableOpacity onPress={callCartDeleteAPI.bind(this,cartData,userToken,deleteCart)}>
                             <Image source={require('../../images/category/delete_cart_icon.png')}
                                    style={{resizeMode: 'contain',width: 20,height: 20}}/>
                        </TouchableOpacity>
                     </View>
                  </View>
                  <View style={{position: 'absolute',alignSelf: 'flex-end',height: 1,marginLeft: 20,backgroundColor: '#BCBBBB',width: Dimensions.get('window').width-40}}/>
          </View>
    </View>

  );
}

function onClickUpdateCart(type,setCartCounter,cartCounter,deleteCart,cartData,updateAddToCartItem,updateRemoveToCartItem,userToken,ttCounter){
  //
  if(type=='add'){
    if(Number(cartCounter)==Number(cartData.attribute[0].total_qty)){
        alert('No More Items available')
    }else{
      setCartCounter(cartCounter+1)
      updateAddToCartItem(cartData.cart_id)
      callCartupdateAPI(cartData,cartCounter+1,userToken)
    }
  }else{
    if(cartCounter == 1){
    }else{
      if(cartCounter>1){
        setCartCounter(cartCounter-1)
        updateRemoveToCartItem(cartData.cart_id)
        callCartupdateAPI(cartData,cartCounter-1,userToken)
      }
    }
  }
}

callCartupdateAPI=(cartData,counter,userToken)=>{
    client.defaults.headers.common['Authorization'] = (userToken=='-1')?'':'Bearer '+userToken;
    cartData.attribute[0].quantity = counter
    let requestData={
      "product_id":cartData.product_id,
      "attribute":cartData.attribute,
      "cart_id":cartData.cart_id,
    };
    client.post('addcart',requestData)
    .then((response) => {
     }, (error) => {
           console.log('Add to Cart Response Error  '+JSON.stringify(error.response.data));
    });
}

callCartDeleteAPI=(cartData,userToken,deleteCart)=>{
  //
  client.defaults.headers.common['Authorization'] = (userToken=='-1')?'':'Bearer '+userToken;
  //
  let requestData={
    "cart_id":cartData.cart_id
  };
  client.post('deletecart',requestData)
  .then((response) => {
         deleteCart(cartData.cart_id)
       }, (error) => {
         console.log('Add to Cart Response Error  '+JSON.stringify(error.response.data));
  });
}

export default CartRow;
