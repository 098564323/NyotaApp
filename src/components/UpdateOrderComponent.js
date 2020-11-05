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
  import DefaultPreference from 'react-native-default-preference';
  import FastImage from 'react-native-fast-image';
  //
  import NumberFormat from 'react-number-format';
  import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
  //
  import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
  import stringsoflanguages from '../../stringsoflanguages';
  //
  import UpdateOrderRow from '../componentRow/UpdateOrderRow';
  //
  import {BASE_URL} from '../utils/ApiMethods';
  //
  import { CheckBox } from 'react-native-elements'
  //
  const client = axios.create({
    baseURL: BASE_URL,
    responseType: 'json'
  });
  //
  axiosMiddleware(client);
  //
  var oldOrderData;
  //
  class UpdateOrderComponent extends Component{

    constructor(props) {
      super(props);
      //
      this.state = {
            orderId:this.props.navigation.state.params.orderId,
            orderData:JSON.parse(JSON.stringify(this.props.navigation.state.params.productData)),
            popupshow:false,
            isPopFirstOption:true,
            userId:this.props.navigation.state.params.userId,
            isFetching:true,
          };
       //
       stringsoflanguages.setLanguage((this.props.updateOrderData.getLanguageCode.languageCode=='en')?'en':'fr');
       //
       oldOrderData = this.props.navigation.state.params.oldOrderData;
       this.deepFreeze(oldOrderData);
       //
    }
     deepFreeze=(object)=>{
      //
      var propNames = Object.getOwnPropertyNames(object);
      //
      for (let name of propNames) {
        let value = object[name];

        if(value && typeof value === "object") {
          this.deepFreeze(value);
        }
      }
      //
      return Object.freeze(object);
    }
    //
    callUpdateOrderAPI=(orderData,orderId,userId,navigate)=>{
        //
        console.log('111111Update Older Data --->'+JSON.stringify(this.state.orderData.detail))
        console.log('Update New Data   --->'+JSON.stringify(orderData));
        //
        // DefaultPreference.set('orderId',this.state.orderId).then(function() {});
        // DefaultPreference.set('addressId',this.state.orderData.address_id).then(function() {});
        //
        var tempTotalAmount = 0;
        for(var i=0;i<this.state.orderData.detail.length;i++){
            for(var j=0;j<this.state.orderData.detail[i].attribute.length;j++){
                console.log('111111Total == '+(Number(this.state.orderData.detail[i].attribute[j].price.split('XAF')[0])*Number(this.state.orderData.detail[i].attribute[j].quantity)));
                tempTotalAmount+=(Number(this.state.orderData.detail[i].attribute[j].price.split('XAF')[0])*Number(this.state.orderData.detail[i].attribute[j].quantity))
            }
        }
        //
        client.defaults.headers.common['Authorization'] = (this.props.updateOrderData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.updateOrderData.getCurrentToken.currentToken;
        //
        this.setState({
          isFetching:false
        })
        //
         let requestData={
           "order_id":orderId,
           "total":tempTotalAmount,//orderData.order_amount.split('XAF')[0],
           "user_id":userId,
           "detail": oldOrderData.detail,
           "data":this.state.orderData.detail
         };
         //
         console.log('Update Order requestData---> '+JSON.stringify(requestData));
         //
         client.post('modifyorder',requestData).then((response) => {
           //
           if(response.data.status==200){
                 this.setState({
                   isFetching:true
                })
                 //
                 navigate('CurrentOrder')
            }
          }, (error) => {
            //
              this.setState({
                isFetching:true
              })
            alert(error)
            // navigate('CurrentOrder')
             console.log('Modify Order Response Error '+JSON.stringify(error.message));
          });
      }
      //
        render(){
              const {navigate} = this.props.navigation
              // console.log('Update Order Data First time --->'+JSON.stringify(oldOrderDataConst));

            return (
              <View style={{flex:1}}>

                    <NavigationEvents
                      onWillFocus={payload => console.log('test')}
                      onDidFocus={payload => console.log('test')}
                      onWillBlur={payload => console.log('test')}
                      onDidBlur={payload => console.log('test')}/>

                      <SafeAreaView style={{backgroundColor:global.LIGHT_YELLOW}}/>
                      <SafeAreaView style={{flex:1}}>
                      <Header headerTitle={stringsoflanguages.updateOrderHeader} headerNavigation={this.props.navigation} isSearch={false} isNotification={false} isBack={true} notificationCount={0}/>
                      <View style={{flex:1, backgroundColor:(this.state.popupshow==true)?'rgba(52, 52, 52, 0.55)':global.APP_BG,width: Dimensions.get('window').width,alignSelf:'center',justifyContent:'center'}}
                      pointerEvents={(this.state.popupshow==true) ? 'none' : 'auto'}>
                          <FlatList
                              data={this.state.orderData.detail}
                              style={{marginTop:20}}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({item,index})  =>

                              <UpdateOrderRow orderData={item}
                                              index={index}
                                              orderId={this.state.orderId}
                                              orderCount={this.state.orderData.detail.length}
                                              navigate={navigate}/>}/>
                              {
                                (this.state.isFetching==false)?
                                 <ActivityIndicator style={{position:'absolute',width:60,height:60,marginRight: 30,alignSelf: 'center',marginBottom:Dimensions.get('window').height/5}} size="large" color="#035B00"/>
                                 :null
                              }

                          <View style={{height:Dimensions.get('window').height/4,padding:20,justifyContent:'center'}}>

                                <TouchableOpacity onPress={this.popupToggleView}>
                                    <View style={{backgroundColor:'#216001',borderRadius:20,}}>
                                      <Text style={{textAlign:'center',margin:10,fontSize:18,color:'white'}}>{stringsoflanguages.addMoreProduct}</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.callUpdateOrderAPI.bind(
                                                                                  this,this.state.orderData,
                                                                                  this.state.orderId,
                                                                                  this.state.userId,
                                                                                  navigate
                                                                                )}>
                                    <View style={{backgroundColor:'#216001',borderRadius:20,marginTop:15}}>
                                      <Text style={{textAlign:'center',margin:10,fontSize:18,color:'white'}}>{stringsoflanguages.updateOrder}</Text>
                                    </View>
                                </TouchableOpacity>
                          </View>
                </View>
                {
                  (this.state.popupshow==true)?<this.displayPopUp/>:null
                }
            </SafeAreaView>
          </View>
          );
      }

      displayPopUp=()=>{
        const {navigate} = this.props.navigation;
        return(
                <View style={{position:'absolute',marginTop:Dimensions.get('window').height/3.5,backgroundColor:'white',margin:8,padding:15,borderRadius:10,width:Dimensions.get('window').width-20}}
                pointerEvents={(this.state.popupshow==true) ? 'auto' : 'none'}>
                    <Text style={{fontWeight:'bold',textAlign:'center',fontSize:18,color:'#626161'}}>{stringsoflanguages.addnewProduct}</Text>
                          <CheckBox
                              onPress={() => {this.setState({isPopFirstOption:true})}}
                              checkedIcon={<Image source={require('../../images/category/radio_selected.png')} />}
                              uncheckedIcon={<Image source={require('../../images/category/radio_unselected.png')} />}
                              containerStyle={{borderWidth:0,backgroundColor: "transparent"}}
                              title={stringsoflanguages.addingProductPopOption}
                              checked={this.state.isPopFirstOption}/>
                          <CheckBox
                              onPress={() => {this.setState({isPopFirstOption:false})}}
                              checkedIcon={<Image source={require('../../images/category/radio_selected.png')} />}
                              uncheckedIcon={<Image source={require('../../images/category/radio_unselected.png')} />}
                              containerStyle={{borderWidth: 0,backgroundColor: "transparent"}}
                              title={stringsoflanguages.addingExistingPopOption}
                              checked={!this.state.isPopFirstOption}/>

                  <Text style={{fontSize:16,color:'#626161',marginTop:8}}>{stringsoflanguages.popupNote}</Text>

                <View style={{justifyContent:'space-between',flexDirection:'row',padding:15,marginTop:5}}>
                      <TouchableOpacity onPress={this.popupSubmitButton.bind(this,navigate,(this.state.isPopFirstOption==true)?this.props.navigation.state.params.productData.order_id:0,this.props.navigation.state.params.productData.user_id)}>
                          <View style={{backgroundColor:'#216001',borderRadius:10}}>
                            <Text style={{textAlign:'center',margin:10,fontSize:16,color:'white'}}>{stringsoflanguages.submit}</Text>
                          </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={this.popupToggleView}>
                          <View style={{backgroundColor:'#216001',borderRadius:10}}>
                            <Text style={{textAlign:'center',margin:10,fontSize:16,color:'white'}}>{stringsoflanguages.cancel}</Text>
                          </View>
                      </TouchableOpacity>
              </View>
        </View>
        );
      }
      popupToggleView=()=>{
         if(this.state.popupshow==false){
           this.setState({
             popupshow:true
           })
         }
         else{
           this.setState({
             popupshow:false
           })
         }
       }

       popupSubmitButton=(navigate,orderId,userId)=>{

         if(this.state.isPopFirstOption==true){
                 DefaultPreference.set('orderId',this.state.orderId).then(function() {});
                 DefaultPreference.set('addressId',this.state.orderData.address_id).then(function() {});
          }
           navigate('dashRowCC',{
             orderId:orderId,
             isFromUpdateOrder:'true',
             userId:userId
           })
       }
   }
   const styles = StyleSheet.create({
  });

  mapStateToProps=state=>{
    return{
       updateOrderData:state
    }
  }

  export default connect (mapStateToProps,{setToken,setNotificationCounter,setLanguageCode})(UpdateOrderComponent);
