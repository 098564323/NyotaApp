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
  StyleSheet,
  TextInput,
  ScrollView
} from 'react-native';
import { CheckBox } from 'react-native-elements'
import Footer from '../utils/Footer';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import CategoryRow from '../componentRow/CategoryRow';
//
import {postRequest,reset} from '../redux/actions/ApiCallerAction';
import {setToken} from '../redux/actions/SetTokenActions';
import {setCartCounter} from '../redux/actions/cartCounterAction';
import {connect} from 'react-redux';
import {CATEGORY_DETAIL} from '../utils/ApiMethods';
import {ADDTOCART} from '../utils/ApiMethods';
import {SETFILTER} from '../utils/ApiMethods';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import DefaultPreference from 'react-native-default-preference';
import { NavigationEvents } from 'react-navigation';
import RangeSlider from 'rn-range-slider';
//
import Geolocation from '@react-native-community/geolocation';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
var isAvailable=false
//
import {BASE_URL} from '../utils/ApiMethods';
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
axiosMiddleware(client);
var isFetchDone = false;
var isErrorDone = false;
//
var tempCategoryData = [];
//
class SimilarProductCategoryComponent extends Component{
  constructor(props) {
        super(props);
        this.state = {
          isClick: -1,
          isDoneClicked:0,
          isCostSelected:0,
          isSortOptionSelected:-1,
          isPopularClick:0,
          filterOptionShow:false,
          SliderValue:0,
          cost:0,
          categoryId:0,
          popular:0,
          rangeLow:0,
          rangeHigh:0,
          tempRangeHigh:0,
          responseData:[],
          shopData:[],
          shopChecked:[],
          dataBackup:[],
          longitude:0,
          latitude:0,
          fetchingDataState:0
        }
        stringsoflanguages.setLanguage((this.props.categoryData.getLanguageCode.languageCode=='en')?'en':'fr');
        this.callGetShopDataForSearch();
        try {
          Geolocation.getCurrentPosition(info => {
            this.setState({
              longitude:info.coords.longitude,
              latitude:info.coords.latitude
            })
            },(error) => {
              //alert('error happens '+(error.code))
            });
        }catch (err) {
       }
    }

    callAPIfun=()=>{
      //
      this.setState({
        fetchingDataState:0
      })
      //
      isFetchDone=false;
      isAvailable = true;
      //
      tempCategoryData = this.props.navigation.state.params.similarData;
      this.setState({
        responseData:this.props.navigation.state.params.similarData,
        fetchingDataState:1
      })
   }

    callFilterAPI=()=>{
      //
      client.defaults.headers.common['Authorization'] = (this.props.categoryData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.categoryData.getCurrentToken.currentToken;
      if(this.state.isSortOptionSelected==-1){
        alert('Please select sort option')
      }else{
        //
        this.setState({filterOptionShow:false,fetchingDataState:0});
        //
        let requestData={
          "type":this.state.isSortOptionSelected,
          "price_low":this.state.rangeLow,
          "price_high":this.state.rangeHigh,
          "category_id":this.props.navigation.state.params.cID,
          "lat":this.state.latitude,
          "long":this.state.longitude,
          "searchdata":this.state.shopChecked
        };

        client.post('setfilter',requestData)
        .then((response) => {
             this.setState({
               responseData:response.data.data,
               fetchingDataState:1
             })
            }, (error) => {
              this.setState({
                responseData:[],
                fetchingDataState:2
              })
             console.log('Filter Response error'+JSON.stringify(error));
        });
      }

    }

    callGetShopDataForSearch=()=>{
      //
      client.defaults.headers.common['Authorization'] = (this.props.categoryData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.categoryData.getCurrentToken.currentToken;
      //
      let requestData={
        "category_id":this.props.navigation.state.params.cID
      };
      client.post('getshop',requestData)
      .then((response) => {
           this.setState({
             shopData:response.data.data,
             dataBackup:response.data.data,
             rangeHigh:response.data.max_price,
             tempRangeHigh:Number(response.data.max_price)
           })
        }, (error) => {
           console.log('Filter Response error'+JSON.stringify(error));
      });
    }
    //
    deleteItem = data => {}
    //
    filterResetPress=()=>{
      this.setState({
        isSortOptionSelected:-1,
        filterOptionShow:false,
        shopChecked:[]
      })
      this.callAPIfun()
    }
    filterOptionToggel=()=>{
          if(this.state.filterOptionShow==true){
            //
            this.callFilterAPI()
            //
          }else{
            this.setState({filterOptionShow:true})
          }
     }
      render() {
      //
      const {navigate} = this.props.navigation;
      //
      return (
        <View style={{flexGrow:1}}>
              <NavigationEvents
                onWillFocus={payload => {isFetchDone=false}}
                onDidFocus={(this.state.isSortOptionSelected==-1)?this.callAPIfun:this.callFilterAPI}
                onWillBlur={payload => this.props.reset()}
                onDidBlur={payload => {isAvailable = false}}
               />
              <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
              <SafeAreaView style={{flexGrow:1}}>
                  <Header headerTitle={this.props.navigation.state.params.cName} headerNavigation={this.props.navigation} isSearch={true} isNotification={true} isBack={true} notificationCount={this.props.categoryData.getNotificationCounter.notificatinCounter}/>
                      <View style={{justifyContent:'space-between',borderRadius:10,margin:5,flexDirection: 'row'}}>
                            <View style={{borderRadius:10,flexDirection: 'row'}}>
                                  <Image source={require('../../images/category/list.png')}
                                         style={{height:12,resizeMode:'contain',width: 11,margin:5}}/>
                                  <Text style={{marginRight:5,margin:2}}>{`${(this.state.responseData==undefined)?0:this.state.responseData.length} ${stringsoflanguages.items}`}</Text>
                            </View>
                            <TouchableOpacity onPress={this.filterOptionToggel}>
                                <View style={{position: 'relative',flexDirection: 'row',borderRadius:20,borderWidth: 0.3,boderColor:'grey'}}>
                                      <Image source={require('../../images/backgrounds/filter.png')}
                                             style={{height:11,resizeMode:'contain',width: 11,margin:5}}/>
                                      <Text style={{margin: 4,fontSize: 10,color: 'grey'}}>{stringsoflanguages.filter}</Text>
                                </View>
                            </TouchableOpacity>
                      </View>
                  <View style={{flexGrow:1,flexBasis:0,backgroundColor:global.APP_BG,justifyContent:'center',alignItems:'center'}}>
                            {(this.state.fetchingDataState==1)?
                                    <FlatList
                                        data={ this.state.responseData }
                                        style={{backgroundColor: global.APP_BG, width: Dimensions.get('window').width}}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={ ({item,index}) =>
                                          <CategoryRow categoryData={item} categoryNavigate={navigate} indexPos={index} deleteItem={() => this.deleteItem(item)}  isFromWishList={false} userToken={this.props.categoryData.getCurrentToken.currentToken} cartUpdateCounter={this.props.setCartCounter} totalCartCounter={this.props.categoryData.getCartCounter.cartCounter} categoryID={item.category_id} languageCode={(this.props.categoryData.getLanguageCode.languageCode=='en')?'en':'fr'}/>
                                        }/>:
                                      (this.state.fetchingDataState==2)?
                                      <Text>{this.state.responseData.message}</Text>:
                                      <ActivityIndicator style={{width:60,height:60,marginRight: 30,alignSelf: 'center'}} size="large" color="#035B00"/>
                            }
                  </View>

                    {(this.state.filterOptionShow)?
                        <this.filterOprionRow/>:<Footer footerNavigate={navigate} screenPos={2} footerCartCounter={this.props.categoryData.getCartCounter.cartCounter}/>
}
              </SafeAreaView>

        </View>
      );
    }
    filterOprionRow=()=>{
      return(
        <View style={{height: Dimensions.get('window').height,width: Dimensions.get('window').width,backgroundColor: 'rgba(52, 52, 52, 0.55)',
                      position: 'absolute',alignItems: 'center',justifyContent:'flex-end'}}>
                      <ScrollView style={{backgroundColor:'white',borderTopLeftRadius:25,borderTopRightRadius:25,width: Dimensions.get('window').width,height: (Dimensions.get('window').height/2)+100,marginTop: (Dimensions.get('window').height/2)-100}} nestedScrollEnabled={true}>
                      <View style={{
                                    marginBottom:  50,
                                    width: Dimensions.get('window').width,
                                    backgroundColor:'white',
                                    flexDirection:'column',
                                    elevation:5,
                                    borderTopLeftRadius:25,
                                    borderTopRightRadius:25}}>
                                    <View style={{justifyContent: 'center'}}>
                                        <View style={{height: 1,width: 60,marginTop: 10,backgroundColor: global.LIGHT_GRAY,position: 'relative',alignSelf: 'center'}}/>
                                    </View>
                                    <View style={{justifyContent: 'space-between',flexDirection:'row',margin:15}}>
                                            <TouchableOpacity onPress={this.filterResetPress}>
                                                  <Text style={{color:'#828282',fontWeight:'bold'}}>{stringsoflanguages.reset}</Text>
                                            </TouchableOpacity>
                                            <Text style={{fontWeight:'bold',fontSize:15}}>{stringsoflanguages.filter}</Text>


                                            <TouchableOpacity onPress={this.filterOptionToggel}>
                                                <Text style={{color:'green'}}>{stringsoflanguages.done}</Text>
                                            </TouchableOpacity>
                                     </View>
                                     <View style={styles.lineStyle}></View>
                                     <Text style={{fontWeight:'bold',color:'#626161',marginHorizontal:20,margin:8}}>Sort by,</Text>
                                     <View style={{flexDirection:'row',marginTop:10,marginHorizontal:10,width: Dimensions.get('window').width-40,height:100}}>
                                                <TouchableOpacity style={{flex:1,height: 85,marginHorizontal: 5}} onPress={()=>{this.setState({isSortOptionSelected:1})}}>
                                                    <View style={[styles.sortByViewStyle,{height: 85,borderWidth: 0.3,borderColor: 'grey',backgroundColor: (this.state.isSortOptionSelected==1)?"linen":'white',justifyContent: 'center'}]}>
                                                          <Image source={require('../../images/icon/up.png')}
                                                                 style={{height:20,resizeMode:'contain',width: 20}}/>
                                                          <Text style={styles.sortListTextStyle}>{stringsoflanguages.costLTH}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{flex:1,height: 85,marginHorizontal: 5}} onPress={()=>{this.setState({isSortOptionSelected:2})}}>
                                                    <View style={[styles.sortByViewStyle,{height: 85,borderWidth: 0.3,borderColor: 'grey',backgroundColor: (this.state.isSortOptionSelected==2)?"linen":'white',justifyContent: 'center'}]}>
                                                          <Image source={require('../../images/icon/down.png')}
                                                                 style={{height:20,resizeMode:'contain',width: 20}}/>
                                                          <Text style={styles.sortListTextStyle}>{stringsoflanguages.costHTL}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{flex:1,height: 85,marginHorizontal: 5}} onPress={()=>{this.setState({isSortOptionSelected:3})}}>
                                                    <View style={[styles.sortByViewStyle,{borderWidth: 0.3,borderColor: 'grey',height: 85,backgroundColor: (this.state.isSortOptionSelected==3)?"linen":'white',justifyContent: 'center'}]}>
                                                          <Image source={require('../../images/icon/star.png')}
                                                                 style={{height:20,resizeMode:'contain',width: 20}}/>
                                                          <Text style={styles.sortListTextStyle}>  {stringsoflanguages.mostPopular}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{flex:1,height: 85,marginHorizontal: 5}} onPress={()=>{this.setState({isSortOptionSelected:4})}}>
                                                    <View style={[styles.sortByViewStyle,{borderWidth: 0.3,borderColor: 'grey',height: 85,backgroundColor: (this.state.isSortOptionSelected==4)?"linen":'white',justifyContent: 'center'}]}>
                                                          <Image source={require('../../images/icon/star.png')}
                                                                 style={{height:20,resizeMode:'contain',width: 20}}/>
                                                          <Text  style={{fontSize:11,color:'#666565',padding:9}}>{stringsoflanguages.nearestMe}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                     </View>
                                     <View style={{flexDirection:'column'}}>
                                          <Text style={{marginHorizontal:20,margin: 8,fontWeight:'bold',color:'#626161'}}>{`${stringsoflanguages.price},  ${stringsoflanguages.min} - ${this.state.rangeLow}  ${stringsoflanguages.max} - ${this.state.rangeHigh}`}</Text>
                                          <RangeSlider
                                              style={{height: 65,marginHorizontal: 20}}
                                              min={0}
                                              max={this.state.tempRangeHigh}
                                              selectedMinimum={this.state.rangeLow}
                                              selectedMaximum={this.state.rangeHigh}
                                              thumbColor="#3DAB3B"
                                              thumbBorderColor="#3DAB3B"
                                              thumbBorderWidth={1}
                                              lineWidth={2}
                                              labelBackgroundColor="#FFFFFF"
                                              labelBorderColor="#3DAB3B"
                                              labelTextColor="#3DAB3B"
                                              step={1}
                                              disableRange={true}
                                              hideLabels={false}
                                              suffix="$"
                                              selectionColor="#3DAB3B"
                                              blankColor="#B4B4B4"
                                              onValueChanged={(low, high, fromUser) => {this.setState({rangeLow: low, rangeHigh: high})}}/>
                                     </View>
                                     <View style={{flexDirection:'column',marginHorizontal:10,width: Dimensions.get('window').width-40}}>
                                            <Text style={{marginHorizontal: 20,margin: 5,fontWeight:'bold',color:'#626161'}}>{stringsoflanguages.shop},</Text>
                                            <View style={{flexDirection:'row',borderRadius:25,backgroundColor: 'white',elevation:1,marginTop: 5,marginLeft:30,justifyContent: 'space-between',borderColor:'grey',borderWidth: 0.5}}>
                                                    <TextInput style={{marginHorizontal: 7,flex:1}}
                                                    onChangeText={text => {
                                                                    var data = this.state.shopData;
                                                                    data = data.filter(l => {
                                                                      return l.name.toLowerCase().match( text.trim().toLowerCase() );
                                                                    });
                                                                    this.setState({
                                                                      dataBackup:data
                                                                    })
                                                                 }}
                                                            placeholder={`${stringsoflanguages.search}..`}/>
                                                    <Image source={require('../../images/icon/searchfilter.png')}
                                                            style={{height:20,width: 20,resizeMode:'contain',margin: 10}}/>
                                            </View>
                                    </View>

                                        <FlatList
                                            style={{paddingBottom: 20}}
                                            data={ this.state.dataBackup }
                                            nestedScrollEnabled={true}
                                            extraData={this.state.shopChecked}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={ ({item,index}) =>
                                                <CheckBox containerStyle={{backgroundColor: "transparent", borderWidth: 0,alignSelf: 'flex-start'}}
                                                          title={item.name}
                                                          textStyle={{color:global.LIGHT_GRAY}}
                                                          checkedColor={global.LIGHT_GRAY}
                                                          onPress={()=>{
                                                                if(!this.state.shopChecked.includes(item.id)){
                                                                    //
                                                                    var currentArray = this.state.shopChecked;
                                                                    currentArray.push(item.id)
                                                                    this.setState({shopChecked:currentArray})
                                                                    //
                                                                }else{
                                                                     var array = [...this.state.shopChecked]
                                                                     array.splice(array.indexOf(item.id), 1);
                                                                     this.setState({shopChecked:array})
                                                                }
                                                          }}
                                                          checked={this.state.shopChecked.includes(item.id)}/>
                                            }/>
                      </View>
                    </ScrollView>
        </View>
      );
    }
}

const styles = StyleSheet.create({

  lineStyle:{
       borderWidth: 0.5,
       borderColor:'#D2D1D1',
    },

    sortListTextStyle:{
      fontSize:11,
      flexDirection:'row',
      marginHorizontal:3,
      marginTop:3,
      color:'#666565',
      alignSelf:'center',
      padding:5
    },
    sortByViewStyle:{
      borderRadius:10,
      elevation:4,
      alignItems:'center',
      flexDirection:'column'
    },
  textInputStyle:{
        height:35,
        marginLeft:10,
        marginTop:5,
        alignSelf:'center'
  },
  filterViewStyle:{
    position: 'absolute',
    backgroundColor:'#FFFFFF',
    flexDirection:'column',
    elevation:5,
    borderTopLeftRadius:15,
    borderTopRightRadius:15
  },
  lineStyleFilter:{
    borderWidth: 0.6,
    borderColor:'black',
    marginHorizontal:100,
  }
});

mapStateToProps=(state,propsData)=>{
  return{
     categoryData:state,
     screenName:propsData.navigation.state.routeName
  }
}

export default connect(mapStateToProps,{postRequest,reset,setToken,setCartCounter,setNotificationCounter,setLanguageCode})(SimilarProductCategoryComponent);
