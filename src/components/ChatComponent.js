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
import {reset,getRequest} from '../redux/actions/ApiCallerAction';
import {setToken} from '../redux/actions/SetTokenActions';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
class ChatComponent extends Component{

  componentDidMount(){
      stringsoflanguages.setLanguage((this.props.chatComponent.getLanguageCode.languageCode=='en')?'en':'fr');
  }

  render(){
    const {navigate} = this.props.navigation;
    return(
      <View style={{flexGrow:1}}>
            <NavigationEvents
              onWillFocus={payload => console.log('CatCom onWillFocus ')}
              onDidFocus={payload => console.log('CatCom onDidFocus ')}
              onWillBlur={payload => console.log('CatCom onWillBlur ')}
              onDidBlur={payload => console.log('CatCom onWillBlur ')}
             />
            <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
            <SafeAreaView style={{flexGrow:1}}>
                <Header headerTitle={stringsoflanguages.chat} headerNavigation={this.props.navigation} isBack={true} notificationCount={0}/>
                <View style={{flex:1}}>
                  <WebView style={{flexGrow: 1}}  source={{uri:'https://tawk.to/chat/5e01ad7727773e0d832a7b6e/default'}}/>
                </View>
            </SafeAreaView>
      </View>
    );
  }
}



mapStateToProps=state=>{
  return{
     chatComponent:state
  }
}

export default connect(mapStateToProps,{getRequest,reset,setToken,setNotificationCounter,setLanguageCode})(ChatComponent);;
