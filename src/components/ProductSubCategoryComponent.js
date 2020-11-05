import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  Image,
  StatusBar,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  NativeModules
} from 'react-native';

import EmptyCartRow from '../componentRow/EmptyCartRow'
import Footer from '../utils/Footer';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
//
import {postRequest,reset} from '../redux/actions/ApiCallerAction';
import {setToken} from '../redux/actions/SetTokenActions';
import {setCartCounter} from '../redux/actions/cartCounterAction';
import {connect} from 'react-redux';
import {SUB_CATEGORY} from '../utils/ApiMethods';
import { NavigationEvents } from 'react-navigation';
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
import NumberFormat from 'react-number-format';
//
var isAvailable=true
var isEmptycartvisible=false
//
var isDeleteData=true
var filteredData;
//
import {BASE_URL} from '../utils/ApiMethods';
//
import SubCategoryRow from '../componentRow/SubCategoryRow'
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
//
class ProductSubCategoryComponent extends Component{
        constructor(props){
          super(props)
          
          //
          this.state={
            itemData:[],
            isFaching:false,
            languageCode:'0',
          }
           const deviceLanguage = Platform.OS === 'ios'
                  ? NativeModules.SettingsManager.settings.AppleLocale ||
                    NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
                  : NativeModules.I18nManager.localeIdentifier;

                  if((deviceLanguage.split('_')[0]==='fr')){
                    this.setState({
                      languageCode:'1'
                    })
                  }
          stringsoflanguages.setLanguage((this.props.subCategoryData.getLanguageCode.languageCode=='en')?'en':'fr');
          // alert(this.props.navigation.state.params.userId)
        }
        getSubCatData=()=>{

          let requestData={
            "category_id":this.props.navigation.state.params.cID,
            "languageCode":this.state.languageCode
          };
          client.post('subcategorylist',requestData)
          .then((response) => {
                console.log('Sub Categry Response '+JSON.stringify(response.data.data));
                this.setState({
                    itemData:response.data.data,
                    isFaching:true
                })
           }, (error) => {
                console.log('Sub Categry Response  '+JSON.stringify(error.response.data));
                alert(error.response.data.message)
                this.setState({
                    isFaching:true
                })
           });
        }

      render(){
          //
          const {navigate} = this.props.navigation;
          //
          return (
            <View style={{flex:1}}>

                <NavigationEvents
                  onWillFocus={payload => console.log('onWillFocus')}
                  onDidFocus={this.getSubCatData}
                  onWillBlur={payload => console.log('onWillBlur')}
                  onDidBlur={payload => console.log('onDidBlur')}/>

                <SafeAreaView style={{backgroundColor:global.LIGHT_YELLOW}}/>
                <SafeAreaView style={{flexGrow:1}}>
                <Header headerTitle={this.props.navigation.state.params.cName} headerNavigation={this.props.navigation} isSearch={true} isNotification={true} isBack={true} notificationCount={false}/>

                  <View style={{flex:1,backgroundColor:global.APP_BG,justifyContent:'center',alignItems:'center',padding:10}}>
                      {
                        (this.state.isFaching==false)?
                          <ActivityIndicator style={{alignSelf: 'center'}} size="large" />
                        :
                          <FlatList
                               style={{marginLeft:0,width: Dimensions.get('window').width,margin:0}}
                               data={this.state.itemData}
                               keyExtractor={(item, index) => index.toString()}
                               renderItem={({item,index}) =>
                               <SubCategoryRow itemData={item} categoryNavigate={navigate} productData={this.state.productData} orderId={this.props.navigation.state.params.orderId} userId={this.props.navigation.state.params.userId}/>}/>
                      }
                  </View>
                  <Footer footerNavigate={navigate} screenPos={2} footerCartCounter={Number(this.props.subCategoryData.getCartCounter.cartCounter)}/>
                </SafeAreaView>
            </View>
          );
      }
 }

const styles = StyleSheet.create({
});

mapStateToProps=(state,propsData)=>{
  return{
     subCategoryData:state,
  }
}
export default connect(mapStateToProps,{postRequest,reset,setToken,setCartCounter,setNotificationCounter,setLanguageCode})(ProductSubCategoryComponent);
