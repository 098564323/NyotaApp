import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  StatusBar,
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import * as global from '../styles/Global';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {ADDTOCART} from '../utils/ApiMethods';
import {connect} from 'react-redux';
import {postRequest,reset} from '../redux/actions/ApiCallerAction';
//
import NumberFormat from 'react-number-format';
import DefaultPreference from 'react-native-default-preference';
import { StackActions,NavigationActions } from 'react-navigation';
//
import {BASE_URL} from '../utils/ApiMethods';
//
var isWishStatus = 0
var languageCodeGlobal = ''
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
//
DefaultPreference.get('userToken').then(function(value) {
  return value;
});
//

const CategoryRow =({categoryData,categoryNavigate,indexPos,deleteItem,isFromWishList,userToken,cartUpdateCounter,totalCartCounter,categoryID,languageCode,navigationObj})=>{
  //
  languageCodeGlobal = languageCode
  var tempPurchaseCounter = 0
  var tempPurchaseCardId = 0
  //
  if(typeof(categoryData.cart)!=='string' && categoryData.cart!==undefined){
      for(var i=0;i<categoryData.cart.length;i++){
        if(categoryData.attribute!==undefined && categoryData.cart[i].sale_price==categoryData.attribute[0].sale_price.split(' ')[0]){
          tempPurchaseCounter = Number(categoryData.cart[i].quantity)
          tempPurchaseCardId  = Number(categoryData.cart[i].id)
        }
      }
  }
  //
  const [selected, setSelected] = React.useState(new Map());
  const [cartSelected, setCartSelected] = React.useState(new Map());
  //
  const [cartCounter, updateCartData] = React.useState(new Map());
  const [counter, setCounter] = React.useState(tempPurchaseCounter);
  //
  const [wID, setWId] = React.useState(0);
  const [cID, setCId] = React.useState(tempPurchaseCardId);
  const [isDelete, setDelete] = React.useState(true);

  const [ttCounter, tempTotalCounter] = React.useState((categoryData.attribute && categoryData.attribute.constructor === Array && categoryData.attribute.length === 0)?0:categoryData.attribute[0].quantity);
  //Maintain Wish List Icon based on User Preference.

  const onSelect = React.useCallback(
    id => {
      const newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));
      setSelected(newSelected);
    },[selected]);
  //Add Card Button Visible or Not
  const onAddCart = React.useCallback(
    id => {
      const newSelected = new Map(cartSelected);
      newSelected.set(id, !cartSelected.get(id));
      setCartSelected(newSelected);
    },[cartSelected]);
  //Maintian Counter Variable  For Cart Management
  const onCartUpdate = React.useCallback(
    id => {
      const newSelected = new Map(cartCounter);
      newSelected.set(id, counter);
      updateCartData(newSelected);
    },[cartCounter]);

  return(
          <View style={{width: Dimensions.get('window').width,
                        height: undefined,flexDirection: 'row'}}>

                  <View style={{justifyContent: 'center',alignItems: 'center',flexGrow: 1,flexBasis: 0}}>
                        <Image source={{uri:(categoryData == undefined)?'':categoryData.product_image[0]}}
                                   style={{width:60,height:60}}/>
                              <View style={{position: 'absolute',height: 80,paddingHorizontal:10,marginHorizontal: 10,width: Dimensions.get('window').width/4}}>
                                  <TouchableOpacity onPress={onClickWishListCalled.bind(this,categoryData,onSelect,selected,setWId,wID,isDelete,setDelete,deleteItem,isFromWishList,userToken,languageCode,categoryNavigate,navigationObj)}>
                                            <Image source={((categoryData.wishListID!==''||wID!=0)&&isDelete)?require('../../images/profile/wishlist_dark.png'):require('../../images/profile/wishlist.png')}
                                                       style={{width: 25,height: 25}}/>
                                 </TouchableOpacity>
                              </View>
                  </View>
                  <View style={{flexGrow: 2,flexBasis: 0,flexDirection: 'column',justifyContent: 'center'}}>
                        <TouchableOpacity onPress={onCategoryClick.bind(this,categoryData,categoryNavigate,wID,counter,ttCounter,categoryID,indexPos)}>
                              <Text style={{fontSize: 16,paddingTop:25}}>{categoryData.product_name}</Text>
                              <Text numberOfLines={1} style={{marginTop: 5,color:global.DARK_GRAY,fontSize: 15}}>{`${categoryData.short_description} ${(categoryData.attribute && categoryData.attribute.constructor === Array && categoryData.attribute.length === 0)?'':'('+categoryData.attribute[0].Poids+')'}`}</Text>
                              {(categoryData.attribute && categoryData.attribute.constructor === Array && categoryData.attribute.length === 0)?null:
                              <NumberFormat value={(isFromWishList)?categoryData.attribute[0].sale_price:categoryData.attribute[0].sale_price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                <Text style={{color:global.LIGHT_GREEN,fontSize: 14,fontWeight: 'bold',marginTop: 4,paddingBottom:25}}>{`${value} XAF`}</Text>} />}
                        </TouchableOpacity>
                  </View>
                  <View style={{flexGrow: 1,flexBasis: 0,flexDirection: 'column',justifyContent: 'flex-end',paddingBottom: 5}}>
                    {(counter>=1)?
                      <View style={{flexDirection: 'column',justifyContent: 'center',alignItems: 'center',flexGrow: 1,flexBasis: 0}}>
                           <TouchableOpacity onPress={onClickUpdateCart.bind(this,categoryData,onCartUpdate,setCounter,counter,onAddCart,'add',cID,userToken,ttCounter)}>
                                 <Image source={require('../../images/category/add.png')}
                                        style={{resizeMode: 'contain',width: 20,height: 20}}/>
                            </TouchableOpacity>
                            <Text style={{
                                         backgroundColor: global.LIGHT_YELLOW,
                                         width: 30,
                                         marginTop: 14,
                                         textAlign:'center',
                                         paddingTop: 5,
                                         height: 30,
                                         borderRadius:15,
                                         color:'white',
                                         fontSize: 15}}>{counter}</Text>
                            <TouchableOpacity onPress={onClickUpdateCart.bind(this,categoryData,onCartUpdate,setCounter,counter,onAddCart,'minus',cID,userToken,ttCounter,cartUpdateCounter,totalCartCounter)}>
                                  <Image source={require('../../images/category/remove.png')}
                                         style={{marginTop: 5,resizeMode: 'contain',width: 20,height: 20}}/>
                           </TouchableOpacity>
                     </View>
                      :
                        (categoryData.attribute && categoryData.attribute.constructor === Array && categoryData.attribute.length === 0)?
                        <Image source={(languageCode=='en')?require('../../images/category/out_of_stock.png'):require('../../images/category/out_of_stock_fr.png')}
                             style={{resizeMode: 'contain',width: 50,height: 50,marginLeft: 20}}/>
                         :
                        <TouchableOpacity onPress={onClickAddToCart.bind(this,categoryData,onAddCart,onCartUpdate,cartSelected,setCounter,counter,setCId,userToken,tempTotalCounter,ttCounter,cartUpdateCounter,totalCartCounter,languageCode,categoryNavigate,navigationObj)}>
                                  <Image source={(languageCode=='en')?require('../../images/category/add_icon.png'):require('../../images/category/add_icon_fr.png')}
                                         style={{resizeMode: 'contain',width: 50,height: 50,marginLeft: 20}}/>
                        </TouchableOpacity>
                      }
                  </View>
                  <View style={{position: 'absolute',alignSelf: 'flex-end',height: 1,marginLeft: 20,backgroundColor: '#BCBBBB',width: Dimensions.get('window').width-40}}/>
          </View>
    );
}

function onCategoryClick(categoryData,categoryNavigate,wID,counter,ttCounter,categoryID,indexPos) {
    //
    categoryData.totalCounter = [categoryData.attribute.length]
    var tempQtyCounter = 0
    for(let i = 0; i < categoryData.attribute.length; i++){
      //
      if(i==0){
        tempCounter = ttCounter
        categoryData.attribute[i].quantity = counter
      }else{
        tempCounter = categoryData.attribute[i].quantity
        categoryData.attribute[i].quantity = 0
      }
      categoryData.totalCounter[i] = {'id':i,'qty':tempCounter}
    }
    //
    categoryNavigate('CategoryDetail',{
      productData:categoryData,
      wishLidId:(categoryData.wishListID=='')?wID:categoryData.wishListID,
      wishStatus:isWishStatus,
      cartCounter:counter,
      categoryID:categoryID,
      indexPos:indexPos
    })
    // alert(JSON.stringify(categoryData))
}

function onClickWishListCalled(categoryData,onSelect,selected,setWId,wID,isDelete,setDelete,deleteItem,isFromWishList,userToken,
  languageCode,categoryNavigate,navigationObj) {
    //
    if(userToken=='-1'){
      Alert.alert(
          '',
          'You must be signin as user to acceess the feature',
          [
            {text: 'Go To Login', onPress: () => {
              const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName:
                      'Login',params: {languageCode: (languageCode=='fr')?"1":"0"} })],
              });
              const currentNavigation = categoryNavigate;
              //
              DefaultPreference.clearAll()
              .then(function() {
                  new Promise((resolve, reject) => {
                        navigationObj.dispatch(resetAction);
                  });
              });
            }},
            {text: 'Cancel', onPress: () => {}}
          ],
          {cancelable: true},
        );
    }else{
      if((categoryData.wishListID!==''||wID!=0)&&isDelete){
          //Remove API
          callDeleteWishList(categoryData,(wID==0)?categoryData.wishListID:wID,onSelect,setWId,setDelete,deleteItem,isFromWishList,userToken)
      }else{
          //Add API
          callCreateWishList(categoryData,onSelect,setWId,setDelete,userToken);
      }
    }
    //
}

function onClickAddToCart(categoryData,onAddCart,onCartUpdate,cartSelected,setCounter,counter,setCId,userToken,tempTotalCounter,ttCounter,cartUpdateCounter,totalCartCounter,languageCode,categoryNavigate,navigationObj) {
    //
    if(userToken=='-1'){
      Alert.alert(
          '',
          'You must be signin as user to acceess the feature',
          [
            {text: 'Go To Login', onPress: () => {
              const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName:
                      'Login',params: {languageCode: (languageCode=='fr')?"1":"0"} })],
              });
              const currentNavigation = categoryNavigate;
              //
              DefaultPreference.clearAll()
              .then(function() {
                  new Promise((resolve, reject) => {
                        navigationObj.dispatch(resetAction);
                  });
              });
            }},
            {text: 'Cancel', onPress: () => {}}
          ],
          {cancelable: true},
        );
    }else{
      cartUpdateCounter(Number(totalCartCounter)+1)
      if(ttCounter==0){
        tempTotalCounter(categoryData.attribute[0].quantity)
      }
      setCounter(1)
      onCartUpdate(categoryData.product_id)
      onAddCart(categoryData.product_id)
      callAddToCartAPI(categoryData,setCId,userToken);
    }
}

function onClickUpdateCart(categoryData,onCartUpdate,setCounter,counter,onAddCart,mathOpration,cID,userToken,ttCounter,cartUpdateCounter,totalCartCounter,languageCode) {
    //
    if(mathOpration=='add'){
      if(counter < ttCounter){
        setCounter(counter+1)
        callupdateCartAPI(categoryData,counter,mathOpration,cID,userToken,cartUpdateCounter,totalCartCounter)
      }else{
        alert((languageCodeGlobal=='en')?'No More Items available':"Plus d'articles disponibles")
      }
    }else{
      if(counter == 1){
        setCounter(0)
        onAddCart(categoryData.product_id)
        cartUpdateCounter(Number(totalCartCounter)-1)
      }else{
        setCounter(counter-1)
      }

      callupdateCartAPI(categoryData,counter,mathOpration,cID,userToken,cartUpdateCounter,totalCartCounter)
    }
    // //
    onCartUpdate(categoryData.product_id)
    // //

}
//
// WishList Add/Remove API Call
//
//
callCreateWishList=(categoryData,onSelect,setWId,setDelete,userToken)=>{
  //
  client.defaults.headers.common['Authorization'] = (userToken=='-1')?'':'Bearer '+userToken;
  let requestData={
    "product_id":categoryData.product_id,
    "variant":categoryData.attribute[0]
  };
  client.post('addwishlist',requestData)
  .then((response) => {
        //
        isWishStatus = 1
        //
        setDelete(true);
        setWId(response.data.data[0].wishListId);
        onSelect(categoryData.product_id);
        //
     }, (error) => {
         console.log('Create Wishlist Response Error  '+JSON.stringify(error.response.data));
  });
}


callDeleteWishList=(categoryData,wishListID,onSelect,setWId,setDelete,deleteItem,isFromWishList,userToken)=>{
  //
  client.defaults.headers.common['Authorization'] = (userToken=='-1')?'':'Bearer '+userToken;
  let requestData={
    "wishlist_id":wishListID
  };
  //
  client.post('deletewishlist',requestData)
  .then((response) => {
        console.log('deleteWish '+JSON.stringify(response));
         //
         isWishStatus = 2
         //
         if(isFromWishList){
          deleteItem(categoryData.product_id)
         }
         setDelete(false);
         setWId(0);
         onSelect(categoryData.product_id);
         //
     }, (error) => {
         console.log('Delete Wishlist Response Error  '+JSON.stringify(error.response.data));
         onSelect(categoryData.product_id);
  });
}

//
//
// Cart Add And Update API Call
//
//
callAddToCartAPI=(categoryData,setCId,userToken)=>{
  //
  client.defaults.headers.common['Authorization'] = (userToken=='-1')?'':'Bearer '+userToken;
  for(let i = 0; i < categoryData.attribute.length; i++){
    if(i==0){
      categoryData.attribute[i].quantity = 1
    }else{
      categoryData.attribute[i].quantity = 0
    }
  }
  //
  let requestData={
    "product_id":categoryData.product_id,
    "attribute":[categoryData.attribute[0]],
    "cart_id":0
  };
  client.post('addcart',requestData)
  .then((response) => {
        setCId(response.data.data[0].cart_id);
   }, (error) => {
         console.log('Add to Cart Response Error  '+JSON.stringify(error.response.data));
  });
}

callupdateCartAPI=(categoryData,counter,type,cartID,userToken,cartUpdateCounter,totalCartCounter)=>{
  //
  client.defaults.headers.common['Authorization'] = (userToken=='-1')?'':'Bearer '+userToken;
  //
  var tempCounter = counter
  //
  if(type=='add'){
    tempCounter+=1
  }else{
    if(counter == 1){
      tempCounter-=1
      calldeleteCartAPI(cartID,userToken)
    }else{
      tempCounter-=1
    }
  }
  //
  if(tempCounter > 1){
    var tempcatData = {}
    for(let i = 0; i < categoryData.attribute.length; i++){
      if(i==0){
        categoryData.attribute[i].quantity = tempCounter
        tempcatData = categoryData.attribute[i]
      }else{
        categoryData.attribute[i].quantity = 0
      }
    }
    //
    let requestData={
      "product_id":categoryData.product_id,
      "attribute":[tempcatData],
      "cart_id":cartID
    };
    client.post('addcart',requestData)
    .then((response) => {
          console.log('Add to Cart Response '+JSON.stringify(response.data.data));
     }, (error) => {
           console.log('Add to Cart Response Error  '+JSON.stringify(error.response.data));
    });
  }
}

calldeleteCartAPI=(cartID,userToken)=>{
    //
    client.defaults.headers.common['Authorization'] = (userToken=='-1')?'':'Bearer '+userToken;
    //
    let requestData={
      "cart_id":cartID
    };
    client.post('deletecart',requestData)
    .then((response) => {
          console.log('Add to Cart Response '+JSON.stringify(response.data.data));
     }, (error) => {
           console.log('Add to Cart Response Error  '+JSON.stringify(error.response.data));
    });
}


export default connect(mapStateToProps,{postRequest,reset})(CategoryRow);
