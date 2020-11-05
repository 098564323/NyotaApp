import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  View,
  Text,
  Image,
  StatusBar,
  FlatList,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';

import ProfileRow from '../componentRow/ProfileRow';
import Footer from '../utils/Footer';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import FastImage from 'react-native-fast-image';
//
import {connect} from 'react-redux';
import {VIEWPROFILE} from '../utils/ApiMethods';
import {reset,getRequest} from '../redux/actions/ApiCallerAction';
import {setToken} from '../redux/actions/SetTokenActions';
import {setCartCounter} from '../redux/actions/cartCounterAction';
//
import DefaultPreference from 'react-native-default-preference';
//
import {storeCurrentPreference} from '../utils/Utils';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import { NavigationEvents } from 'react-navigation';
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
//
var isAvailable=false
var socialTypeCode='0'
import stringsoflanguages from '../../stringsoflanguages';
//
class ProfileComponent extends Component{
  constructor(props) {
        super(props);
        this.props.reset()
        //
        DefaultPreference.get('SocialTypeCode').then(function(value) {
          if(value!==null){
            socialTypeCode = value
          }
          return value;
        });
        //
        storeCurrentPreference('ProfileComponent')
        //
        // let path = "file:///storage/emulated/0/Pictures/1571150607652.jpg"
        // let new_path = path.substring(path.indexOf('s'))
        //
        stringsoflanguages.setLanguage((this.props.data.getLanguageCode.languageCode=='en')?'en':'fr');
        this.state = {
          FlatListItems: (this.props.data.getCurrentToken.currentToken=='-1')?
          [
            { id: '1',image:require('../../images/profile/chat.png'), title: stringsoflanguages.chat ,screenName:'chatcc'},
            { id: '2',image:require('../../images/profile/privacy.png'), title: stringsoflanguages.privacyPolicy,screenName:'PrivactAboutUs'},
            { id: '3',image:require('../../images/profile/share.png'), title: stringsoflanguages.shareApp,screenName:'ShareApp' },
            { id: '4',image:require('../../images/profile/logout.png'), title: 'Login',screenName:'Login' }
          ]
          :
          [
            { id: '1',image:require('../../images/profile/address.png'), title: stringsoflanguages.address,screenName:'Address' },
            { id: '2',image:require('../../images/profile/order_history.png'), title: stringsoflanguages.orderHistory ,screenName:'OrderHistory'},
            { id: '3',image:require('../../images/profile/current_orders.png'), title: stringsoflanguages.currentOrder,screenName:'CurrentOrder'},
            { id: '4',image:require('../../images/profile/wishlist.png'), title: stringsoflanguages.wishList ,screenName:'WishList'},
            { id: '5',image:require('../../images/profile/payment.png'), title: stringsoflanguages.payment,screenName:'paymentMode' },
            { id: '6',image:require('../../images/profile/notification.png'), title: stringsoflanguages.notification,screenName:'Notification' },
            { id: '7',image:require('../../images/profile/settings.png'), title: stringsoflanguages.setting,screenName:'Settings' },
            { id: '8',image:require('../../images/profile/chat.png'), title: stringsoflanguages.chat ,screenName:'chatcc'},
            { id: '9',image:require('../../images/profile/privacy.png'), title: stringsoflanguages.privacyPolicy,screenName:'PrivactAboutUs'},
            { id: '10',image:require('../../images/profile/share.png'), title: stringsoflanguages.shareApp,screenName:'ShareApp' },
            { id: '11',image:require('../../images/profile/chang_language.png'), title: stringsoflanguages.changeLanguage,screenName:'languageCC' },
            { id: '11',image:require('../../images/profile/logout.png'), title: stringsoflanguages.logOut,screenName:'Login' }
          ],
          isCamClick:false
        };
  }
  callAPIfun=()=>{
    //
    stringsoflanguages.setLanguage((this.props.data.getLanguageCode.languageCode=='en')?'en':'fr');
    //
    this.setState({
      FlatListItems: [
        { id: '1',image:require('../../images/profile/address.png'), title: stringsoflanguages.address,screenName:'Address' },
        { id: '2',image:require('../../images/profile/order_history.png'), title: stringsoflanguages.orderHistory ,screenName:'OrderHistory'},
        { id: '3',image:require('../../images/profile/current_orders.png'), title: stringsoflanguages.currentOrder,screenName:'CurrentOrder'},
        { id: '4',image:require('../../images/profile/wishlist.png'), title: stringsoflanguages.wishList ,screenName:'WishList'},
        { id: '5',image:require('../../images/profile/payment.png'), title: stringsoflanguages.payment,screenName:'paymentMode' },
        { id: '6',image:require('../../images/profile/notification.png'), title: stringsoflanguages.notification,screenName:'Notification' },
        { id: '7',image:require('../../images/profile/settings.png'), title: stringsoflanguages.setting,screenName:'Settings' },
        { id: '8',image:require('../../images/profile/chat.png'), title: stringsoflanguages.chat ,screenName:'chatcc'},
        { id: '9',image:require('../../images/profile/privacy.png'), title: stringsoflanguages.privacyPolicy,screenName:'PrivactAboutUs'},
        { id: '10',image:require('../../images/profile/share.png'), title: stringsoflanguages.shareApp,screenName:'ShareApp' },
        { id: '11',image:require('../../images/profile/chang_language.png'), title: stringsoflanguages.changeLanguage,screenName:'languageCC' },
        { id: '11',image:require('../../images/profile/logout.png'), title: stringsoflanguages.logOut,screenName:'Login' }
      ]
    })
    //
    isAvailable = true;
    //
    this.props.getRequest(VIEWPROFILE);
    //
  }
  render(){
      const {navigate} = this.props.navigation;
      if(!this.state.isCamClick){
          return(
                  <View style={{flexGrow:1}}>
                        <NavigationEvents
                          onWillFocus={payload => console.log('CatCom will focus', payload)}
                          onDidFocus={(this.props.data.getCurrentToken.currentToken=='-1')?'':this.callAPIfun}
                          onWillBlur={payload => {this.props.reset()}}
                          onDidBlur={payload => {isAvailable = false}}/>
                        <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
                        <SafeAreaView style={{flexGrow:1,flexBasis: 0,flexDirection: 'column'}}>
                            <Header headerTitle={stringsoflanguages.profile} headerNavigation={this.props.navigation} isNotification={true} isBack={true} notificationCount={this.props.data.getNotificationCounter.notificatinCounter}/>
                                  <View style={{elevation: 10,flexGrow:1,flexBasis: 0,flexDirection: 'column',backgroundColor:'#F5F5F5'}}>
                                            {(this.props.data.getCurrentToken.currentToken=='-1')?
                                              <View style={styles.Rectangle}>
                                                    <View style={{flexGrow: 1,flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
                                                          <Image  source={require('../../images/profile/default_user_01.png')}
                                                                      resizeMode='cover'
                                                                      style={{width: Dimensions.get('window').width/3,
                                                                              height: Dimensions.get('window').width/3,
                                                                              borderRadius: Dimensions.get('window').width/6}}/>
                                                          <Text style={{color:'#38a935',marginTop:20,fontSize:22}}>Guest User</Text>
                                                    </View>
                                              </View>
                                            :
                                            <View style={styles.Rectangle}>
                                                        {(this.props.data.apiData.isFetchning===false && (this.props.data.apiData.data.data!==undefined) && isAvailable)?
                                                        <View style={{flexGrow: 1,flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
                                                              <TouchableOpacity>
                                                              {(this.props.data.apiData.data.data[0].image !== undefined && this.props.data.apiData.data.data[0].image.length==0)?
                                                                <Image  source={require('../../images/profile/default_user_01.png')}
                                                                                        resizeMode='cover'
                                                                                        style={{width: Dimensions.get('window').width/3,
                                                                                            height: Dimensions.get('window').width/3,
                                                                                            borderRadius: Dimensions.get('window').width/6}}/>
                                                                :<Image  source={{uri:this.props.data.apiData.data.data[0].image}}
                                                                                        resizeMode='cover'
                                                                                        style={{width: Dimensions.get('window').width/3,
                                                                                            height: Dimensions.get('window').width/3,
                                                                                            borderRadius: Dimensions.get('window').width/6}}/>}
                                                              </TouchableOpacity>
                                                                        <Text style={{color:'#38a935',marginTop:20,fontSize:22}}>{this.props.data.apiData.data.data[0].name}</Text>
                                                                        <Text style={{fontSize:17,color:'#626161'}}>{this.props.data.apiData.data.data[0].phone_no}</Text>
                                                        </View>:
                                                        <ActivityIndicator style={{alignSelf: 'center'}} size="large" />
                                                      }
                                                      {(this.props.data.apiData.isFetchning===false && (this.props.data.apiData.data.data!==undefined) && isAvailable)?
                                                        <View style={{
                                                                      width: Dimensions.get('window').width,
                                                                      height: 20,
                                                                      marginTop: 20,
                                                                      marginLeft: Dimensions.get('window').width-50,
                                                                      position: 'absolute',
                                                                      flexDirection: 'row'}}>
                                                              <TouchableOpacity onPress={this.onClickProfile.bind(this)}>
                                                                        <Image source={require('../../images/profile/edit.png')}
                                                                               style={{width:20,height: 20}}/>
                                                              </TouchableOpacity>
                                                        </View>:null
                                                      }
                                            </View>
                                          }
                                        <FlatList data={this.state.FlatListItems}
                                                  renderItem={({item}) =>
                                                  <ProfileRow itemData={item}
                                                              profileNavigate={navigate}
                                                              propsNavigation={this.props.navigation}
                                                              socialTypeCode={socialTypeCode}
                                                  />}/>
                                    </View>
                            <Footer footerNavigate={navigate} screenPos={4} footerCartCounter={Number(this.props.data.getCartCounter.cartCounter)}/>
                        </SafeAreaView>
                  </View>
          );
        }else{
          return (
            <View style={{flex: 1,flexDirection: 'row'}}>

            </View>
              );
        }
    }
  onClickProfile=()=>{
       var {navigate} = this.props.navigation;
       storeCurrentPreference('UpdateProfile')
       navigate('UpdateProfile',{
         profileData:this.props.data.apiData.data.data[0]
       })
    }
}


const styles = StyleSheet.create({
   profileImgContainer: {
       alignSelf:'center',
       marginVertical:20,
       elevation:6,
       borderWidth:1,
       borderRadius: 400/ 2,
     },
   Rectangle: {
        width:Dimensions.get('window').width,
        height: Dimensions.get('window').height /3,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        alignSelf:'center',
        elevation:4,
        backgroundColor: 'white',
     },

 });

 mapStateToProps=state=>{
   return{
      data:state
   }
 }

export default connect(mapStateToProps,{getRequest,reset,setToken,setCartCounter,setNotificationCounter,setLanguageCode})(ProfileComponent);
