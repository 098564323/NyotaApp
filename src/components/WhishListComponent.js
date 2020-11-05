import React,{Component} from 'react';

import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator
} from 'react-native';

import Footer from '../utils/Footer';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import CategoryRow from '../componentRow/CategoryRow';
//
import {getRequest,reset} from '../redux/actions/ApiCallerAction';
import {setToken} from '../redux/actions/SetTokenActions';

import {setCartCounter} from '../redux/actions/cartCounterAction';
import {connect} from 'react-redux';
import {GET_WISHLIST_DATA} from '../utils/ApiMethods';
import { NavigationEvents } from 'react-navigation';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
var isAvailable=false
var isError=false
var isDeleteData=false
var isUpdate = true
var filteredData;
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
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
class WhishListComponent extends Component{

  callAPIfun=()=>{
    //
    isDeleteData = false;
    isAvailable = true;
    //
    this.setState({
      isFetchning:true
    })

    client.defaults.headers.common['Authorization'] = (this.props.wishListData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.wishListData.getCurrentToken.currentToken;
    //
     let requestData={
        "latitude":this.props.latitude,
        "longitude":this.props.longitude,
        "city":this.props.cityName

     };
    console.log('WishList request Data--> '+JSON.stringify(requestData))
     //
     client.post('getwishlist',requestData)
        .then((response) => {
          this.setState({
            wishListResponseData:response.data.data,
            isFetchning:false
          })
       console.log('Wishlist Success Response  ---> '+JSON.stringify(response))
      }, (error) => {
        isError = true
        this.setState({
          isFetchning:false
        })
        console.log('Wishlist Failed Response'+JSON.stringify(error))
      });
  }

    constructor(props) {
        super(props);
        isAvailable = false;
        isError =false;
        this.state = {
          wData:[],
          wishListResponseData:'',
          isFetchning:false
        }
        stringsoflanguages.setLanguage((this.props.wishListData.getLanguageCode.languageCode=='en')?'en':'fr');
    }
    deleteItem = productID => {
      //
      isDeleteData = true;
      if(filteredData == undefined){
        filteredData = this.state.wishListResponseData.filter(item => item.product_id !== productID);
      }else{
        filteredData = filteredData.filter(item => item.product_id !== productID);
      }
      this.setState({wData: filteredData})
    }
    render() {
      const {navigate} = this.props.navigation;
      //
      // if(this.state.isFetchning===false
      //   && this.state.wishListResponseData!==undefined
      //   && isAvailable==true && isUpdate){
      //       this.setState({
      //         wData:this.state.wishListResponseData
      //       })
      //       isUpdate = false
      // }else{
      //   if(this.state.wishListResponseData!== undefined){
      //       isError = true
      //   }else if(this.state.wishListResponseData !== undefined){
      //       isError = true
      //   }
      // }
      return (
        <View style={{flexGrow:1}}>
              <NavigationEvents
                onWillFocus={payload => {isUpdate=true,this.props.reset()}}
                onDidFocus={this.callAPIfun}
                onWillBlur={payload => console.log('test')}
                onDidBlur={payload => {isAvailable = false}}
               />
              <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
              <SafeAreaView style={{flexGrow:1}}>
                  <Header headerTitle={stringsoflanguages.wishList} headerNavigation={this.props.navigation} isSearch={true} isNotification={true} isBack={true} notificationCount={this.props.wishListData.getNotificationCounter.notificatinCounter}/>
                  <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,justifyContent: 'center',alignItems: 'center'}}>
                  {(this.state.isFetchning===false
                    && this.state.wishListResponseData!==undefined && isAvailable)?
                      <FlatList
                          data={ this.state.wishListResponseData }
                          style={{backgroundColor: global.APP_BG, width: Dimensions.get('window').width}}
                          keyExtractor={(item, index) => item.product_id}
                          renderItem={ ({item,index}) =>
                              <CategoryRow categoryData={item} categoryNavigate={navigate} indexPos={index} deleteItem={() => this.deleteItem(item.product_id)} isFromWishList={true} userToken={this.props.wishListData.getCurrentToken.currentToken} cartUpdateCounter={this.props.setCartCounter} totalCartCounter={this.props.wishListData.getCartCounter.cartCounter} categoryID={item.category_id} languageCode={(this.props.wishListData.getLanguageCode.languageCode=='en')?'en':'fr'}/>
                      }/>:
                      (isError==true)?<Text>{stringsoflanguages.noDataFound}</Text>:
                      <ActivityIndicator style={{alignSelf: 'center'}} size="large"/>
                    }
                  </View>
                  <Footer footerNavigate={navigate} screenPos={2} footerCartCounter={this.props.wishListData.getCartCounter.cartCounter}/>
              </SafeAreaView>
        </View>
      );
    }
}

mapStateToProps=(state,propsData)=>{
  return{
     wishListData:state,
     screenName:propsData.navigation.state.routeName,
     latitude:state.getLatitudeLongitude.currentLatitude,
     longitude:state.getLatitudeLongitude.currentLongitude,
     cityName:state.getLatitudeLongitude.city,
  }
}

export default connect(mapStateToProps,{getRequest,reset,setToken,setCartCounter,setNotificationCounter,setLanguageCode})(WhishListComponent);
