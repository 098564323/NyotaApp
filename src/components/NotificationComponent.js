import React,{Component} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  Text,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {connect} from 'react-redux';
import Header from '../utils/Header';
import {setToken} from '../redux/actions/SetTokenActions';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import NotificationRow from '../componentRow/NotificationRow';
import {BASE_URL} from '../utils/ApiMethods';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import DefaultPreference from 'react-native-default-preference';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
//
class NotificationComponent extends Component{

  constructor(props) {
        super(props);
        //
        this.state = {
          notificationData:'',
          isLoading:true
        };
        //
        this.props.setNotificationCounter(0)
        DefaultPreference.clear('notificationCounter')
        //
        this.getNotificationData()
        //
        stringsoflanguages.setLanguage((this.props.notificationData.getLanguageCode.languageCode=='en')?'en':'fr');
    }

    getNotificationData=()=>{
      //
      client.defaults.headers.common['Authorization'] = (this.props.notificationData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.notificationData.getCurrentToken.currentToken;
      //
      client.get('notification')
      .then((response) => {
          //
          this.setState({
            notificationData:response.data.data,
            isLoading:false
          })
         }, (error) => {
          this.setState({
            notificationData:(error.response.data.message==undefined)?error.response.data.error:error.response.data.message,
            isLoading:false
          })
      });
      //
    }
     render(){
       const {navigate} = this.props.navigation;
       return(
         <View style={{flexGrow:1}}>
               <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
               <SafeAreaView style={{flexGrow:1}}>
                   <Header headerTitle={stringsoflanguages.notification} headerNavigation={this.props.navigation} isNotification={false} isBack={true}/>
                   <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,justifyContent: 'center',alignItems: 'center',paddingTop: 10,}}>
                        {
                        (this.state.isLoading)?
                          <ActivityIndicator style={{width:60,height:60,marginRight: 30,alignSelf: 'center'}} size="large" color="#035B00"/>
                        :
                            (typeof(this.state.notificationData) === 'string')?
                              <Text>{this.state.notificationData}</Text>
                            :
                              <FlatList
                                  data={ this.state.notificationData }
                                  style={{backgroundColor: global.APP_BG, width: Dimensions.get('window').width,height: Dimensions.get('window').height}}
                                  keyExtractor={(item, index) => index.toString()}
                                  renderItem={ ({item}) =>
                                      <NotificationRow notificationData={item} detailNavigation={navigate}/>
                              }/>
                        }
                   </View>
               </SafeAreaView>
         </View>
       );
     }
}

mapStateToProps=state=>{
  return{
     notificationData:state
  }
}

export default connect (mapStateToProps,{setToken,setNotificationCounter,setLanguageCode})(NotificationComponent);
