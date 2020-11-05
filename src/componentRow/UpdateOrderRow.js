import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  StatusBar,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as global from '../styles/Global';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {ADDTOCART} from '../utils/ApiMethods';
import {connect} from 'react-redux';
import {postRequest,reset} from '../redux/actions/ApiCallerAction';
//
import NumberFormat from 'react-number-format';
import DefaultPreference from 'react-native-default-preference';
import { StackActions,NavigationActions } from 'react-navigation';
//
import {BASE_URL} from '../utils/ApiMethods';
//
var isWishStatus = 0
var languageCodeGlobal = ''
var tempOrderId = ''
var updateOrderNavigate= ''
var isload=false
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
const UpdateOrderRow =({orderData,index,orderId,navigate,orderCount})=>{
  //
  tempOrderId=orderId
  updateOrderNavigate=navigate
  oldOrderData=orderData
  //
  console.log(index);
  console.log('Order Product Count --->'+orderData)

  const [tempQuantity,setQuantity] = React.useState(orderData.attribute[0].quantity);

  return(
    <View style={{marginTop:10,width: Dimensions.get('window').width,height: undefined,flexDirection: 'row'}}>

          <Image source={{uri:(orderData == undefined)?'':orderData.order_image[0]}}
                     style={{width:60,height:60,marginLeft:10}}/>

           <View style={{margin:10}}>
                <Text style={{width:200,fontSize: 16}}>{orderData.name}</Text>
                <NumberFormat value={orderData.attribute[0].sale_price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                   <Text style={{marginLeft: 10,marginBottom: 10,marginTop: 5,color:global.LIGHT_GREEN,fontSize: 14,fontWeight: 'bold'}}>{`${value} XAF`}</Text>} />
                {/* <Text style={{color:global.LIGHT_GREEN,fontSize:14,fontWeight:'bold',marginTop:5}}>{orderData.attribute[0].sale_price}</Text>*/}
          </View>

            <View style={{flexGrow: 1,flexBasis: 0,flexDirection: 'column',justifyContent: 'flex-end',paddingBottom: 5}}>
                <View style={{flexDirection: 'column',justifyContent: 'center',alignItems: 'center',flexGrow: 1,flexBasis: 0}}>

                     <TouchableOpacity onPress={updateProduct.bind(this,'add',orderData,tempQuantity,setQuantity,index,orderCount)}>
                           <Image source={require('../../images/category/add.png')}
                                  style={{resizeMode: 'contain',width: 20,height: 20}}/>
                      </TouchableOpacity>

                      <Text style={{backgroundColor: global.LIGHT_YELLOW,width: 30,marginTop: 14,textAlign:'center',
                                    paddingTop: 5,height: 30,borderRadius:15,color:'white',
                                    fontSize: 15}}>{tempQuantity}</Text>

                      <TouchableOpacity onPress={updateProduct.bind(this,'remove',orderData,tempQuantity,setQuantity,index,orderCount)}>
                            <Image source={require('../../images/category/remove.png')}
                                   style={{marginTop:5,resizeMode:'contain',width: 20,height: 20}}/>
                     </TouchableOpacity>

               </View>
            </View>
            <View style={{position: 'absolute', alignSelf: 'flex-end',height: 1,marginLeft: 20,backgroundColor: '#BCBBBB',width: Dimensions.get('window').width-40}}/>
    </View>
    );
}

function updateProduct(type,orderData,tempQuantity,setQuantity,index,orderCount){

        if(type=='add'){
          orderData.attribute[0].quantity=tempQuantity+1
          setQuantity(tempQuantity+1)
        }else{

            if(orderCount>1){

               if(tempQuantity!=0){
                 setQuantity(tempQuantity-1)
                 orderData.attribute[0].quantity=tempQuantity-1
               }

            }else{

              if(tempQuantity==1){
                  Alert.alert(
                    "Cancel Order",
                    "Are you sure you want to cancel order ?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "OK", onPress:() => alert(index)}
                    ],
                    { cancelable: false }
                  );
            }else{
              orderData.attribute[0].quantity=tempQuantity-1
                setQuantity(tempQuantity-1)
            }
          }
        }
  }

  function callCancelOrder(orderId){
    //
    let requestData={
      "order_id":orderId,
      "latitude":"3.44448",
      "longitude":"6.677788",
      "city":"Ahmedabad"
      };
      //
    client.post('cancelorder',requestData)
    .then((response) => {
         updateOrderNavigate('CurrentOrder')
       }, (error) => {
         updateOrderNavigate('CurrentOrder')
         //
         console.log('Cancel Order Response error'+JSON.stringify(error.data.message));
     });
  }

export default connect(mapStateToProps,{postRequest,reset})(UpdateOrderRow);
