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
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
//
import DefaultPreference from 'react-native-default-preference';
import { CheckBox } from 'react-native-elements'
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);
//
class LanguageComponent extends Component{

    constructor(props){
      super(props)
      //
      client.defaults.headers.common['Authorization'] = (this.props.languageData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.languageData.getCurrentToken.currentToken;
      //
      this.state={
        isEnSelected:(this.props.languageData.getLanguageCode.languageCode=='en'?true:false),
        isFrSelected:(this.props.languageData.getLanguageCode.languageCode=='en'?false:true),
        laguageText:(this.props.languageData.getLanguageCode.languageCode=='en'?'Change Language':'Changer de langue'),
        engText:(this.props.languageData.getLanguageCode.languageCode=='en'?"English":"Anglais"),
        frenchText:(this.props.languageData.getLanguageCode.languageCode=='en'?"French":"Français")
      }
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
                   <Header headerTitle={this.state.laguageText} headerNavigation={this.props.navigation} isNotification={true} isBack={true} notificationCount={this.props.languageData.getNotificationCounter.notificatinCounter}/>
                   <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,width: Dimensions.get('window').width}}>
                      <this.languageViewRow settingNavigate={navigate} propsNavigation={this.props.navigation}/>
                   </View>
               </SafeAreaView>
         </View>
       );
     }

     languageViewRow = ({settingNavigate,propsNavigation}) => {
        return(
              <View style={{margin: 20,backgroundColor:'white',flexDirection:'column',borderRadius:7,borderWidth: 0.4,borderColor: '#828282'}}>
                    <View style={{flexDirection: 'column'}}>
                              <CheckBox containerStyle={{marginTop: 10,backgroundColor: "transparent", borderWidth: 0,alignSelf: 'flex-start'}}
                                        title={this.state.engText}
                                        textStyle={{color:global.LIGHT_GRAY}}
                                        checkedColor={global.LIGHT_GRAY}
                                        onPress={this.onSelectLanguage.bind(this,true,false,"en")}
                                        checked={this.state.isEnSelected}/>
                              <CheckBox containerStyle={{marginTop: 10,backgroundColor: "transparent", borderWidth: 0,alignSelf: 'flex-start'}}
                                        title={this.state.frenchText}
                                        textStyle={{color:global.LIGHT_GRAY}}
                                        checkedColor={global.LIGHT_GRAY}
                                        onPress={this.onSelectLanguage.bind(this,false,true,"fr")}
                                        checked={this.state.isFrSelected}/>
                          <View style={{height: 1,backgroundColor:global.BORDER_COLOR,width: undefined}}/>
                    </View>
              </View>
        );
      }

      onSelectLanguage=(isEnSelected,isFRSelected,languageCode)=>{
          //
          this.setState({isEnSelected: isEnSelected,isFrSelected:isFRSelected,laguageText:(languageCode=='en')?'Change Language':'Changer de langue'
          ,engText:(languageCode=='en')?"English":"Anglais",frenchText:(languageCode=='en')?"French":"Français"})

          //
          DefaultPreference.set('changeLanguage', languageCode)
            .then(function() {});
          //
          this.props.setLanguageCode(languageCode)
          //
          this.onUpdateLanguage(languageCode)
      }
      onUpdateLanguage=(languageCode)=>{
        //
        let requestData={
          "languageCode":(languageCode=='fr')?"1":"0"
        };
        //
        client.post('language',requestData)
        .then((response) => {

         }, (error) => {
               //alert('Change languageCode  '+JSON.stringify(error.response.data));
        });
      }
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
     languageData:state
  }
}

export default connect(mapStateToProps,{setToken,setNotificationCounter,setLanguageCode}) (LanguageComponent);
