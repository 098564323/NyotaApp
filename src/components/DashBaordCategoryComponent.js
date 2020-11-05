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

import Footer from '../utils/Footer';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
//
import {postRequest,reset} from '../redux/actions/ApiCallerAction';
import {setToken} from '../redux/actions/SetTokenActions';
import {setCartCounter} from '../redux/actions/cartCounterAction';
import {connect} from 'react-redux';
import {CATEGORY_DETAIL} from '../utils/ApiMethods';
import {ADDTOCART} from '../utils/ApiMethods';
import {SETFILTER} from '../utils/ApiMethods';
//
import { NavigationEvents } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
//
import {BASE_URL} from '../utils/ApiMethods';
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
axiosMiddleware(client);
//
class DashBaordCategoryComponent extends Component{
  constructor(props) {
        super(props);
        this.state={
          dashCatData:[],
          isFetch:false
        }
        stringsoflanguages.setLanguage((this.props.dashbaordCategoryData.getLanguageCode.languageCode=='en')?'en':'fr');
        console.log(this.props.dashbaordCategoryData.getCurrentToken.currentToken);

        // if(this.props.navigation.state.params.isFromUpdateOrder=='true'){
          // alert(this.props.navigation.state.params.userId)
        // }else{
          // alert('Else called')
        // }
  }

  getDashboardCatData=()=>{

    client.defaults.headers.common['Authorization'] = (this.props.dashbaordCategoryData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.dashbaordCategoryData.getCurrentToken.currentToken;
    client.get('categorylist')
    .then((response) => {
        //
        this.setState({
          dashCatData:response.data.data,
          isFetch:true
        })
    });
  }

  render() {
    const {navigate} = this.props.navigation;
    return(
      <View style={{flexGrow:1}}>
            <NavigationEvents
              onWillFocus={payload => console.log('onWillFocus')}
              onDidFocus={this.getDashboardCatData}
              onWillBlur={payload => console.log('onWillBlur')}
              onDidBlur={payload => console.log('onDidBlur')}
             />

            <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
            <SafeAreaView style={{flexGrow:1}}>
                <Header headerTitle={stringsoflanguages.category} headerNavigation={this.props.navigation} isSearch={true} isNotification={true} isBack={true} notificationCount={this.props.dashbaordCategoryData.getNotificationCounter.notificatinCounter}/>
                <View style={{borderRadius:10,margin:5,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                      {
                        (this.state.isFetch)
                        ?<FlatList
                              data={this.state.dashCatData}
                              style={{width: Dimensions.get('window').width}}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={ ({item,index}) =>
                                  <this.dashCatRow categoryData={item} navigateObj={navigate}/>
                         }/>
                        :<ActivityIndicator style={{width:60,height:60,marginRight: 30,alignSelf: 'center'}} size="large" />
                      }
                </View>
                <Footer footerNavigate={navigate} screenPos={2} footerCartCounter={Number(this.props.dashbaordCategoryData.getCartCounter.cartCounter)}/>
            </SafeAreaView>
       </View>
    );
  }
  dashCatRow=({categoryData,navigateObj})=>{
    return(
        <View style={{width: Dimensions.get('window').width,height: undefined,flexDirection: 'row',margin: 10}}>
              <View style={{justifyContent: 'center',width: 80,alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=>{
                          navigateObj('ProductSubCategory',{
                                        cID:categoryData.category_id,
                                        cName:categoryData.category_name,
                                        orderId:(this.props.navigation.state.params.isFromUpdateOrder=='true')?this.props.navigation.state.params.orderId:'',
                                        userId:(this.props.navigation.state.params.isFromUpdateOrder=='true')?this.props.navigation.state.params.userId:''})
                     }}>
                          <Image source={{uri:(categoryData == undefined)?'':categoryData.category_image}}
                                     style={{width:60,height:60}}/>
                    </TouchableOpacity>
              </View>
              <View style={{flexGrow: 2,flexBasis: 0,marginLeft: 10,flexDirection: 'column',justifyContent: 'center'}}>
                    <TouchableOpacity onPress={()=>{
                            navigateObj('ProductSubCategory',{
                                          cID:categoryData.category_id,
                                          cName:categoryData.category_name,
                                          orderId:(this.props.navigation.state.params.isFromUpdateOrder=='true')?this.props.navigation.state.params.orderId:'',
                                          userId:(this.props.navigation.state.params.isFromUpdateOrder=='true')?this.props.navigation.state.params.userId:''})
                      }}>
                         <Text style={{fontSize:16}}>{categoryData.category_name}</Text>
                    </TouchableOpacity>
              </View>
        </View>
    );
  }
}

mapStateToProps=(state,propsData)=>{
  return{
     dashbaordCategoryData:state
  }
}

export default connect(mapStateToProps,{postRequest,reset,setToken,setCartCounter,setNotificationCounter,setLanguageCode})(DashBaordCategoryComponent);
