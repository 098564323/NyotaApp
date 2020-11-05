import React,{Component} from 'react';
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
  Platform
} from 'react-native';
import * as global from '../styles/Global';
import FastImage from 'react-native-fast-image';
import DefaultPreference from 'react-native-default-preference';
import {storeCurrentPreference} from '../utils/Utils';
//
const DashboardRow =({itemData,dashboardNavigate})=>{
//
  return(
          <View style={styles.GridViewContainer}>
                <TouchableOpacity onPress={onCategoryClick.bind(this,itemData.category_id,itemData.category_name,dashboardNavigate)}>
                      <Image source={{uri:itemData.category_image}}
                                 style={{resizeMode: 'contain',width: (Dimensions.get('window').width/3)-20,height: (Dimensions.get('window').width/3)-20}}/>
                     {(itemData.category_name==undefined)?null:
                       <View style={{padding: 2,marginHorizontal: 5,marginTop: (Dimensions.get('window').width/3)-40,width: (Dimensions.get('window').width/3)-20,position: 'absolute',backgroundColor: 'rgba(52, 52, 52, 0.65)'}}>
                              <Text numberOfLines={1} style={{color:'white'}}>{itemData.category_name}</Text>
                       </View>
                     }
                </TouchableOpacity>
          </View>
    );
}

function onCategoryClick(categoryID,categoryName,dashboardNavigate) {

    if(categoryID!==undefined){
      storeCurrentPreference('ProductSubCategory')
      dashboardNavigate('ProductSubCategory',{
        cName:categoryName,
        cID:categoryID
      })
    }
}

const styles = StyleSheet.create({
       GridViewContainer: {
       width: (Dimensions.get('window').width-40)/3,
       flexDirection: 'column',
       height: (Platform.OS === 'ios')?(Dimensions.get('window').height)/6:(Dimensions.get('window').height+10)/6,//(Dimensions.get('window').width-120/3)/3 ,
       marginRight: 1,
       marginBottom: 1,
       backgroundColor: global.APP_BG
    }
});

export default DashboardRow;
