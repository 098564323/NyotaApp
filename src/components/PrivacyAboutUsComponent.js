import React,{Component} from 'react';

import {
  View,
  SafeAreaView,
  Text,
  ActivityIndicator
} from 'react-native';
//
import { NavigationEvents } from 'react-navigation';
//
import { WebView } from 'react-native-webview';
//
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
//
import {connect} from 'react-redux';
import {reset,postRequest} from '../redux/actions/ApiCallerAction';
import {setToken} from '../redux/actions/SetTokenActions';
import {ABOUT_US,PRIVACY_POLICY,CURRENT_STATE} from '../utils/ApiMethods';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import DefaultPreference from 'react-native-default-preference';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
var data = '';
var languageCode = '0';
class PrivacyAboutUsComponent extends Component{

  componentDidMount(){
    //
    languageCode = this.props.navigation.state.params.languageCode;
    stringsoflanguages.setLanguage((this.props.data.getLanguageCode.languageCode=='en')?'en':'fr');
    //
    let requestData = {
      "languageCode":languageCode
    };
    if(this.props.navigation.state.params.id==1){
      this.props.postRequest(PRIVACY_POLICY,requestData);
    }else{
      this.props.postRequest(ABOUT_US,requestData);
    }
  }

  render(){
    const {navigate} = this.props.navigation;
    return(
      <View style={{flexGrow:1}}>
            <NavigationEvents
              onWillFocus={payload => console.log('CatCom onWillFocus ')}
              onDidFocus={payload => console.log('CatCom onDidFocus ')}
              onWillBlur={payload => console.log('CatCom onWillBlur ', payload)}
              onDidBlur={payload => {this.props.reset()}}
             />
            <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
            <SafeAreaView style={{flexGrow:1}}>
                <Header headerTitle={(this.props.navigation.state.params.title==='Privacy Policy'?stringsoflanguages.privacyPolicy:stringsoflanguages.aboutUs)} headerNavigation={this.props.navigation} isBack={true} notificationCount={0}/>
                <View style={{flex:1}}>
                {
                  (this.props.data.apiData.isFetchning===false && this.props.data.apiData.data.data!==undefined)?
                      <WebView style={{flexGrow: 1}} source={{html:this.props.data.apiData.data.data[0].description}}/>:
                      <ActivityIndicator style={{width:60,height:60,alignSelf: 'center'}} size="large" color="#035B00"/>
                }
                </View>
            </SafeAreaView>
      </View>
    );
  }
}

mapStateToProps=state=>{
  return{
     data:state
  }
}

export default connect(mapStateToProps,{postRequest,reset,setToken,setNotificationCounter,setLanguageCode})(PrivacyAboutUsComponent);;
