import React,{Component} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import Footer from '../utils/Footer';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import FastImage from 'react-native-fast-image';
import {SIMILAR_PRODUCT} from '../utils/ApiMethods';
import {connect} from 'react-redux';
import {setToken} from '../redux/actions/SetTokenActions';
import {setCartCounter} from '../redux/actions/cartCounterAction';
import {postRequest,reset} from '../redux/actions/ApiCallerAction';
import SimilarProductRow from '../componentRow/SimilarProductRow';
import { NavigationEvents,StackActions,NavigationActions } from 'react-navigation';
//
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
var isAvailable=false
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
import NumberFormat from 'react-number-format';
//
import DefaultPreference from 'react-native-default-preference';
import {BASE_URL} from '../utils/ApiMethods';

const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
//
const CompArray = new Array();
var qtyCheckAttribute=''
var isTempFetchingData = false
//
class SimilarProductComponent extends Component{

  constructor(props) {
    super(props);
    //
    stringsoflanguages.setLanguage((this.props.similarProductData.getLanguageCode.languageCode=='en')?'en':'fr');
    //
    if(typeof(this.props.navigation.state.params.productData.cart)!=='string' && this.props.navigation.state.params.productData.cart!=undefined){
        for(var i=0;i<this.props.navigation.state.params.productData.cart.length;i++){
            for(var j=0;j<this.props.navigation.state.params.productData.attribute.length;j++){
                if(this.props.navigation.state.params.productData.cart[i].Couleur==this.props.navigation.state.params.productData.attribute[j].Couleur){
                    if(j>0)
                      this.props.navigation.state.params.productData.attribute[j].quantity = this.props.navigation.state.params.productData.cart[i].quantity
                    //this.props.navigation.state.params.productData.attribute[j].quantity =  this.props.navigation.state.params.productData.cart[]
                    CompArray[j] = Number(this.props.navigation.state.params.productData.cart[i].id)
                }
            }
        }
    }
    //
    client.defaults.headers.common['Authorization'] = (this.props.similarProductData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.similarProductData.getCurrentToken.currentToken;
    qtyCheckAttribute=this.props.navigation.state.params.productData.totalCounter;
    //
    this.state = {
      wID:0,
      quantitySelectedPos:0,
      attributeQtyCounter:this.props.navigation.state.params.productData.attribute,
      cartCounter:this.props.navigation.state.params.cartCounter,
      cartIDArr:[0],
      isViewAll:false,
      isDataFetch:false,
      tempResponseData:[]
    }
    //
    this.onClickWishListCalledID  = this.onClickWishListCalledID.bind(this);
    //
  }

   onClickWishListCalledID(categoryData) {
      if(this.props.similarProductData.getCurrentToken.currentToken=='-1'){
        Alert.alert(
            '',
            'You must be signin as user to acceess the feature',
            [
              {text: 'Go To Login', onPress: () => {
                const resetAction = StackActions.reset({
                      index: 0,
                      actions: [NavigationActions.navigate({ routeName:
                        'Login',params: {languageCode: (this.props.similarProductData.getLanguageCode.languageCode=='fr')?"1":"0"} })],
                });
                const currentNavigation = this.props.navigation.navigate;
                //
                this.props.navigation.dispatch(resetAction);
                //
                DefaultPreference.clearAll()
                .then(function() {});
                //
              }},
              {text: 'Cancel', onPress: () => {}}
            ],
            {cancelable: true},
          );
      }else{
          //
          if((categoryData.wishListID!==''||this.state.wID!=0)){
              //Remove API
              let requestData={
                "wishlist_id":(this.state.wID!==0)?this.state.wID:categoryData.wishListID
              };
              //
              client.post('deletewishlist',requestData)
              .then((response) => {
                     //
                     this.setState({
                       wID:0
                     })
                 }, (error) => {
                     console.log('Delete Wishlist Response Error  '+JSON.stringify(error.response.data));

              });
          }else{
              //ADD API
              let requestData={
                "product_id":categoryData.product_id,
                "variant":categoryData.attribute[this.state.quantitySelectedPos]
              };
              client.post('addwishlist',requestData)
              .then((response) => {
                    this.setState({
                      wID:response.data.data[0].wishListId
                    })
                 }, (error) => {
                     console.log('Create Wishlist Response Error  '+JSON.stringify(error.response.data));
              });
          }
      }
  }
  callDeleteWishListID=(wishListID)=>{}

  callCreateWishListID=(categoryData)=>{}

  callAPIfun=()=>{
      isTempFetchingData = true
      //
      this.CheckOnBackPressEvent()
      //
      client.defaults.headers.common['Authorization'] = (this.props.similarProductData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.similarProductData.getCurrentToken.currentToken;
      //
      isAvailable = true;
      //
      let requestData = {
        "product_id":this.props.navigation.state.params.productData.product_id,
        "latitude":this.props.latitude,
        "longitude":this.props.longitude,
        "city":this.props.cityName
      };
      //
      this.setState({
        wID:this.props.navigation.state.params.wishLidId
      })
    //
    this.props.postRequest(SIMILAR_PRODUCT,requestData);
  }

      render(){
        //
        const {navigate} = this.props.navigation;
        //
        return(
          <View style={{flexGrow:1}}>
                <NavigationEvents
                  onWillFocus={payload => console.log('CatCom will focus', payload)}
                  onDidFocus={this.callAPIfun}
                  onWillBlur={payload => this.props.reset()}
                  onDidBlur={payload => isAvailable = false}
                 />
                <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
                <SafeAreaView style={{flexGrow:1}}>
                    <Header headerTitle={this.props.navigation.state.params.productData.product_name} headerNavigation={this.props.navigation} isSearch={true} isNotification={true} isBack={true} notificationCount={this.props.similarProductData.getNotificationCounter.notificatinCounter}/>
                    <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,justifyContent: 'center',alignItems: 'center'}}>
                        <ScrollView style={{flexBasis: 0,width: Dimensions.get('window').width}} nestedScrollEnabled={true}>
                              <this.ImageViewContainer/>
                              {
                                ((this.props.navigation.state.params.productData.attribute && this.props.navigation.state.params.productData.attribute.constructor === Array && this.props.navigation.state.params.productData.attribute.length === 0)
                                ||(this.props.navigation.state.params.productData.attribute!=undefined
                                  && this.props.navigation.state.params.productData.attribute[0].Poids!=undefined))?
                                    <View style={{marginTop: 10,backgroundColor: 'white',flexDirection: 'row',padding: 10}}>
                                          <FlatList
                                                extraData={this.state.quantitySelectedPos}
                                                nestedScrollEnabled={true}
                                                horizontal={true}
                                                data={ this.props.navigation.state.params.productData.attribute }
                                                style={{width: Dimensions.get('window').width}}
                                                keyExtractor={(item, index) => item.key}
                                                renderItem={ ({item,index}) =>
                                                    <this.productQuantityRow itemData={item} indexPos={index}/>
                                           }/>
                                    </View>
                                    :null
                              }
                              <View style={{marginTop: 10,backgroundColor: 'white',flexDirection: 'column',padding: 20}}>
                                    <Text style={{textDecorationLine: 'underline',color:'#626161'}}>{stringsoflanguages.aboutThisProduct}</Text>
                                    <Text style={{marginTop: 5,color: global.LIGHT_GRAY}}>{this.props.navigation.state.params.productData.full_description}</Text>
                              </View>
                              {(this.props.navigation.state.params.productData.attribute && this.props.navigation.state.params.productData.attribute.constructor === Array && this.props.navigation.state.params.productData.attribute.length === 0)
                                ?null:<this.setAttributeData attributeData={this.props.navigation.state.params.productData.attribute[this.state.quantitySelectedPos]}/>
                              }

                              <View style={{marginTop: 10,backgroundColor: 'white',height:undefined,flexDirection: 'column'}}>
                                   <Text style={{margin: 20,textDecorationLine: 'underline',color:'#626161'}}>{stringsoflanguages.commentText}</Text>
                                   <FlatList
                                         nestedScrollEnabled={true}
                                         data={ (this.state.isViewAll)?this.props.navigation.state.params.productData.comments:this.props.navigation.state.params.productData.comments.slice(0,4) }
                                         style={{width: Dimensions.get('window').width}}
                                         keyExtractor={(item, index) => index.toString()}
                                         renderItem={ ({item}) =>
                                             <this.commentRow itemData={item}/>
                                    }/>
                                    <TouchableOpacity onPress={()=>{
                                         var tempIsViewAll = this.state.isViewAll
                                         this.setState({
                                           isViewAll:!tempIsViewAll
                                         })
                                     }}>
                                           <Text style={{marginTop: 10,paddingBottom: 20,marginLeft: 20,}}>{(!this.state.isViewAll)?`${stringsoflanguages.viewAllText} ${this.props.navigation.state.params.productData.comments.length} ${stringsoflanguages.commentText}`:`View less`}</Text>
                                    </TouchableOpacity>
                             </View>
                             <View style={{marginTop: 10,backgroundColor: 'white',height:undefined,flexDirection: 'column',paddingBottom: 10}}>
                                  <View  style={{flexDirection:'row',justifyContent:'space-between'}}>
                                      <Text style={{margin: 20,textDecorationLine: 'underline',color:'#626161',fontWeight: 'bold',fontSize: 16}}>{stringsoflanguages.similarProductText}</Text>
                                      <TouchableOpacity onPress={()=>{
                                                  navigate('SimilarPCC',{
                                                    similarData:this.props.similarProductData.apiData.data.data,
                                                    cName:'Similar Products'
                                                  })
                                        }}>
                                      <Text style={{margin: 20,textDecorationLine: 'underline',color:'#38a935',fontSize: 13}}>{stringsoflanguages.viewAllText}</Text>
                                      </TouchableOpacity>
                                  </View>
                                  {(isAvailable)?
                                      <FlatList
                                            nestedScrollEnabled={true}
                                            horizontal={true}
                                            data={ this.props.similarProductData.apiData.data.data }
                                            style={{width: Dimensions.get('window').width,marginLeft: 15}}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={ ({item}) =>
                                                <SimilarProductRow itemData={item} sProductNavigate={navigate} userToken={this.props.similarProductData.getCurrentToken.currentToken} navigationObj={this.props.navigation}/>
                                       }/>:null
                                  }
                            </View>
                             <View style={{marginTop: 10,padding: 20}}/>
                        </ScrollView>
                    </View>
                    <Footer footerNavigate={navigate} screenPos={2} footerCartCounter={this.props.similarProductData.getCartCounter.cartCounter}/>
                </SafeAreaView>
          </View>
        );
      }
      //
      ImageViewContainer = () => {
         return(
                 <View style={{width: Dimensions.get('window').width,flexDirection: 'column',backgroundColor: 'white'}}>
                       <View style={{justifyContent: 'center',alignItems: 'center',padding: 10,flexDirection: 'row'}}>
                             <Image source={{uri:this.props.navigation.state.params.productData.product_image[0]}}
                                        style={{width: Dimensions.get('window').width/2,
                                                height: Dimensions.get('window').width/2}}/>
                             <View style={{position: 'absolute',width: Dimensions.get('window').width-40,
                                           height: 80,
                                           margin: 20,
                                           flexDirection: 'row',
                                           alignSelf: 'flex-start',
                                           justifyContent: 'space-between'}}>
                                           <TouchableOpacity onPress={()=>this.onClickWishListCalledID(this.props.navigation.state.params.productData)}>
                                                     <Image source={((this.props.navigation.state.params.productData.wishListID!==''||this.state.wID!=0)
                                                       &&(this.props.navigation.state.params.wishStatus==0||this.props.navigation.state.params.wishStatus==1))?require('../../images/profile/wishlist_dark.png'):require('../../images/profile/wishlist.png')}
                                                                style={{resizeMode: 'contain',width:25,height: 25}}/>
                                            </TouchableOpacity>
                                           <View style={{backgroundColor: global.LIGHT_GREEN,
                                                         justifyContent: 'center',width:50,height: 25,flexDirection: 'row',alignItems: 'center'}}>
                                                 <Image  source={require('../../images/profile/star_white.png')}
                                                         style={{resizeMode: 'contain',width:15,height: 15}}/>
                                                <Text style={{color: 'white',paddingLeft: 5,fontSize: 16}}>{this.props.navigation.state.params.productData.avg_rating}</Text>
                                           </View>
                             </View>
                      </View>
                      <View style={{marginTop: 10,
                                   height:1,
                                   marginLeft: 20,
                                   width: Dimensions.get('window').width-40,
                                   backgroundColor: global.BORDER_COLOR}}/>
                      <View style={{padding:20,flexDirection: 'row'}}>
                             <View style={{flexDirection: 'column',flexGrow: 3,flexBasis: 0}}>
                                   <Text style={{fontSize: 16}}>{this.props.navigation.state.params.productData.product_name}</Text>
                                   <Text style={{marginTop: 5,color:global.DARK_GRAY,fontSize: 15}}>{this.props.navigation.state.params.productData.short_description}</Text>
                                   <View style={{flexWrap: 'wrap'}}>
                                        {(this.props.navigation.state.params.productData.attribute && this.props.navigation.state.params.productData.attribute.constructor === Array && this.props.navigation.state.params.productData.attribute.length === 0)
                                          ?null
                                          :
                                          <NumberFormat value={this.props.navigation.state.params.productData.attribute[this.state.quantitySelectedPos].sale_price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                            <Text style={{flex: 1,flexBasis: 0, marginTop: 5,paddingLeft:  10,paddingRight: 10,paddingTop: 5,paddingBottom: 5,textAlign:'center',borderRadius: 5,borderColor: global.DARK_GREEN,borderWidth: 1,color:global.LIGHT_GREEN,fontSize: 15,fontWeight: 'bold'}}>{`${value} XAF`}</Text>} />
                                        }

                                   </View>
                             </View>
                             {(this.props.similarProductData.getCurrentToken.currentToken=='-1')?
                               <TouchableOpacity onPress={this.onClickAddCart.bind(this)}>
                                         <Image source={(this.props.similarProductData.getLanguageCode.languageCode=='en')?require('../../images/category/add_icon.png'):require('../../images/category/add_icon_fr.png')}
                                                style={{resizeMode: 'contain',width: 50,height: 50,marginLeft: 20}}/>
                               </TouchableOpacity>
                               :
                               ((this.state.attributeQtyCounter && this.state.attributeQtyCounter.constructor === Array && this.state.attributeQtyCounter.length === 0)||(this.state.tempResponseData.attribute
                               && this.state.tempResponseData.attribute.constructor === Array && this.state.tempResponseData.attribute.length === 0))?
                               <Image source={(this.props.similarProductData.getLanguageCode.languageCode=='en')?require('../../images/category/out_of_stock.png'):require('../../images/category/out_of_stock_fr.png')}
                                      style={{resizeMode: 'contain',width: 50,height: 50,marginLeft: 20}}/>
                                :(this.state.attributeQtyCounter!= undefined && this.state.attributeQtyCounter[this.state.quantitySelectedPos].quantity >= 1)?
                                <View style={{flexDirection: 'column',justifyContent: 'center',alignItems: 'center',flexGrow: 1,flexBasis: 0}}>
                                       <TouchableOpacity onPress={this.onUpdateCart.bind(this,'add',this.state.quantitySelectedPos)}>
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
                                                    fontSize: 15}}>{this.state.attributeQtyCounter[this.state.quantitySelectedPos].quantity}</Text>
                                       <TouchableOpacity onPress={this.onUpdateCart.bind(this,'minus',this.state.quantitySelectedPos)}>
                                             <Image source={require('../../images/category/remove.png')}
                                                    style={{marginTop: 5,resizeMode: 'contain',width: 20,height: 20}}/>
                                      </TouchableOpacity>
                                </View>
                               :
                               <TouchableOpacity onPress={this.onClickAddCart.bind(this)}>
                                         <Image source={(this.props.similarProductData.getLanguageCode.languageCode=='en')?require('../../images/category/add_icon.png'):require('../../images/category/add_icon_fr.png')}
                                                style={{resizeMode: 'contain',width: 50,height: 50,marginLeft: 20}}/>
                               </TouchableOpacity>
                             }
                      </View>
                 </View>
         );
      };
      //
      setAttributeData=({attributeData})=>{
          var orderHistoryContainer = [];
          Object.keys(attributeData).forEach(function(key) {
            if(key!=='quantity' && key!=='sale_price'){
              orderHistoryContainer.push(
                <Text style={{marginTop: 5,color: global.LIGHT_GRAY}}>{((key=='price')?'Actual price':key)+' - '+attributeData[key]}</Text>
              )
            }
          });
          return (
            <View style={{marginTop: 10,backgroundColor: 'white',flexDirection: 'column',padding: 20}}>
                  {orderHistoryContainer}
            </View>
          );
      }
      //
      commentRow=(itemData)=>{
        return(
                <View style={{
                              flexDirection: 'column',
                              marginLeft: 20,
                              width: Dimensions.get('window').width-40}}>
                      <Text style={{marginTop: 5,color: global.LIGHT_GRAY}}>{itemData.itemData.comment}</Text>
                      <Text style={{marginTop: 5,alignSelf: 'flex-end',color: global.LIGHT_GRAY}}>- {itemData.itemData.user}</Text>
                      <View style={{marginTop: 10,
                                   height:1,
                                   width: Dimensions.get('window').width-40,
                                   backgroundColor: global.BORDER_COLOR}}/>
                </View>
        );
      }
      //
      productQuantityRow=({itemData,indexPos})=>{
        return(
          <TouchableOpacity onPress={this.onClickPQRow.bind(this,indexPos)}>
                {(this.state.quantitySelectedPos==indexPos)?
                 <Text style={{marginLeft: 10,padding: 5,textAlign:'center',backgroundColor: global.LIGHT_GREEN,color:'white',fontSize: 14,borderRadius: 5}}>{itemData.Poids}</Text>
                :<Text style={{marginLeft: 10,padding: 5,textAlign:'center',borderColor: global.DARK_GREEN,borderWidth: 1,color:global.LIGHT_GREEN,fontSize: 14,borderRadius: 5}}>{itemData.Poids}</Text>}

          </TouchableOpacity>
        );
      }
      //
      onClickPQRow=(onClickIndex)=>{
          //
          this.setState({
            quantitySelectedPos:onClickIndex,
            attributeQtyCounter:this.state.attributeQtyCounter
          })
      }
      //
      onClickAddCart=()=>{
        if(this.props.similarProductData.getCurrentToken.currentToken=='-1'){
          Alert.alert(
              '',
              'You must be signin as user to acceess the feature',
              [
                {text: 'Go To Login', onPress: () => {
                  const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName:
                          'Login',params: {languageCode: (this.props.similarProductData.getLanguageCode.languageCode=='fr')?"1":"0"} })],
                  });
                  const currentNavigation = this.props.navigation.navigate;
                  //
                  this.props.navigation.dispatch(resetAction);
                  //
                  DefaultPreference.clearAll()
                  .then(function() {});
                  //
                }},
                {text: 'Cancel', onPress: () => {}}
              ],
              {cancelable: true},
            );
        }else{
            if(isTempFetchingData == false){
                //
                this.props.setCartCounter(this.props.similarProductData.getCartCounter.cartCounter+1)
                //
                this.state.attributeQtyCounter[this.state.quantitySelectedPos].quantity = 1
                this.setState({
                  attributeQtyCounter:this.state.attributeQtyCounter
                })
                //
                this.CallAddCartAPICDC()
            }
        }
      }
      //
      onUpdateCart=(type,indexPos)=>{
        if(isTempFetchingData == false){
              //
              var tempCounter = this.state.attributeQtyCounter[indexPos].quantity
              //
              if(type=='add'){
                  if(tempCounter < qtyCheckAttribute[indexPos].qty){
                    tempCounter+=1
                    this.CallUpdateCartAPICDC()
                  }else{
                    alert(stringsoflanguages.noMoreItemAvailable)
                  }
              }else{
                if(tempCounter == 1){
                  tempCounter=0
                  this.CallDeleteCartAPICDC()
                  this.props.setCartCounter(this.props.similarProductData.getCartCounter.cartCounter-1)
                }else{
                  tempCounter-=1
                  this.CallUpdateCartAPICDC()
                }
              }
              //
              this.state.attributeQtyCounter[indexPos].quantity = tempCounter
              //
              this.setState({
                attributeQtyCounter:this.state.attributeQtyCounter
              })
              //
              if(this.state.attributeQtyCounter[indexPos].quantity>1){

              }
          }
      }
      //Call API for Add, Update & Delete Cart
      CallAddCartAPICDC=()=>{
        for(let i = 0; i < this.state.attributeQtyCounter.length; i++){
          if(i!=this.state.quantitySelectedPos){
          }else{
            this.props.navigation.state.params.productData.attribute[i].quantity = this.state.attributeQtyCounter[i].quantity
          }
        }
        let requestData={
          "product_id":this.props.navigation.state.params.productData.product_id,
          "attribute":[this.props.navigation.state.params.productData.attribute[this.state.quantitySelectedPos]],
          "cart_id":0
        };
        client.post('addcart',requestData)
        .then((response) => {
            //
            CompArray[this.state.quantitySelectedPos] = parseInt(response.data.data[0].cart_id,10)
            //
            this.setState({
                cartIDArr:this.state.cartIDArr.splice(0, 0, 393)
              })
              console.log('Add to Cart Response '+JSON.stringify(response.data.data));
             }, (error) => {
               console.log('Add to Cart Response Error  '+JSON.stringify(error.response.data));
        });
      }
      //
      CallUpdateCartAPICDC=()=>{
        //
        console.log('product_id-Cartid '+CompArray[this.state.quantitySelectedPos]);
        //
        for(let i = 0; i < this.state.attributeQtyCounter.length; i++){
          if(i!=this.state.quantitySelectedPos){
          }else{
            this.props.navigation.state.params.productData.attribute[i].quantity = this.state.attributeQtyCounter[i].quantity
          }
        }
        let requestData={
          "product_id":this.props.navigation.state.params.productData.product_id,
          "attribute":[this.props.navigation.state.params.productData.attribute[this.state.quantitySelectedPos]],
          "cart_id":CompArray[this.state.quantitySelectedPos]
        };
        client.post('addcart',requestData)
        .then((response) => {
              console.log('Add to Cart Response ');
         }, (error) => {
               console.log('Add to Cart Response Error  '+JSON.stringify(error.response.data));
        });
      }
      //
      CallDeleteCartAPICDC=()=>{
        //
        this.props.setCartCounter(this.props.similarProductData.getCartCounter.cartCounter-1)
        //
        let requestData={
          "cart_id":CompArray[this.state.quantitySelectedPos]
        };
        client.post('deletecart',requestData)
        .then((response) => {
              console.log('Add to Cart Response '+JSON.stringify(response.data.data));
             }, (error) => {
               console.log('Add to Cart Response Error '+JSON.stringify(error.response.data));
        });
      }

      CheckOnBackPressEvent=()=>{
        //
        let requestData={
          "category_id":this.props.navigation.state.params.productData.category_id,
          "page_no":"1",
          "latitude":this.props.latitude,
          "longitude":this.props.longitude,
          "city":this.props.cityName
        };

        client.post('categorydetail',requestData)
        .then((response) => {
              for(var i=0;i<response.data.data.length;i++){
                if(response.data.data[i].product_id==this.props.navigation.state.params.productData.product_id){
                    //
                    if(typeof(response.data.data[i].cart)=='string'){
                      for(var j=0;j<response.data.data[i].attribute.length;j++){
                          this.state.attributeQtyCounter[j].quantity = 0
                      }
                    }else{
                        for(var j=0;j<response.data.data[i].attribute.length;j++){
                           //
                          if(response.data.data[i].cart.some(cart => cart.sale_price.split('XAF')[0] === response.data.data[i].attribute[j].sale_price.split('XAF')[0])){
                               this.state.attributeQtyCounter[j].quantity = response.data.data[i].cart[response.data.data[i].cart.findIndex(cart => cart.sale_price.split('XAF')[0] == response.data.data[i].attribute[j].sale_price.split('XAF')[0])].quantity
                               CompArray[j] = Number(response.data.data[i].cart[response.data.data[i].cart.findIndex(cart => cart.sale_price == response.data.data[i].attribute[j].sale_price)].id)
                          }else{
                               this.state.attributeQtyCounter[j].quantity = 0
                          }
                          //
                        }
                    }
                    this.setState({
                      attributeQtyCounter:this.state.attributeQtyCounter,
                      tempResponseData:response.data.data[i]
                    })
                    //
                    isTempFetchingData = false
                    //
                }
              }
             }, (error) => {
              console.log('Add to Cart Response Error '+JSON.stringify(error.response.data));
        });
      }
}

mapStateToProps=state=>{
  return{
     similarProductData:state,
     latitude:state.getLatitudeLongitude.currentLatitude,
     longitude:state.getLatitudeLongitude.currentLongitude,
     cityName:state.getLatitudeLongitude.city,
  }
}

export default connect(mapStateToProps,{postRequest,reset,setToken,setCartCounter,setNotificationCounter,setLanguageCode})(SimilarProductComponent);
