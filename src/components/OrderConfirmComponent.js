import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  Image,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';
//
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import {connect} from 'react-redux';
import {setToken} from '../redux/actions/SetTokenActions';
import { StackActions,NavigationActions } from 'react-navigation';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
class OrderConfirmComponent extends Component {

  constructor(props) {
        super(props);
        //
        stringsoflanguages.setLanguage((this.props.orderConfirmData.getLanguageCode.languageCode=='en')?'en':'fr');
        //
  }
  render(){
        const {navigate} = this.props.navigation;
        return (
          <View style={{flexGrow:1}}>
                <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
                <SafeAreaView style={{flexGrow:1}}>
                      <Header headerTitle={stringsoflanguages.orderConfirm} headerNavigation={this.props.navigation} isSearch={false} isNotification={false} isBack={true} notificationCount={0}/>
                      <View style={{flexGrow:1,flexBasis: 0,justifyContent: 'center',backgroundColor:global.APP_BG,flexDirection: 'column',paddingHorizontal: 15}}>
                              <View style={{justifyContent:'flex-end'}}>
                                      <Image source={require('../../images/profile/thumbs-up.png')}
                                             style={{resizeMode:'contain',alignSelf:'center',height:110}}/>
                              </View>
                              <View style={{paddingVertical:15}}>
                                    <Text style={{fontSize:17,color:'#626161',alignSelf:'center',textAlign: 'center'}}>{stringsoflanguages.paymentDoneSuccessfullyOrder}</Text>
                                    <Text style={{fontSize:17,color:'#626161',alignSelf:'center',marginTop: 10,textAlign: 'center'}}>{stringsoflanguages.isConfirmed}</Text>
                                    <Text style={{fontSize:17,color:'#626161',alignSelf:'center',marginTop: 20,textAlign: 'center'}}>{stringsoflanguages.thanksForOrder}</Text>
                              </View>
                              <View style={{marginTop: 5}}>
                                      <TouchableOpacity onPress={this.onShopClick.bind(this)}>
                                          <Image source={(this.props.orderConfirmData.getLanguageCode.languageCode=='en')?require('../../images/cart/continue_shopping.png'):require('../../images/cart/continue_shopping_fr.png')}
                                                 style={{resizeMode:'contain',alignSelf:'center',width:250,height:40}}/>
                                     </TouchableOpacity>
                              </View>
                      </View>
                </SafeAreaView>
          </View>
        );
      }

      onShopClick=()=>{
          const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],

          });
          this.props.navigation.dispatch(resetAction);
      }
}

mapStateToProps=(state,propsData)=>{
  return{
     orderConfirmData:state
  }
}

export default connect(mapStateToProps,{setLanguageCode})(OrderConfirmComponent);
