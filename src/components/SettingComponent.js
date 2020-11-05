import React,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  Button,
  Switch,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {setToken} from '../redux/actions/SetTokenActions';
import {connect} from 'react-redux';
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import {BASE_URL} from '../utils/ApiMethods';
import { StackActions,NavigationActions,NavigationEvents} from 'react-navigation';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
import DefaultPreference from 'react-native-default-preference';
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
//
class SettingComponent extends Component{

    constructor(props){
      super(props)
      client.defaults.headers.common['Authorization'] = (this.props.settingData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.settingData.getCurrentToken.currentToken;
      this.state={
        notification:0,
        gps:0,
        sms:0,
        email:0
      }
      stringsoflanguages.setLanguage((this.props.settingData.getLanguageCode.languageCode=='en')?'en':'fr');
    }

    componentDidMount(){
      getSetting(this)
    }
    componentWillUnmount() {
      updateSetting(this)
    }

   render(){
       const {navigate} = this.props.navigation;
       return(
         <View style={{flexGrow:1}}>
               <NavigationEvents
                 onWillFocus={payload => console.log('')}
                 onDidFocus={payload => console.log('')}
                 onWillBlur={payload => console.log('')}
                 onDidBlur={payload => console.log('')}
                />
               <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
               <SafeAreaView style={{flexGrow:1}}>
                   <Header headerTitle={stringsoflanguages.setting} headerNavigation={this.props.navigation} isNotification={true} isBack={true} notificationCount={this.props.settingData.getNotificationCounter.notificatinCounter}/>
                   <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,width: Dimensions.get('window').width}}>
                      <this.settingRowView settingNavigate={navigate} propsNavigation={this.props.navigation}/>
                   </View>
               </SafeAreaView>
         </View>
       );
     }

     settingRowView = ({settingNavigate,propsNavigation}) => {
        return(
              <View style={{margin: 20,backgroundColor:'white',flexDirection:'column',borderRadius:7,borderWidth: 0.4,borderColor: '#828282'}}>
                    <View style={{flexDirection: 'column'}}>
                          <View style={{flexDirection: 'row',padding: 10,justifyContent: 'space-between'}}>
                                <Text style={{fontSize:16,alignSelf:'center',color:'#797979'}}>{stringsoflanguages.notification}</Text>
                                <Switch style={{alignSelf:'center'}}
                                        value = {(this.state.notification==0)?true:false}
                                        onValueChange = {(value)=>this.setState({
                                          notification:(value)?0:1
                                        })}/>
                          </View>
                          <View style={{height: 1,backgroundColor:global.BORDER_COLOR,width: undefined}}/>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                          <View style={{flexDirection: 'row',padding: 10,justifyContent: 'space-between'}}>
                                <Text style={{fontSize:16,alignSelf:'center',color:'#797979'}}>{stringsoflanguages.gps}</Text>
                                <Switch style={{alignSelf:'center'}}
                                        value = {(this.state.gps==0)?true:false}
                                        onValueChange = {(value)=>{this.setState({
                                          gps:(value)?0:1
                                        })}
                                      }/>
                          </View>
                          <View style={{height: 1,backgroundColor:global.BORDER_COLOR,width: undefined}}/>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                          <View style={{flexDirection: 'row',padding: 10,justifyContent: 'space-between'}}>
                                <Text style={{fontSize:16,alignSelf:'center',color:'#797979'}}>{stringsoflanguages.sms}</Text>
                                <Switch style={{alignSelf:'center'}}
                                        value = {(this.state.sms==0)?true:false}
                                        onValueChange = {(value)=>this.setState({
                                          sms:(value)?0:1
                                        })}/>
                          </View>
                          <View style={{height: 1,backgroundColor:global.BORDER_COLOR,width: undefined}}/>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                          <View style={{flexDirection: 'row',padding: 10,justifyContent: 'space-between'}}>
                                <Text style={{fontSize:16,alignSelf:'center',color:'#797979'}}>{stringsoflanguages.email}</Text>
                                <Switch style={{alignSelf:'center'}}
                                        value = {(this.state.email==0)?true:false}
                                        onValueChange = {(value)=>this.setState({
                                          email:(value)?0:1
                                        })}/>
                          </View>
                          <View style={{height: 1,backgroundColor:global.BORDER_COLOR,width: undefined}}/>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                          <View style={{flexDirection: 'row',padding: 12,justifyContent: 'space-between'}}>
                                <TouchableOpacity onPress={deleteAccount.bind(this,settingNavigate,propsNavigation)}>
                                  <Text style={{fontSize:16,alignSelf:'center',color:'#797979'}}>{stringsoflanguages.deleteAccount}</Text>
                                </TouchableOpacity>
                          </View>
                          <View style={{height: 1,backgroundColor:global.BORDER_COLOR,width: undefined}}/>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                          <View style={{flexDirection: 'row',padding: 12,justifyContent: 'space-between'}}>
                                <TouchableOpacity onPress={clearHistory.bind(this)}>
                                  <Text style={{fontSize:16,alignSelf:'center',color:'#797979'}}>{stringsoflanguages.clearHistory}</Text>
                                </TouchableOpacity>
                          </View>
                    </View>
              </View>
        );
      }
}

  getSetting=(that)=>{
    client.get('getsettings')
    .then((response) => {
        //
        that.setState({
            notification:response.data.data.notification,
            gps:response.data.data.gps,
            sms:response.data.data.sms,
            email:response.data.data.email
        })
       }, (error) => {
        console.log('get setting error--->'+JSON.stringify(error));
    });
  }

  updateSetting=(that)=>{
    //
    let requestData={
      "notification":that.state.notification,
      "gps":that.state.gps,
      "sms":that.state.sms,
      "email":that.state.email
      };

    client.post('updatesettings',requestData)
    .then((response) => {
     }, (error) => {
      //  console.log('update setting error--->'+JSON.stringify(error));
    });
  }

deleteAccount=(settingNavigate,propsNavigation)=>{
  //
  client.post('deleteuser')
  .then((response) => {
      Alert.alert('',response.data.message,
      [
        {text: 'OK', onPress: () => userMovetoLogin('Login',settingNavigate,propsNavigation)}
      ],
      {cancelable: false});
      //
     }, (error) => {
       Alert.alert('',error.response.data.message,
       [
         {text: 'OK', onPress: () => console.log('OK Pressed')}
       ],
       {cancelable: false});
  });
}

clearHistory=()=>{
  //
  client.get('clearhistory')
  .then((response) => {
      alert(''+response.data.message)
     },(error) => {      
      alert(''+error.response.data.message)
    });
}

userMovetoLogin=(screenName,settingNavigate,propsNavigation)=>{
  //
  const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: screenName })],
  });
  const currentNavigation = settingNavigate;
  DefaultPreference.clearAll()
  .then(function() {
      new Promise((resolve, reject) => {
            propsNavigation.dispatch(resetAction);
      });
  });
}

const styles = StyleSheet.create({
  lineStyle:{
       borderWidth: 0.5,
       borderColor:'#D2D1D1',
    },
});
const setStateAsync = ( obj, state ) => {
    return new Promise( ( resolve ) =>
        obj.setState( state , resolve )
    )
  }
mapStateToProps=state=>{
  return{
     settingData:state
  }
}

export default connect(mapStateToProps,{setToken,setNotificationCounter,setLanguageCode}) (SettingComponent);
