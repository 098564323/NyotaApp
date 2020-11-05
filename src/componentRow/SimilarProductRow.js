import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  TextInput,
  View,
  ScrollView,
  FlatList,
  Text,
  Image,
  CheckBox,
  Alert,
  Button,
  TouchableOpacity
} from 'react-native';
//
import * as Utils from '../utils/Utils';
import FastImage from 'react-native-fast-image';
import NumberFormat from 'react-number-format';
//
const SimilarProductRow =({itemData,sProductNavigate,languageCode,userToken,navigationObj})=>{
    console.log("itemData ::: "+JSON.stringify(itemData));
  return(

          <View style={{flexGrow:1,marginRight: 20}}>

          {itemData!==undefined?
                  <View style={styles.square}>

                  <View style={{justifyContent:'center',alignItems:'center',padding:5}}>
                       <TouchableOpacity onPress={onCategoryClick.bind(this,sProductNavigate,itemData,1,2,0)}>
                          {
                            (itemData.product_image==undefined)?null:<Image source={{uri:itemData.product_image[0]}}
                                       resizeMode='cover'
                                       style={{height:110,width:60,alignSelf:'center'}}/>
                          }
                       </TouchableOpacity>
                      </View>
                      <View style={{flexGrow:0.1,marginHorizontal:4}}>
                          <Text numberOfLines={1} style={{color:'black',fontSize:15,fontWeight:'bold',marginHorizontal: 10}}>{itemData.product_name}</Text>
                      </View>

                      <View style={{flexGrow:0.1,marginHorizontal:4}}>
                            <Text numberOfLines={1} style={{color:'#626161',fontSize:13,marginHorizontal: 10}}>{itemData.short_description}</Text>
                      </View>
                      {
                        (itemData.attribute==undefined)?null:
                              <View style={{flexGrow:0.1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:7}}>

                                {(itemData.attribute && itemData.attribute.constructor === Array && itemData.attribute.length === 0)?null:
                                    <NumberFormat value={(itemData.attribute!=undefined)?itemData.attribute[0].sale_price:''} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                        <Text style={{fontWeight:'bold',color:'#38a935',fontSize: 11}}>{`${value} XAF`}</Text>} />}
                                        <Image source={((itemData.attribute && itemData.attribute.constructor === Array && itemData.attribute.length === 0) || itemData.attribute[0].quantity=="0")?
                                                        ((languageCode=='en')?require('../../images/category/out_of_stock.png'):require('../../images/category/out_of_stock_fr.png')):
                                                        ((languageCode=='en')?require('../../images/category/add_icon.png'):require('../../images/category/add_icon_fr.png'))}
                                               style={{width:40,height:40,resizeMode:'contain'}}/>


                              </View>
                      }
              </View>
              :null
            }
        </View>
        );
};
function onCategoryClick(sProductNavigate,categoryData,wID,isWishStatus,counter) {
    //
    categoryData.totalCounter = [categoryData.attribute.length]
    var tempQtyCounter = 0
    //
    if(typeof(categoryData.cart)=='string'){
      for(var i = 0; i < categoryData.attribute.length; i++){
          categoryData.totalCounter[i] = {'id':i,'qty':0}
      }
    }else{
        for(var i = 0; i < categoryData.attribute.length; i++){
            categoryData.totalCounter[i] = {'id':i,'qty':categoryData.attribute[i].quantity}
            categoryData.attribute[i].quantity = 0
        }
    }
    //
    sProductNavigate({routeName:'SimilarProduct',params:{
      productData:categoryData,
      wishLidId:(categoryData.wishListID=='')?wID:categoryData.wishListID,
      wishStatus:isWishStatus,
      cartCounter:counter
    },key:'spage' + categoryData.product_id})
}
const styles = StyleSheet.create({
  square: {
      backgroundColor: 'white',
      borderRadius:7,
      width: Dimensions.get('window').width/2.5,
      borderColor:'#B5B5B5',
      borderWidth:1
  }
});

export default SimilarProductRow;
