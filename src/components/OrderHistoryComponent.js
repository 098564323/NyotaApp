import React,{Component} from 'react';
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
  Switch,
  Dimensions,
  TouchableOpacity,
  FlatList,
  VirtualizedList,
  ActivityIndicator
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import {setToken} from '../redux/actions/SetTokenActions';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import DefaultPreference from 'react-native-default-preference';
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

//
class OrderHistoryComponent extends Component{
        //
        constructor(props) {
              super(props);
              //
              this.state = {
                clickPos: -1,
                responseData:[],
                isFetchData:false,
                isDataLoad:0
              };
              //
              stringsoflanguages.setLanguage((this.props.orderHistoryData.getLanguageCode.languageCode=='en')?'en':'fr');
              //
          }
          callAPIfun=()=>{
            //
            client.defaults.headers.common['Authorization'] = (this.props.orderHistoryData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.orderHistoryData.getCurrentToken.currentToken;
            //
            client.get('orderhistory')
            .then((response) => {
                  //
                  this.setState({
                    responseData:response.data.data,
                    isFetchData:true,
                    isDataLoad:1
                  })
                  //
                 }, (error) => {
                   this.setState({
                     isFetchData:true,
                     isDataLoad:2
                   })
            });
          }
          //Main Container
          render(){
              const {navigate} = this.props.navigation;
              return(
                <View style={{flexGrow:1}}>
                      <NavigationEvents
                        onWillFocus={payload => {filteredData=null}}
                        onDidFocus={this.callAPIfun}
                        onWillBlur={payload => console.log('test')}
                        onDidBlur={payload => console.log('')}
                       />
                      <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
                      <SafeAreaView style={{flexGrow:1}}>
                          <Header headerTitle={stringsoflanguages.orderHistory} headerNavigation={this.props.navigation} isNotification={true} isBack={true} notificationCount={this.props.orderHistoryData.getNotificationCounter.notificatinCounter}/>
                          <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,width: Dimensions.get('window').width}}>
                                {
                                  (this.state.isDataLoad==0)?<ActivityIndicator style={{width:60,height:60,marginRight: 30,alignSelf: 'center'}} size="large" color="#035B00"/>
                                  :(this.state.isDataLoad==1)?<this.orderHistoryView responseData={this.state.responseData} navigate={navigate}/>:<Text style={{alignSelf: 'center'}}>{stringsoflanguages.noDataFound}</Text>
                                }
                          </View>
                      </SafeAreaView>
                </View>
              );
          }
          //Top Container for Order History
          orderHistoryView=({responseData,navigate})=>{
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
              <View style={{flexDirection: 'column',margin:20,elevation: 10}}>
                      <View style={{flexDirection:'row'}}>
                              <View style={{flex:2,flexBasis: 0,alignItems: 'center'}}>
                                    <Text style={{color:global.LIGHT_GREEN}}>{stringsoflanguages.dateNTime}</Text>
                              </View>
                              <View style={{flex:1,flexBasis: 0,alignItems: 'center'}}>
                                    <Text style={{color:global.LIGHT_GREEN}}>{stringsoflanguages.price}</Text>
                              </View>
                              <View style={{flex:1.5,flexBasis: 0,alignItems: 'center'}}>
                                    <Text style={{color:global.LIGHT_GREEN}}>{stringsoflanguages.items}</Text>
                              </View>
                        </View>
                        {
                        (responseData==undefined)
                            ?null:
                            <VirtualizedList
                                  extraData={this.state.isClick}
                                  data={responseData}
                                  getItemCount={getItemCount}
                                  getItem={getItem}
                                  keyExtractor = { (item, index) => index.toString() }
                                  renderItem={({ item, index }) => {
                                    return (
                                      <this.orderHistoryRow indexPos={index} indexData={item} navigate={navigate}/>
                                    )
                                  }}
                            />
                      }
                </View>
            );
          }
          //Order History Row Data
          orderHistoryRow=({indexPos,indexData,navigate})=>{
            console.log('indexData.detail  ='+JSON.stringify(indexData.detail));
            return(
                  <View style={{flexDirection: 'column',elevation: 5}}>
                        <View style={{flexDirection:'row',backgroundColor: 'white',marginTop: 10,height:40}}>
                              <View style={{flex:2,flexBasis: 0,alignItems: 'center',justifyContent: 'center'}}>
                                    <Text style={{color:global.LIGHT_GRAY}}>{indexData.date}</Text>

                              </View>
                              <View style={{flex:1,flexBasis: 0,alignItems: 'center',justifyContent: 'center'}}>
                                    <View style={{backgroundColor:global.LIGHT_GRAY,width: 1,height: 30,position: 'absolute',alignSelf: 'flex-start'}}/>
                                    {
                                      (indexData.detail[0]==undefined)?
                                      <Text style={{color:global.LIGHT_GRAY}}>{`${0} XAF`}</Text>
                                      :
                                      <this.calculaterTotalAmt preOrderData={indexData.detail}/>
                                    }
                                    <View style={{backgroundColor:global.LIGHT_GRAY,width: 1,height: 30,position: 'absolute',alignSelf: 'flex-end'}}/>
                              </View>
                              <View style={{flex:1.5,flexBasis: 0,alignItems: 'center',flexDirection: 'row',justifyContent: 'space-between'}}>
                                    {
                                      (indexData.detail[0]==undefined)?
                                          <Text style={{color:global.LIGHT_GRAY,marginLeft: 20}}>{0} {stringsoflanguages.items}</Text>:
                                          <Text style={{color:global.LIGHT_GRAY,marginLeft: 20}}>{indexData.detail.length} {stringsoflanguages.items}</Text>
                                    }
                                    <TouchableOpacity style={{marginRight: 5,width: 30,height: 40,justifyContent: 'center',alignItems: 'center'}} onPress={() => {(this.state.clickPos==indexPos)?this.setState({ clickPos: -1}):this.setState({ clickPos: indexPos})}}>
                                          {
                                            (this.state.clickPos==indexPos)?
                                            <Image source={require('../../images/profile/up_arrow.png')}
                                                       style={{width: 12,height: 12}}/>
                                           :
                                            <Image source={require('../../images/profile/down_arrow.png')}
                                                       style={{width: 12,height: 12}}/>
                                         }
                                    </TouchableOpacity>
                              </View>
                       </View>
                       {
                         (this.state.clickPos === indexPos)?
                                <this.orderHistoryContainerView indexPosData={indexData.detail} productName={indexData.productname} orderStatus={indexData.order_status} navigate={navigate}/>
                               : null
                       }
                 </View>
            );
          }
          calculaterTotalAmt=({preOrderData})=>{
            var totalP = 0
            //
            for (let i=0; i < preOrderData.length; i++) {
                  totalP+=parseFloat(preOrderData[i].attribute[0].sale_price.split('XAF')[0])
            }
            return (
              <NumberFormat value={totalP} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                      <Text style={{color:global.LIGHT_GRAY}}>{`${value} XAF`}</Text>} />
            );
          }
          //Order History Container View
          orderHistoryContainerView=({indexPosData,productName,orderStatus,navigate})=>{
              var orderHistoryContainer = [];
              for(let i = 0; i < indexPosData.length; i++){
                orderHistoryContainer.push(
                      <View key={i} style={{elevation: 10,width: undefined,flexDirection: 'column',height: undefined}}>
                      <NumberFormat value={indexPosData[i].attribute[0].price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                          <Text style={{marginLeft: 10,color:global.LIGHT_GRAY,fontSize: 14,marginTop: 10}}>{`${indexPosData[i].name}- ${indexPosData[i].attribute[0].quantity} X ${value} XAF`}</Text>}/>

                            <NumberFormat value={indexPosData[i].attribute[0].sale_price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                <View style={{flexDirection: 'row',alignItems: 'center',marginTop: 2}}>
                                      <Text style={{marginLeft: 10,alignSelf: 'center',marginBottom: 0,color:global.LIGHT_GREEN,fontSize: 14,fontWeight: 'bold'}}>{`${value} XAF`}</Text>
                                      <View style={{flexDirection: 'row',paddingHorizontal: 10,justifyContent:'flex-end',flex: 1}}>
                                            {(indexPosData[i].is_review==="1")?null:<TouchableOpacity onPress={()=>{navigate('RatingComponent',{
                                                orderData:indexPosData[i], orderStatus:orderStatus
                                                })}}
                                                style={{height: 50,height: 50,alignSelf: 'center'}}>
                                                <View style={{flex:1,flexDirection:'row',marginHorizontal:12,alignItems: 'center'}}>
                                                           <Image
                                                                  source={require('../../images/cart/star_brown.png')}
                                                                  style={{resizeMode:'contain',height:15,alignSelf:'flex-start',alignSelf: 'center',width:15}}>
                                                            </Image>
                                                           <Text style={{fontSize:13,color:'#cd853f',marginHorizontal:4}}>{stringsoflanguages.rateItText}</Text>
                                                 </View>
                                            </TouchableOpacity>}

                                            <TouchableOpacity onPress={this.callAddToCartAPI.bind(this,indexPosData[i])}
                                                      style={{width: 50,height: 50}}>
                                                    <Image source={(this.props.orderHistoryData.getLanguageCode.languageCode=='en')?require('../../images/category/reorder.png'):require('../../images/category/reorder_fr.png')}
                                                               style={{width: 50,height: 50}}
                                                               resizeMode='contain'/>
                                            </TouchableOpacity>
                                      </View>
                                </View>} />
                            {((indexPosData.length-1)!==i)?
                            <View style={{backgroundColor: global.LIGHT_GRAY,height: 0.5}}/>:null}

                      </View>
                )
              }
              return (
                <View  style={{marginTop:5,backgroundColor: 'white'}}>
                    {orderHistoryContainer}
                </View>
              );
          }

          callAddToCartAPI=(categoryData)=>{
            //
            client.defaults.headers.common['Authorization'] = (this.props.orderHistoryData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.orderHistoryData.getCurrentToken.currentToken;
            //
            let requestData={
              "product_id":categoryData.product_id,
              "attribute":[categoryData.attribute[0]],
              "cart_id":0
            };
            client.post('addcart',requestData)
            .then((response) => {
                  alert(response.data.message)
                  console.log('Add to Cart Response '+JSON.stringify(response.data.data));
                 }, (error) => {
                  console.log('Add to Cart Response Error  '+JSON.stringify(error.response.data));
            });
          }
}

mapStateToProps=state=>{
  return{
     orderHistoryData:state
  }
}
export default connect(mapStateToProps,{setToken,setNotificationCounter,setLanguageCode})(OrderHistoryComponent);
