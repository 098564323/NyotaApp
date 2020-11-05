import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  StatusBar,
  TouchableOpacity,
  Platform,
  SafeAreaView
} from 'react-native';
import FastImage from 'react-native-fast-image';
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import DefaultPreference from 'react-native-default-preference';
import {BASE_URL} from '../utils/ApiMethods';
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
//
const SubCategoryRow =({itemData,categoryNavigate,productData,orderId,userId})=>{
        return(
            <TouchableOpacity onPress={onCategoryClick.bind(this,itemData,categoryNavigate,productData,orderId,userId)}>
                <View style={{flex:1,width:Dimensions.get('window').width,flexDirection:'row',alignItems:'center',padding:8,margin:5}}>
                  <Image source={{uri:(itemData == undefined)?'':itemData.sub_category_image}}
                             style={{width:60,height:60,marginLeft:10}}/>
                  <Text style={{paddingHorizontal:10,flex:1}}>{itemData.sub_category_name}</Text>
                </View>
            </TouchableOpacity>
        );
 }
function onCategoryClick(categoryData,categoryNavigate,productData,orderId,userId) {
    categoryNavigate('Category',{
      cName:categoryData.sub_category_name,
      cID:categoryData.sub_category_id,
      orderId:orderId,
      userId:userId
    })
 }
export default SubCategoryRow;
