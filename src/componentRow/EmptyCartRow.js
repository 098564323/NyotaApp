import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import * as global from '../styles/Global';

const EmptyCartRow =({screenNavigate,emptyCartRow,languageCode})=>{
  return(
        <View style={{flex:1,backgroundColor: global.APP_BG}}>
            <View style={{flex:0.5,justifyContent:'flex-end'}}>
                  <Image source={require('../../images/cart/cart_empty.png')}
                         style={{height:150,resizeMode:'contain',alignSelf:'center'}}/>
            </View>
            <View style={{flex:0.1,justifyContent:'flex-end'}}>
                  <Text style={{ fontSize:22,color:'#626161',alignSelf:'center'}}>{emptyCartRow}</Text>
            </View>
            <View style={{flex:0.1,justifyContent:'center'}}>
                  <TouchableOpacity onPress={onClickGoToShop.bind(this,screenNavigate)}>
                      <Image source={(languageCode=='en')?require('../../images/cart/go_to_shop.png'):require('../../images/cart/go_to_shop_fr.png')}
                             style={{resizeMode:'contain',alignSelf:'center',height:35}}/>
                  </TouchableOpacity>
            </View>
        </View>
  );
};

function onClickGoToShop(screenNavigate) {
  screenNavigate('Dashboard')
}
export default EmptyCartRow;
