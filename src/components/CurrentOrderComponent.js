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
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  VirtualizedList
} from 'react-native';

import StepIndicator from 'react-native-step-indicator';
import {connect} from 'react-redux';
import {CURRENTORDER} from '../utils/ApiMethods';
import {reset,getRequest} from '../redux/actions/ApiCallerAction';
import {setToken} from '../redux/actions/SetTokenActions';
import Footer from '../utils/Footer';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import FastImage from 'react-native-fast-image';
//
import NumberFormat from 'react-number-format';
import DefaultPreference from 'react-native-default-preference';
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
var isDeleteData=false
var filteredData;
//
class CurrentOrderComponent extends Component{

  constructor(props) {
    super(props);
    client.defaults.headers.common['Authorization'] = (this.props.currentOrderData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.currentOrderData.getCurrentToken.currentToken;
    this.state = {show:false,
                  isFetching:true,
                  isDataLoad:0,
                  responseData:[],
                  status:'-1',
                  currentPosition:0,
                  dateTime:[],
                  orderId:'',
                  purchaseDate:'',
                  esitmatedDate:'',
                  orderAmt:'',
                  currentStatus:'',
                  cartData:[],
                  wData:[],
                  currentPos:-1,
                  isModificationShow:false,
                  addressId:''};
    stringsoflanguages.setLanguage((this.props.currentOrderData.getLanguageCode.languageCode=='en')?'en':'fr');
  }
  //
   callCancelOrder=(orderId)=>{
     //
     let requestData={
       "order_id":orderId,
       "latitude":this.props.latitude,
       "longitude":this.props.longitude,
       "city":this.props.cityName
       };
       //
     client.post('cancelorder',requestData)
     .then((response) => {
          //
          isDeleteData = true;
          if(filteredData == undefined){
            filteredData = this.state.responseData.filter(item => item.order_id !== orderId);
          }else{
            filteredData = filteredData.filter(item => item.order_id !== orderId);
          }
          this.setState({wData: filteredData})
          //
        }, (error) => {
          console.log('Cancel Order Response error'+JSON.stringify(error.data.message));
      });
   }

    callCurrentOrder=()=>{

      isDeleteData = false
      //
       client.defaults.headers.common['Authorization'] = (this.props.currentOrderData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.currentOrderData.getCurrentToken.currentToken;
       //
       let requestData={
         "latitude":this.props.latitude,
         "longitude":this.props.longitude,
         "city":this.props.cityName
       };
       //
       client.post('currentorder',requestData)
       .then((response) => {
           //
           console.log('Current Order Response ---> '+JSON.stringify(response));
           //
           var tempDateTime = []
           for(var i=0;i<response.data.data.length;i++)
           {
             console.log("order_modification"+response.data.data[i].order_modification);
             //
             tempDateTime.push({
                'Order Placed':{'date':response.data.data[i].order_placed,'isChecked':(response.data.data[i].order_placed==="")?false:true,'name':stringsoflanguages.orderPlaced},
                'Modification':{'date':response.data.data[i].order_modification,'isChecked':(response.data.data[i].order_modification===""||response.data.data[i].order_modification==undefined)?false:true,'name':stringsoflanguages.modification},
                'Order Confirmed':{'date':response.data.data[i].order_confirmed,'isChecked':(response.data.data[i].order_confirmed==="")?false:true,'name':stringsoflanguages.orderConfirm},
                'Packed':{'date':response.data.data[i].order_packed,'isChecked':(response.data.data[i].order_packed==="")?false:true,'name':stringsoflanguages.packed},
                'Shipped':{'date':response.data.data[i].order_shipped,'isChecked':(response.data.data[i].order_shipped==="")?false:true,'name':stringsoflanguages.shiped},
                'Delivered':{'date':response.data.data[i].order_delivered,'isChecked':(response.data.data[i].order_delivered==="")?false:true,'name':stringsoflanguages.delivered}
             })
           }
           //
          console.log('Current Order Response --> '+JSON.stringify(response.data.data));
          //
          this.setState({
            status:'1',
            isFetching:false,
            isDataLoad:1,
            responseData:response.data.data,
            orderId:response.data.data[0].order_id,
            addressId:response.data.data[0].address_id,
            purchaseDate:response.data.data[0].purchase_date,
            esitmatedDate:response.data.data[0].est_delivery_date,
            orderAmt:response.data.data[0].order_amount,
            currentStatus:response.data.data[0].order_status,
            cartData:response.data.data,
            dateTime:tempDateTime
           })
        }, (error) => {
          this.setState({
            status:'2',
            isDataLoad:2
          })
       });
     }
      render(){
          return (
            <View style={{flexGrow:1}}>
                  <NavigationEvents
                    onWillFocus={payload => {filteredData=null}}
                    onDidFocus={this.callCurrentOrder}
                    onWillBlur={payload => console.log('test')}
                    onDidBlur={payload => console.log('test')}
                   />
                  <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
                  <SafeAreaView style={{flexGrow:1}}>
                      <Header headerTitle={stringsoflanguages.currentOrder} headerNavigation={this.props.navigation} isSearch={false} isNotification={false} isBack={true} notificationCount={0}/>
                      <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,width: Dimensions.get('window').width}}>
                      {
                        (this.state.isFetching==false)?
                         <this.orderViewData responseData={(isDeleteData)?this.state.wData:this.state.responseData}/>:(this.state.isDataLoad==0)?<ActivityIndicator style={{width:60,height:60,marginRight: 30,alignSelf: 'center'}} size="large" color="#035B00"/>:<Text style={{alignSelf: 'center'}}>{stringsoflanguages.noDataFound}</Text>
                      }
                      </View>
                  </SafeAreaView>
            </View>
        );
    }

    orderViewData=({responseData})=>{
      //
      function getItemCount (data) {
          return (responseData== undefined)?0:responseData.length
      }
      //
      function getItem (data, index) {
          return (responseData== undefined)?null:responseData[index]
      }
      //
      return(
        <VirtualizedList
              data={responseData}
              getItemCount={getItemCount}
              getItem={getItem}
              keyExtractor = { (item, index) => index.toString() }
              renderItem={({ item, index }) => {
                return (
                  <this.cureentOrderDataRow orderData={item} indexPos={index}/>
                )
              }}
          />
      );
    }

    cureentOrderDataRow=({orderData,indexPos})=>{
      return (
        <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG}}>
              <View style={{backgroundColor:'white',elevation:3,margin:15}}>
                      <View style={{backgroundColor:'#F5F5F5',flexDirection:'row'}}>
                            <Text style={{fontWeight:'bold',color:'#626161',marginTop:5,marginLeft:10,marginBottom:5}}>{stringsoflanguages.orderId} :</Text>
                            <Text style={{fontWeight:'bold',color:'#828282',marginTop:5,marginLeft:3,marginBottom:5}}>{orderData.order_id}</Text>
                      </View>
                      <View style={{backgroundColor:'white',flexDirection:'row'}}>
                            <Text style={styles.titleTextStyle}>{stringsoflanguages.purchaseDateTime} :</Text>
                            <Text style={styles.valueTextStyle}>{orderData.purchase_date}</Text>
                      </View>
                      <View style={{backgroundColor:'white',flexDirection:'row'}}>
                            <Text style={styles.titleTextStyle}>{stringsoflanguages.estDelivery} :</Text>
                            <Text style={styles.valueTextStyle}>{orderData.est_delivery_date}</Text>
                      </View>
                      <View style={{backgroundColor:'white',flexDirection:'row'}}>
                            <Text style={styles.titleTextStyle}>{stringsoflanguages.orderAmount} :</Text>
                            <NumberFormat value={orderData.order_amount} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                              <Text style={styles.valueTextStyle}>{`${value} XAF`}</Text>} />

                      </View>
                      <View style={{backgroundColor:'white',flexDirection:'row'}}>
                            <Text style={styles.titleTextStyle}>{stringsoflanguages.currentStatus}  :</Text>
                            <Text style={styles.valueTextStyle}>{orderData.order_status}</Text>
                      </View>
              </View>
              <this.tranckOrderView orderData={orderData} indexPos={indexPos}/>
          </View>
       );
    }

    tranckOrderView=({orderData,indexPos})=>{
      const {navigate} = this.props.navigation;
      return(
        <View>
              <TouchableOpacity onPress={this.toggleView.bind(this,indexPos)}>
                  <View style={{backgroundColor:'white',margin:15,flexDirection:'row',elevation:3}}>
                        <View style={{flexGrow:1, backgroundColor:'white',flexDirection:'row'}}>
                                  <Image source={require('../../images/icon/placeholder.png')}
                                         style={{width:20,height:20,margin:10}}/>
                                   <Text style={{fontSize:16,color:'#626161',margin:8}}>{stringsoflanguages.trackYourOrder} </Text>
                        </View>
                        <View style={{ backgroundColor:'white'}}>
                                  <Image source={(this.state.currentPos==indexPos)?require('../../images/icon/up_arrow.png'):require('../../images/profile/down_arrow.png')}
                                         style={{width:15,height:15,margin:10}}/>
                        </View>
                  </View>
            </TouchableOpacity>
            {(this.state.currentPos==indexPos)
              ?
                <View>
                      <View style={{flexGrow:0.5,backgroundColor:'white',elevation:3,margin:15,flexDirection:'column'}}>
                            <this.orderTrackingView orderTrackingData={this.state.dateTime[indexPos]}/>
                      </View>
                      <this.productDataView indexPosData={orderData.detail}/>
                      {(this.state.dateTime[indexPos]['Order Confirmed'].isChecked || this.state.dateTime[indexPos]['Packed'].isChecked || this.state.dateTime[indexPos]['Shipped'].isChecked || this.state.dateTime[indexPos]['Delivered'].isChecked)
                        ?
                        null
                        :
                            <View style={{backgroundColor:'white',margin:15,flexDirection:'row',elevation:3}}>
                                <View style={{flexGrow:1, backgroundColor:'white',flexDirection:'row',justifyContent:'space-between',paddingVertical: 10}}>
                                <TouchableOpacity onPress={this.callCancelOrder.bind(this,orderData.order_id)}>
                                      <View style={{flexDirection:'row',flex:1,alignItems: 'center'}}>
                                            <Image source={require('../../images/icon/cancel_button.png')}
                                                   style={{width:13,height:13,marginHorizontal:10}}/>
                                            <Text  style={{fontSize:16,color:'#626161',marginTop:0,marginRight:10}}>{stringsoflanguages.cancelOrder} </Text>
                                      </View>
                                </TouchableOpacity>
                                <View style={{width:1,height:30,backgroundColor:(this.state.dateTime[indexPos]['Modification'].isChecked)?'white':'gray',marginTop:4}}></View>
                                {
                                  (this.state.dateTime[indexPos]['Modification'].isChecked)

                                  ?null

                                  :<TouchableOpacity onPress={this.navigateToUpdateOrder.bind(this,navigate,indexPos,orderData.order_id,orderData.user_id)}>
                                    <View style={{flexDirection:'row',flex:1,alignItems: 'center'}}>
                                          <Image source={require('../../images/icon/update_order.png')}
                                                 style={{width:15,height:15,marginHorizontal: 10}}/>
                                          <Text  style={{textAlign:'center',fontSize:15,paddingRight:5,color:'#626161',marginTop:0}}>{stringsoflanguages.updateOrder}</Text>
                                    </View>
                                  </TouchableOpacity>
                                }
                                </View>
                            </View>
                       }
                </View>
              :null
            }
      </View>
      );
    }

    orderTrackingView=({orderTrackingData})=>{
          var orderTrackingContainer = [];

            orderTrackingContainer.push(
              <View style={{elevation: 10,width: undefined,flexDirection: 'column',marginLeft: 15}}>
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                              <View style={{width: 10,height: 10,backgroundColor:  (orderTrackingData['Order Placed'].isChecked)?'#2D7C0B':'#C1C1C1'}}/>
                                <View style={{width: 2,height: 35,backgroundColor: (orderTrackingData['Order Placed'].isChecked)?'#2D7C0B':'#C1C1C1',alignSelf: 'center'}}/>
                          </View>
                          <View style={{flexDirection: 'column',marginLeft: 15}}>
                                <Text style={{fontSize: 14,color: '#474646'}}>{orderTrackingData['Order Placed'].name}</Text>
                                <Text style={{fontSize: 12,color: '#444242'}}>{orderTrackingData['Order Placed'].date}</Text>
                          </View>
                    </View>
                    { (orderTrackingData['Modification'].date!=undefined) ?
                        <View style={{flexDirection: 'row'}}>
                              <View style={{flexDirection: 'column'}}>
                                  <View style={{width: 10,height: 10,backgroundColor:  (orderTrackingData['Modification'].isChecked)?'#2D7C0B':'#C1C1C1'}}/>
                                    <View style={{width: 2,height: 35,backgroundColor: (orderTrackingData['Modification'].isChecked)?'#2D7C0B':'#C1C1C1',alignSelf: 'center'}}/>
                              </View>
                              <View style={{flexDirection: 'column',marginLeft: 15}}>
                                    <Text style={{fontSize: 14,color: '#474646'}}>{orderTrackingData['Modification'].name}</Text>
                                    <Text style={{fontSize: 12,color: '#444242'}}>{orderTrackingData['Modification'].date}</Text>
                              </View>
                        </View>
                      :null
                    }
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                                <View style={{width: 10,height: 10,backgroundColor: (orderTrackingData['Order Confirmed'].isChecked)?'#2D7C0B':'#C1C1C1'}}/>
                                <View style={{width: 2,height: 35,backgroundColor: (orderTrackingData['Order Confirmed'].isChecked)?'#2D7C0B':'#C1C1C1',alignSelf: 'center'}}/>
                          </View>
                          <View style={{flexDirection: 'column',marginLeft: 15}}>
                                <Text style={{fontSize: 14,color: '#474646'}}>{orderTrackingData['Order Confirmed'].name}</Text>
                                <Text style={{fontSize: 12,color: '#444242'}}>{orderTrackingData['Order Confirmed'].date}</Text>
                          </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                                <View style={{width: 10,height: 10,backgroundColor: (orderTrackingData['Packed'].isChecked)?'#2D7C0B':'#C1C1C1'}}/>
                                <View style={{width: 2,height: 35,backgroundColor: (orderTrackingData['Packed'].isChecked)?'#2D7C0B':'#C1C1C1',alignSelf: 'center'}}/>
                          </View>
                          <View style={{flexDirection: 'column',marginLeft: 15}}>
                                <Text style={{fontSize: 14,color: '#474646'}}>{orderTrackingData['Packed'].name}</Text>
                                <Text style={{fontSize: 12,color: '#444242'}}>{orderTrackingData['Packed'].date}</Text>
                          </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                                <View style={{width: 10,height: 10,backgroundColor: (orderTrackingData['Shipped'].isChecked)?'#2D7C0B':'#C1C1C1'}}/>
                                <View style={{width: 2,height: 35,backgroundColor: (orderTrackingData['Shipped'].isChecked)?'#2D7C0B':'#C1C1C1',alignSelf: 'center'}}/>
                          </View>
                          <View style={{flexDirection: 'column',marginLeft: 15}}>
                                <Text style={{fontSize: 14,color: '#474646'}}>{orderTrackingData['Shipped'].name}</Text>
                                <Text style={{fontSize: 12,color: '#444242'}}>{orderTrackingData['Shipped'].date}</Text>
                          </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                                <View style={{width: 10,height: 10,backgroundColor: (orderTrackingData['Delivered'].isChecked)?'#2D7C0B':'#C1C1C1'}}/>
                          </View>
                          <View style={{flexDirection: 'column',marginLeft: 15}}>
                                <Text style={{fontSize: 14,color: '#474646'}}>{orderTrackingData['Delivered'].name}</Text>
                          </View>
                    </View>
              </View>
            )

          return (
            <View  style={{marginTop: 15,marginBottom: 15,backgroundColor: 'white'}}>
                {orderTrackingContainer}
            </View>
          );
    }

    productDataView=({indexPosData})=>{
        var orderHistoryContainer = [];
        for(let i = 0; i<indexPosData.length;i++){
          orderHistoryContainer.push(
            <View  key={i} style={{elevation: 10,width: undefined,flexDirection: 'column'}}>
                  <View style={{flexDirection: 'row'}}>
                        <Image source={{uri:indexPosData[i].order_image[0]}}
                                   style={{width: 50,height: 50,margin: 5}}
                                  resizeMode='cover'/>
                        <View  style={{flexDirection: 'column',flex:1}}>
                              <Text style={{marginLeft: 10,color:global.LIGHT_GRAY,fontSize: 14,marginTop: 10,paddingRight: 20,flexWrap: 'wrap'}}>{`${indexPosData[i].name} ${indexPosData[i].attribute[0].Poids==undefined?'':`- ${indexPosData[i].attribute[0].Poids} X ${indexPosData[i].attribute[0].quantity}`}`}</Text>
                              <NumberFormat value={indexPosData[i].attribute[0].sale_price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                 <Text style={{marginLeft: 10,marginBottom: 10,marginTop: 5,color:global.LIGHT_GREEN,fontSize: 14,fontWeight: 'bold'}}>{`${value} XAF`}</Text>} />
                        </View>
                  </View>
                  <View style={{backgroundColor: global.LIGHT_GRAY,height: 0.5}}/>
            </View>
          )
        }
        return (
          <View  style={{margin: 15,backgroundColor: 'white'}}>
              <View style={{width: undefined,height: undefined,marginLeft: 5,justifyContent: 'center',padding: 10,backgroundColor: 'white'}}>
                  <Text>{`${indexPosData.length} ${stringsoflanguages.items}`}</Text>
              </View>
              {orderHistoryContainer}
          </View>
        );
    }
    currentOrderRow=({productData})=>{
        return (
          <View  style={{marginTop:5,backgroundColor: 'white'}}>
                <View  style={{elevation: 10,width: undefined,flexDirection: 'column'}}>
                      <View style={{flexDirection: 'row'}}>
                            <Image source={(this.props.currentOrderData.getLanguageCode.languageCode=='en')?require('../../images/category/reorder.png'):require('../../images/category/reorder_fr.png')}
                                       style={{width: 50,height: 50,margin: 5}}
                                       resizeMode='cover'/>
                            <View  style={{flexDirection: 'column'}}>
                                  <Text style={{marginLeft: 10,color:global.LIGHT_GRAY,fontSize: 14,marginTop: 10}}>{productData.order_name}</Text>
                                  <NumberFormat value={productData.attribute[0].price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                        <Text style={{marginLeft: 10,marginBottom: 10,marginTop: 5,color:global.LIGHT_GREEN,fontSize: 14,fontWeight: 'bold'}}>{`${value} XAF`}</Text>} />
                            </View>
                      </View>
                      <View style={{backgroundColor: global.LIGHT_GRAY,height: 0.5}}/>
                </View>
          </View>
        );
    }
    toggleView=(currentPos)=>{
       //
       if(this.state.currentPos == currentPos){
         this.setState({
           currentPos:-1
         })
       }else{
         this.setState({
           currentPos:currentPos
         })
       }
     }

   navigateToUpdateOrder=(navigator,index,orderId,userId)=>{
     navigator('updateOrder',{
       productData:this.state.responseData[index],
       orderIndex:index,
       orderId:orderId,
       userId:userId,
       oldOrderData:this.state.responseData[index]
     })
   }
}

const stepindicatorStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:25,
  separatorStrokeWidth: 2,
  separatorStrokeHeight: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#000',
  labelSize: 15,
  currentStepLabelColor: '#fe7013'
 }

 const styles = StyleSheet.create({
  lineStyle:{
       borderWidth: 0.5,
       borderColor:'#D2D1D1',
    },
  titleTextStyle:{
      color:'#626161',
      marginTop:5,
      marginLeft:10,
      marginBottom:5,
      fontSize: 11
  },
  valueTextStyle:{
    color:'#828282',
    marginTop:5,
    marginLeft:3,
    marginBottom:5,
    fontSize: 11
  },
});

mapStateToProps=state=>{
  return{
     currentOrderData:state,
     latitude:state.getLatitudeLongitude.currentLatitude,
     longitude:state.getLatitudeLongitude.currentLongitude,
     cityName:state.getLatitudeLongitude.city
  }
}

export default connect (mapStateToProps,{setToken,setNotificationCounter,setLanguageCode})(CurrentOrderComponent);
