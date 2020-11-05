import React, {Component} from 'react';
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
  Dimensions,
  TouchableOpacity
} from 'react-native';

const NotificationRow =({notificationData,detailNavigation})=>{
  return(
        <View style={{backgroundColor:'white',marginHorizontal: 20,width: Dimensions.get('window').width-40,marginTop: 10,elevation:5,flexDirection:'column',borderRadius: 7}}>
                <View style={{flexDirection: 'row',justifyContent: 'space-between',padding: 10}}>
                      <Text style={{color:'#38A935',fontWeight:'bold'}}>{notificationData.title}</Text>
                      <Text style={{color:'#848484',alignSelf:'flex-end'}}>{notificationData.date}</Text>
                </View>
                <Text style={{color:'#848484',alignSelf:'flex-start',paddingHorizontal: 10}}>{notificationData.message}</Text>
                <View style={styles.lineStyle}></View>
                {
                  (notificationData.title=='Order Delivered')?
                <TouchableOpacity onPress={onClickNavigate.bind(this,detailNavigation)}>
                      <View style={{flexDirection:'row',paddingVertical: 10,alignItems: 'center',marginLeft: 10}}>
                                <Image source={require('../../images/cart/star_brown.png')}
                                       style={{resizeMode:'contain',width: 15,height: 15}}/>
                                <Text style={{fontSize:14,color:'#cd853f',marginLeft: 5}}>Rate it !</Text>
                      </View>
                </TouchableOpacity>:null
               }
        </View>
  );
}

function onClickNavigate(detailNavigation) {
      detailNavigation('OrderHistory')
}

const styles = StyleSheet.create({

  lineStyle:{
       marginTop:5,
       borderWidth: 0.5,
       borderColor:'#D2D1D1',
    },

});

export default NotificationRow;
