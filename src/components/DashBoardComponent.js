import React,{Component} from 'react';

import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  BackHandler
} from 'react-native';

import Footer from '../utils/Footer';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import DashboardRow from '../componentRow/DashboardRow';
import FastImage from 'react-native-fast-image';
//
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {connect} from 'react-redux';
import {setToken} from '../redux/actions/SetTokenActions';
import {setCartCounter} from '../redux/actions/cartCounterAction';
import {VIEWPROFILE} from '../utils/ApiMethods';
import {reset,getRequest} from '../redux/actions/ApiCallerAction';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
import Carousel from 'react-native-banner-carousel';
//
import DefaultPreference from 'react-native-default-preference';
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
import {BASE_URL} from '../utils/ApiMethods';
//
var isWishStatus = 0
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
var dash_token = ''
const { width } = Dimensions.get('window');
//
class DashBoardComponent extends Component{
  scrollX = new Animated.Value(0)
  constructor(props) {
        super(props);
        
        //
        stringsoflanguages.setLanguage((this.props.data.getLanguageCode.languageCode=='en')?'en':'fr');
        //
        this.props.getRequest(VIEWPROFILE);
        //
        DefaultPreference.get('userToken').then(function(value) {
          dash_token = value
          return value;
        });

        //
        this.callDashboardAPI()
        //
        this.callOfferAPI()
        //
        this.state = {
          categoryData:'',
          offerListData:'',
          productId:'',
        };

        console.log(JSON.stringify(this.props.data));


    }

    performTimeConsumingTask = async() => {
      return new Promise((resolve) =>
        setTimeout(
          () => { resolve('result') },
          500
        )
      );
    }
     async callOfferAPI(){
       //
       const data = await this.performTimeConsumingTask();
       //
       if(data != null){
       client.defaults.headers.common['Authorization'] = (dash_token=='-1')?'':'Bearer '+dash_token;

       let requestData={
         "latitude":this.props.latitude,
         "longitude":this.props.longitude,
         "city":this.props.cityName
       };

       client.post('offerlist',requestData)
       .then((response) => {
              //
             this.setState({
               offerListData:response.data.data,
               productID:response.data.data[0].product_id
             })
            }, (error) => {
              return error;
              this.setState({
                offerListData:'',
                productID:''
              })
       });
     }
    }

  callDashboardAPI=()=>{
      //
      //
     client.defaults.headers.common['Authorization'] = (this.props.data.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.data.getCurrentToken.currentToken;
       client.get('categorylist')
      .then((response) => {
            //
            var jsonData = response.data.data
            //
            if((response.data.data.length%3)!==0){
              var tempCounter = 3-(response.data.data.length%3)
              //
              for(var i=0;i<tempCounter;i++){
                  jsonData.push({})
              }
              this.setState({
                categoryData:jsonData
              })
            }else{
              this.setState({
                categoryData:response.data.data
              })
            }

           }, (error) => {
             return error;
             this.setState({
               categoryData:error.response.data.message
             })
      });
     //}
   }
    render() {
      const {navigate} = this.props.navigation;
      let position = Animated.divide(this.scrollX, width);
      return (
        <View style={{flexGrow:1}}>
              <NavigationEvents
                onWillFocus={payload => console.log('CatCom will blur', payload)}
                onDidFocus={this.callDashboardAPI}
                onWillBlur={payload => console.log('CatCom will blur', payload)}
                onDidBlur={payload => {this.props.reset()}}
               />
              <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
              <SafeAreaView style={{flexGrow:1}}>
                  <Header headerTitle="Dashboard" headerNavigation={this.props.navigation} isSearch={false} isNotification={true} isBack={false} notificationCount={this.props.data.getNotificationCounter.notificatinCounter} typeHere={stringsoflanguages.typeHere}/>
                  <View style={{flexGrow:1,flexBasis: 0,backgroundColor: global.APP_BG,justifyContent: 'center'}}>
                                    <View style={{flexGrow:2,flexBasis: 0}}>
                                        {(typeof(this.state.categoryData) !== 'string')?
                                        <FlatList
                                            horizontal={false}
                                            scrollEnabled={true}
                                            showsVerticalScrollIndicator={false}
                                            bounces={false}
                                            style={{margin: 20,
                                                    width: Dimensions.get('window').width-40,
                                                    height: Dimensions.get('window').height,
                                                    backgroundColor: '#BCBBBB',flexWrap: 'wrap'}}
                                            data={ this.state.categoryData }
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={ ({item}) =>
                                                <DashboardRow itemData={item} dashboardNavigate={navigate}/>
                                            }
                                            numColumns={3}/>
                                            :null
                                            }
                                    </View>
                                    {
                                      (typeof(this.state.offerListData) !== 'string')?

                                        <View style={{flexGrow: 1,flexBasis: 0}}>
                                        <Carousel
                                                  autoplay
                                                  autoplayTimeout={2500}
                                                  showsPageIndicator={true}
                                                  pageIndicatorContainerStyle={[styles.TrapezoidStyle,{alignSelf: 'flex-start',marginBottom: -10}]}
                                                  pageIndicatorStyle={{height: 10, width: 10, backgroundColor:'green',opacity: 0.3,margin: 10,marginBottom: -20,  borderRadius: 5}}
                                                  activePageIndicatorStyle={{height: 10, width: 10, backgroundColor:'green',margin: 10,marginBottom: -20,  borderRadius: 5}}
                                                  loop
                                                  index={0}
                                                  pageIndicatorOffset={20}
                                                  pageSize={Dimensions.get('window').width}>
                                                  {this.state.offerListData.map((image, index) => {
                                                      return (
                                                        <View key={index}>
                                                          <TouchableOpacity onPress={()=>{navigate('SingleProductListing',{product_id:image.product_id})}}>
                                                                <Image key={index}
                                                                           style={{width: Dimensions.get('window').width,height: 150,resizeMode:'contain'}}
                                                                           source={{uri:image.offer_image}}/>
                                                           </TouchableOpacity>
                                                      </View>
                                                      );
                                                  })}
                                              </Carousel>
                                        </View>
                                        :null
                                    }
                  </View>
                  <Footer footerNavigate={navigate} screenPos={1} footerCartCounter={Number(this.props.data.getCartCounter.cartCounter)}/>
              </SafeAreaView>
        </View>
      );
    }
    //
    goIndex = () => {
        this.refs.flatListRef.scrollToEnd({animated: false});
    };
  }
//
const styles = StyleSheet.create({
  TrapezoidStyle: {
    borderBottomColor: global.LIGHT_YELLOW,
    borderBottomWidth: 30,
    borderLeftWidth: 0,
    borderRightWidth: 30,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  }
});

mapStateToProps=state=>{
  return{
     data:state,
     latitude:state.getLatitudeLongitude.currentLatitude,
     longitude:state.getLatitudeLongitude.currentLongitude,
     cityName:state.getLatitudeLongitude.city
  }
}

export default connect(mapStateToProps,{getRequest,reset,setToken,setCartCounter,setNotificationCounter,setLanguageCode})(DashBoardComponent);
