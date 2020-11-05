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
  ActivityIndicator,
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
import { NavigationEvents } from 'react-navigation';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import { StackActions,NavigationActions } from 'react-navigation';
import NumberFormat from 'react-number-format';
//
var isAvailable=false
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import DefaultPreference from 'react-native-default-preference';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
import {BASE_URL} from '../utils/ApiMethods';

const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
//
const CompArray = new Array();
//
var qtyCheckAttribute = []
class SingleProductListingComponent extends Component{

  componentDidMount(){
    //
    this.callAPIfun()
  }

  constructor(props) {
    super(props);
    //
    stringsoflanguages.setLanguage((this.props.singleProductData.getLanguageCode.languageCode=='en')?'en':'fr');
    //
    client.defaults.headers.common['Authorization'] = (this.props.singleProductData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.singleProductData.getCurrentToken.currentToken;
    //
    this.state = {
      wID:0,
      quantitySelectedPos:0,
      attributeQtyCounter:'',
      cartCounter:0,
      scartIDArr:[0],
      productDetailsData:'',
      isViewAll:false,
      tempTotalCounter:[]
    }
    //
    this.onClickWishListCalledID  =  this.onClickWishListCalledID.bind(this);
    //
  }

   onClickWishListCalledID(categoryData) {
      //
      if(this.props.singleProductData.getCurrentToken.currentToken=='-1'){
        Alert.alert(
            '',
            'You must be signin as user to acceess the feature',
            [
              {text: 'Go To Login', onPress: () => {
                const resetAction = StackActions.reset({
                      index: 0,
                      actions: [NavigationActions.navigate({ routeName:
                        'Login',params: {languageCode: (this.props.singleProductData.getLanguageCode.languageCode=='fr')?"1":"0"} })],
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
        client.defaults.headers.common['Authorization'] = (this.props.singleProductData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.singleProductData.getCurrentToken.currentToken;
        //
        if((categoryData.wishListID!==''||this.state.wID!=0)){
              //Remove API
              let requestData={
                "wishlist_id":(this.state.wID!==0)?this.state.wID:categoryData.wishListID
              };
              //
              client.post('deletewishlist',requestData)
              .then((response) => {
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

  getSimilarProductDatat=()=>{
    //
    client.defaults.headers.common['Authorization'] = (this.props.singleProductData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.singleProductData.getCurrentToken.currentToken;
    isAvailable = true;
    //
    let requestData = {
      "product_id":this.props.navigation.state.params.product_id,
      "latitude":this.props.latitude,
      "longitude":this.props.longitude,
      "city":this.props.cityName
    };
    //
    this.props.postRequest(SIMILAR_PRODUCT,requestData);
  }
  callAPIfun=()=>{
      //
      client.defaults.headers.common['Authorization'] = (this.props.singleProductData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.singleProductData.getCurrentToken.currentToken;
      isAvailable = true;
      //
      var that = this;
      let requestData = {
        "product_id":this.props.navigation.state.params.product_id,
        "latitude":this.props.latitude,
        "longitude":this.props.longitude,
        "city":this.props.cityName
      };
      client.post('productdetail',requestData)
      .then((response) => {
            //
            var totalCounter = [];
            var tempAttributeQTYCounter = [];
            for(let i = 0; i < response.data.data[0].attribute.length; i++){
              //
              totalCounter[i] = {'id':i,'qty':response.data.data[0].attribute[i].quantity}
              //
            }
            //
            qtyCheckAttribute = totalCounter
            //
            tempAttributeQTYCounter = response.data.data[0].attribute
            //
            setStateAsync(that,{productDetailsData:response.data.data[0],
                          cartCounter:response.data.data[0].attribute[0].quantity,
                          wID:(response.data.data[0].wishListID!=='')?response.data.data[0].wishListID:0,
                          attributeQtyCounter:response.data.data[0].attribute})
            //
            if(typeof(response.data.data[0].cart)!=='string' && response.data.data[0].cart!=undefined){

                  for(var i=0;i<response.data.data[0].attribute.length;i++){
                          for(var j=0;j<response.data.data[0].cart.length;j++){
                              if(response.data.data[0].attribute[i].sale_price == response.data.data[0].cart[j].sale_price){
                                CompArray[i] = Number(response.data.data[0].cart[j].id)
                                this.state.tempTotalCounter[i] = response.data.data[0].attribute[i].quantity
                                this.state.attributeQtyCounter[i].quantity = response.data.data[0].cart[j].quantity
                              }
                          }
                  }
            }else{
              for(var i=0;i<response.data.data[0].attribute.length;i++){
                  this.state.tempTotalCounter[i] = response.data.data[0].attribute[i].quantity
                  this.state.attributeQtyCounter[i].quantity = 0
              }
            }
         }, (error) => {
             console.log('Product Details Resposne Error  '+JSON.stringify(error.response.data));
      });
  }
      render(){
        //
        const {navigate} = this.props.navigation;
        //
        return(
          <View style={{flexGrow:1}}>
                  <NavigationEvents
                    onWillFocus={payload => console.log('CatCom will focus', payload)}
                    onDidFocus={this.getSimilarProductDatat}
                    onWillBlur={payload => this.props.reset()}
                    onDidBlur={payload => isAvailable = false}
                   />
                  <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
                  <SafeAreaView style={{flexGrow:1}}>
                      <Header headerTitle={this.state.productDetailsData.product_name} headerNavigation={this.props.navigation} isSearch={true} isNotification={true} isBack={true} notificationCount={this.props.singleProductData.getNotificationCounter.notificatinCounter}/>
                      <View style={{flexGrow:1,flexBasis: 0,backgroundColor: global.APP_BG,justifyContent: 'center'}}>
                      {
                        (this.state.productDetailsData=='')?
                        <ActivityIndicator style={{width:60,height:60,marginRight: 30,alignSelf: 'center'}} size="large" color="#035B00"/>:
                        <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,justifyContent: 'center',alignItems: 'center'}}>
                            <ScrollView style={{flexBasis: 0,width: Dimensions.get('window').width}} nestedScrollEnabled={true}>
                                  <this.ImageViewContainer/>
                                  {
                                    (this.state.productDetailsData.attribute!=undefined
                                      && this.state.productDetailsData.attribute[0].Poids!=undefined)?
                                        <View style={{marginTop: 10,backgroundColor: 'white',flexDirection: 'row',padding: 10}}>
                                              <FlatList
                                                    extraData={this.state.quantitySelectedPos}
                                                    nestedScrollEnabled={true}
                                                    horizontal={true}
                                                    data={ this.state.productDetailsData.attribute }
                                                    style={{width: Dimensions.get('window').width}}
                                                    keyExtractor={(item, index) => index}
                                                    renderItem={ ({item,index}) =>
                                                        <this.productQuantityRow itemData={item} indexPos={index}/>
                                               }/>
                                        </View>
                                      :null
                                  }
                                  <View style={{marginTop: 10,backgroundColor: 'white',flexDirection: 'column',padding: 20}}>
                                        <Text style={{textDecorationLine: 'underline',color:'#626161'}}>{stringsoflanguages.aboutThisProduct}</Text>
                                        <Text style={{marginTop: 5,color: global.LIGHT_GRAY}}>{this.state.productDetailsData.full_description}</Text>
                                  </View>
                                  <this.setAttributeData attributeData={this.state.productDetailsData.attribute[this.state.quantitySelectedPos]}/>
                                  <View style={{marginTop: 10,backgroundColor: 'white',height:undefined,flexDirection: 'column'}}>
                                       <Text style={{margin: 20,textDecorationLine: 'underline',color:'#626161'}}>{stringsoflanguages.commentText}</Text>
                                       <FlatList
                                             nestedScrollEnabled={true}
                                             data={ (this.state.isViewAll)?this.state.productDetailsData.comments:this.state.productDetailsData.comments.slice(0,4) }
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
                                          <Text style={{marginTop: 10,paddingBottom: 20,marginLeft: 20,}}>{(!this.state.isViewAll)?`${stringsoflanguages.viewAllText} ${this.state.productDetailsData.comments.length} ${stringsoflanguages.commentText}`:`View less`}</Text>
                                       </TouchableOpacity>
                                 </View>
                                  {/*dsfdsf*/}
                                 <View style={{marginTop: 10,padding: 20}}/>
                            </ScrollView>
                        </View>
                      }
                      </View>
                      <Footer footerNavigate={navigate} screenPos={2} footerCartCounter={this.props.singleProductData.getCartCounter.cartCounter}/>
                  </SafeAreaView>
          </View>
        );
      }
      ImageViewContainer = () => {
         return(
                 <View style={{width: Dimensions.get('window').width,flexDirection: 'column',backgroundColor: 'white'}}>
                       <View style={{justifyContent: 'center',alignItems: 'center',padding: 10,flexDirection: 'row'}}>
                             <Image source={{uri:this.state.productDetailsData.product_image[0]}}
                                        style={{width: Dimensions.get('window').width/2,
                                                height: Dimensions.get('window').width/2}}/>
                             <View style={{position: 'absolute',width: Dimensions.get('window').width-40,
                                           height: 80,
                                           margin: 20,
                                           flexDirection: 'row',
                                           alignSelf: 'flex-start',
                                           justifyContent: 'space-between'}}>
                                           <TouchableOpacity onPress={()=>this.onClickWishListCalledID(this.state.productDetailsData)}>
                                                   <Image source={(this.state.productDetailsData.wishListID!==''||this.state.wID!=0)
                                                     ?require('../../images/profile/wishlist_dark.png'):require('../../images/profile/wishlist.png')}
                                                              style={{resizeMode: 'contain',width:25,height: 25}}/>
                                          </TouchableOpacity>
                                           <View style={{backgroundColor: global.LIGHT_GREEN,
                                                         justifyContent: 'center',width:55,height: 25,flexDirection: 'row',alignItems: 'center',paddingHorizontal: 12}}>
                                                 <Image  source={require('../../images/profile/star_white.png')}
                                                         style={{resizeMode: 'contain',width:15,height: 15}}/>
                                                <Text style={{color: 'white',paddingLeft: 5,fontSize: 16}}>{this.state.productDetailsData.avg_rating}</Text>
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
                                   <Text style={{fontSize: 16}}>{this.state.productDetailsData.product_name}</Text>
                                   <Text style={{marginTop: 5,color:global.DARK_GRAY,fontSize: 15}}>{this.state.productDetailsData.short_description}</Text>
                                   <View style={{flexWrap: 'wrap'}}>
                                         <NumberFormat value={this.state.productDetailsData.attribute[this.state.quantitySelectedPos].sale_price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                            <Text style={{flex: 1,flexBasis: 0, marginTop: 5,paddingLeft:  10,paddingRight: 10,paddingTop: 5,paddingBottom: 5,textAlign:'center',borderRadius: 5,borderColor: global.DARK_GREEN,borderWidth: 1,color:global.LIGHT_GREEN,fontSize: 15,fontWeight: 'bold'}}>{`${value} XAF`}</Text>} />
                                  </View>
                             </View>
                             {(this.state.attributeQtyCounter &&
                                 this.state.attributeQtyCounter.constructor === Array &&
                                 this.state.attributeQtyCounter.length === 0)
                                 ?
                                  <Image source={(this.props.singleProductData.getLanguageCode.languageCode=='en')?require('../../images/category/out_of_stock.png'):require('../../images/category/out_of_stock_fr.png')}
                                         style={{resizeMode: 'contain',width: 50,height: 50,marginLeft: 20}}/>
                                 :
                                 (this.state.attributeQtyCounter!= undefined &&
                                   this.state.attributeQtyCounter[this.state.quantitySelectedPos].quantity >= 1)
                                   ?
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
                                         <Image source={(this.props.singleProductData.getLanguageCode.languageCode=='en')?require('../../images/category/add_icon.png'):require('../../images/category/add_icon_fr.png')}
                                                style={{resizeMode: 'contain',width: 50,height: 50,marginLeft: 20}}/>
                                  </TouchableOpacity>
                             }
                      </View>
                 </View>
         );
      };
      //showing attribute data
      setAttributeData=({attributeData})=>{
          var orderHistoryContainer = [];
          Object.keys(attributeData).forEach(function(key) {
            if(key!=='quantity' && key!=='sale_price'){
                orderHistoryContainer.push(
                  <Text style={{marginTop: 5,color: global.LIGHT_GRAY}}>{((key=='sale_price')?'Sale price':key)+' - '+attributeData[key]}</Text>
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
      onClickPQRow=(onClickIndex)=>{
          //
          this.setState({
            quantitySelectedPos:onClickIndex,
            attributeQtyCounter:this.state.attributeQtyCounter
          })
      }
      //
      onClickAddCart=()=>{
        if(this.props.singleProductData.getCurrentToken.currentToken=='-1'){
            Alert.alert(
                '',
                'You must be signin as user to acceess the feature',
                [
                  {text: 'Go To Login', onPress: () => {
                    const resetAction = StackActions.reset({
                          index: 0,
                          actions: [NavigationActions.navigate({ routeName:
                            'Login',params: {languageCode: (this.props.singleProductData.getLanguageCode.languageCode=='fr')?"1":"0"} })],
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
          this.props.setCartCounter(Number(this.props.singleProductData.getCartCounter.cartCounter)+1)
          //
          this.state.attributeQtyCounter[this.state.quantitySelectedPos].quantity = 1
          this.setState({
            attributeQtyCounter:this.state.attributeQtyCounter
          })
          this.state.productDetailsData.attribute[this.state.quantitySelectedPos].quantity = 1
          this.CallAddCartAPICDC()
        }

      }
      //
      onUpdateCart=(type,indexPos)=>{
        //
        var tempCounter = this.state.attributeQtyCounter[indexPos].quantity
        //
        if(type=='add'){
            if(tempCounter < qtyCheckAttribute[indexPos].qty){
              tempCounter+=1
              this.CallUpdateCartAPICDC(tempCounter)
            }else{
              alert(stringsoflanguages.noMoreItemAvailable)
            }
        }else{
          if(tempCounter == 1){
            tempCounter=0
            this.CallDeleteCartAPICDC()
            this.props.setCartCounter(Number(this.props.singleProductData.getCartCounter.cartCounter)-1)
          }else{
            tempCounter-=1
            this.CallUpdateCartAPICDC(tempCounter)
          }
        }
        //
        this.state.attributeQtyCounter[indexPos].quantity = tempCounter
        //
        this.setState({
          attributeQtyCounter:this.state.attributeQtyCounter
        })
        //
      }
      //Call API for Add, Update & Delete Cart
      CallAddCartAPICDC=()=>{
        //
        let requestData={
          "product_id":this.state.productDetailsData.product_id,
          "attribute":[this.state.productDetailsData.attribute[this.state.quantitySelectedPos]],
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
          }, (error) => {
               console.log('Add to Cart Response Error  '+JSON.stringify(error.response.data));
        });
      }
      //
      CallUpdateCartAPICDC=(tempCounter)=>{
        //
        this.state.attributeQtyCounter[this.state.quantitySelectedPos].quantity = tempCounter
        //
        this.setState({
          attributeQtyCounter:this.state.attributeQtyCounter
        })
        this.state.productDetailsData.attribute[this.state.quantitySelectedPos].quantity = this.state.attributeQtyCounter[this.state.quantitySelectedPos].quantity
        //
        let requestData={
          "product_id":this.state.productDetailsData.product_id,
          "attribute":[this.state.productDetailsData.attribute[this.state.quantitySelectedPos]],
          "cart_id":CompArray[this.state.quantitySelectedPos]
        };
        client.post('addcart',requestData)
        .then((response) => {

         }, (error) => {
               console.log('Add to Cart Response Error  '+JSON.stringify(error.response.data));
        });
      }
      //
      CallDeleteCartAPICDC=()=>{
        //
        this.props.setCartCounter(Number(this.props.singleProductData.getCartCounter.cartCounter)-1)
        //
        let requestData={
          "cart_id":CompArray[this.state.quantitySelectedPos]
        };
        client.post('deletecart',requestData)
        .then((response) => {

         }, (error) => {
               console.log('Add to Cart Response Error '+JSON.stringify(error.response.data));
        });
      }
}

const setStateAsync = ( obj, state ) => {
      return new Promise( ( resolve ) =>
          obj.setState( state , resolve )
      )
  }

mapStateToProps=state=>{
  return{
     singleProductData:state,
     latitude:state.getLatitudeLongitude.currentLatitude,
     longitude:state.getLatitudeLongitude.currentLongitude,
     cityName:state.getLatitudeLongitude.city,
  }
}

export default connect(mapStateToProps,{postRequest,reset,setToken,setCartCounter,setNotificationCounter,setLanguageCode})(SingleProductListingComponent);
