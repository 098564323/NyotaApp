import React,{Component} from 'react';

import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import Footer from '../utils/Footer';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import CategoryRow from '../componentRow/CategoryRow';
import {connect} from 'react-redux';
import {setToken} from '../redux/actions/SetTokenActions';
import {setCartCounter} from '../redux/actions/cartCounterAction';
import {setSearchText} from '../redux/actions/SearchTextAction';
import {CATEGORY_DETAIL} from '../utils/ApiMethods';
import {ADDTOCART} from '../utils/ApiMethods';
//
import { Input } from 'react-native-elements';
//
import { NavigationEvents } from 'react-navigation';
var isAvailable=false
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import DefaultPreference from 'react-native-default-preference';
import FastImage from 'react-native-fast-image';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
import {BASE_URL} from '../utils/ApiMethods';
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
//

class SearchComponent extends Component{
  constructor(props) {
        super(props);
        this.state = {
          isClick: -1,
          responseData:[],
          searchProductData:[],
          searchText:'',
          isError:false,
          isSearchProduct:true
        }
        stringsoflanguages.setLanguage((this.props.searchData.getLanguageCode.languageCode=='en')?'en':'fr');
    }
    componentDidMount(){
      this.setState({
        isSearchProduct:true
      })
    }

    findProdctDetails=(productName)=>{
      this.setState({isSearchProduct:true})
      client.defaults.headers.common['Authorization'] = (this.props.searchData.getCurrentToken.currentToken=='-1')?'':'Bearer '+ this.props.searchData.getCurrentToken.currentToken;
      //
      isAvailable = true;
      //
      let requestData={
        "search_box":productName,
        "latitude":this.props.latitude,
        "longitude":this.props.longitude,
        "city":this.props.cityName
      };
      client.post('searchpage',requestData)
      .then((response) => {
            console.log(JSON.stringify(response));
            //
            this.setState({
              searchProductData:response.data.data,
              isError:false,
              isSearchProduct:true
            })
           }, (error) => {
             this.setState({
               responseData:error.response.data,
               isError:true
             })
      });
    }
    //
    searchProductDataAPI=(productName,categoryID)=>{
      //
      client.defaults.headers.common['Authorization'] = (this.props.searchData.getCurrentToken.currentToken=='-1')?'':'Bearer '+ this.props.searchData.getCurrentToken.currentToken;
      //
      isAvailable = true;
      //
      this.setState({
        isSearchProduct:false,
        searchProductData:[]
      })
      //
      let requestData={
        "search_box":productName,
        "category_id":categoryID,
        "latitude":this.props.latitude,
        "longitude":this.props.longitude,
        "city":this.props.cityName
      };
      console.log('Search Request Data '+JSON.stringify(requestData));

      client.post('categorysearchpage',requestData)
      .then((response) => {
            this.setState({
              responseData:response.data,
              isError:false
            })
           }, (error) => {
             this.setState({
               responseData:error.response.data,
               isError:true
             })
      });
    }
    callAPIfun=()=>{
      client.defaults.headers.common['Authorization'] = (this.props.searchData.getCurrentToken.currentToken=='-1')?'':'Bearer '+ this.props.searchData.getCurrentToken.currentToken;
      //
      isAvailable = true;
      //
      let requestData={
        "search_box":this.props.navigation.state.params.product_name,
        "latitude":this.props.latitude,
        "longitude":this.props.longitude,
        "city":this.props.cityName
      };
      client.post('searchpage',requestData)
      .then((response) => {
            console.log('OrderHistory Data '+JSON.stringify(response.data));
            this.setState({
              responseData:[],
              searchProductData:response.data.data,
              isError:false,
              isSearchProduct:true
            })
           }, (error) => {
             this.setState({
               responseData:error.response.data,
               isError:true
             })
      });
    }
    //
    render() {
      //
      const {navigate} = this.props.navigation;
      //
      return (
        <View style={{flexGrow:1}}>
              <NavigationEvents
                onWillFocus={payload => console.log('CatCom will focus', payload)}
                onDidFocus={this.callAPIfun}
                onWillBlur={payload => console.log('')}
                onDidBlur={payload => console.log('')}
               />
              <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
              <SafeAreaView style={{flexGrow:1}}>
                  <this.SearchHeaderData />

                  <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,justifyContent: 'center',alignItems: 'center'}}>
                      {(this.state.isSearchProduct)?
                      <FlatList
                        data={ this.state.searchProductData }
                        style={{backgroundColor: global.APP_BG, width: Dimensions.get('window').width}}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={ ({item,index}) =>
                            <this.searchProductRow searchProductData={item}/>
                        }/>
                        :null
                      }
                      {(this.state.responseData!== undefined && this.state.isSearchProduct==false)?
                      <FlatList
                        data={ this.state.responseData.data }
                        style={{backgroundColor: global.APP_BG, width: Dimensions.get('window').width}}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={ ({item,index}) =>
                            <CategoryRow categoryData={item} categoryNavigate={navigate} indexPos={index} deleteItem={() => this.deleteItem(item)}  isFromWishList={false} userToken={this.props.searchData.getCurrentToken.currentToken}  cartUpdateCounter={this.props.setCartCounter} totalCartCounter={this.props.searchData.getCartCounter.cartCounter} categoryID={0} languageCode={(this.props.searchData.getLanguageCode.languageCode=='en')?'en':'fr'}/>
                        }/>
                        :(this.state.isError)?<Text style={{alignSelf: 'center',position: 'absolute'}}>{stringsoflanguages.noDataFound}</Text>:null
                      }

                  </View>
                  <Footer footerNavigate={navigate} screenPos={2} footerCartCounter={Number(this.props.searchData.getCartCounter.cartCounter)}/>
              </SafeAreaView>
        </View>
      );
    }
    //
    searchProductRow = ({searchProductData}) => {
        return(
           <View style={{flexDirection: 'column',width: Dimensions.get('window').width,paddingHorizontal: 20}}>
                <View style={{flexDirection: 'row'}}>
                      <Image
                         resizeMode='cover'
                         source={require('../../images/footer/search_grey.png')}
                         style={{width: 20,height: 20,alignSelf: 'center'}}/>
                         <TouchableOpacity style={{marginLeft: 15,height: undefined,paddingVertical: 10,flex: 1,justifyContent: 'center',borderBottomWidth:1,borderBottomColor: "#C9C8C8"}} onPress={this.searchProductDataAPI.bind(this,searchProductData.product_name,searchProductData.sub_category_id)}>
                                   <View style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center',flex:1,flexWrap: 'wrap'}}>
                                       <Text style={{flex: 1,alignSelf: 'center',color:'#727272'}}>{`${searchProductData.product_name} in `}<Text style={{color:'#41A935'}}>{searchProductData.category_name}</Text></Text>
                                       <Image
                                          resizeMode='cover'
                                          source={require('../../images/footer/arrow_grey.png')}
                                          style={{alignSelf: 'center',width: 20,height: 20}}/>
                                   </View>
                         </TouchableOpacity>
                </View>
           </View>
        )
    }
    //
    SearchHeaderData = () => {
       return(
         <View style={{flexDirection: 'column'}}>
               <View style={{width: undefined,height: 45,elevation: 10,justifyContent: 'flex-end',flexDirection: 'row'}}>
                       <Image
                          resizeMode='cover'
                          source={require('../../images/backgrounds/home_header_bg.png')}
                          style={styleHeader.bgStyle}/>
                          <View style={{paddingLeft: 10,
                                        paddingRight: 10,
                                        position: 'absolute',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        width: Dimensions.get('window').width,
                                        height: 45}}>
                                        <TouchableOpacity onPress={()=>{
                                          this.props.navigation.goBack()
                                        }}>
                                            <Image source={require('../../images/header/back_arrow_white.png')}
                                                    style={styleHeader.iconStyle}/>
                                        </TouchableOpacity>
                                        <View style={{flex: 1,height: 25,flexDirection: 'row',alignItems: 'center'}}>
                                            <View style={{flex: 1,marginRight: 30,marginLeft: 10,width: undefined,height: 25,flexDirection: 'row',backgroundColor: 'white',alignItems: 'center',borderRadius:5}}>
                                                    <Image  source={require('../../images/header/search_color.png')}
                                                              style={[styleHeader.iconStyle,{marginLeft: 10,width: 15,height: 15}]}/>
                                                    <Input
                                                           placeholder={`${stringsoflanguages.typeHere}...`}
                                                           multiline={false}
                                                            inputStyle={{fontSize: 13,flex:1}}
                                                            onSubmitEditing={() => {
                                                                this.findProdctDetails(this.state.searchText)
                                                            }}
                                                            onChangeText={text => this.setState({
                                                                searchText:text
                                                              })}
                                                            value={this.state.searchText}/>
                                            </View>
                                       </View>
                        </View>
               </View>
         </View>
       );
     };
}

const styleHeader = StyleSheet.create({
  bgStyle:{
    width: Dimensions.get('window').width+60,
    height: undefined
  },
  iconStyle:{
    resizeMode: 'contain',
    width: 20,
    height: 20,
  }

});

mapStateToProps=state=>{
  return{
     searchData:state,
     latitude:state.getLatitudeLongitude.currentLatitude,
     longitude:state.getLatitudeLongitude.currentLongitude,
     cityName:state.getLatitudeLongitude.city,
  }
}


export default connect(mapStateToProps,{setToken,setCartCounter,setSearchText,setNotificationCounter,setLanguageCode}) (SearchComponent);
