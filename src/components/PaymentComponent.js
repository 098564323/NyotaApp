import React,{Component} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ActivityIndicator
} from 'react-native';
//
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
//
import { NavigationEvents } from 'react-navigation';
//
import { WebView } from 'react-native-webview';
import {connect} from 'react-redux';
import {reset,getRequest} from '../redux/actions/ApiCallerAction';
import {setToken} from '../redux/actions/SetTokenActions';
import {ABOUT_US,PRIVACY_POLICY,CURRENT_STATE} from '../utils/ApiMethods';
import DefaultPreference from 'react-native-default-preference';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
//
const client = axios.create({
  baseURL: 'https://www.tstcgb.com/',
  responseType: 'json'
});
//
axiosMiddleware(client);
//
class PaymentComponent extends Component{
  constructor(props){
    super(props);
    //
    this.state={
      isSuccess:0,
      paymentURL:'',
      userId:this.props.navigation.state.params.userId,
      orderId:this.props.navigation.state.params.orderId,
      totalAmt:this.props.navigation.state.params.totalAmt
    }
    //
    DefaultPreference.set('paymentAddID', this.props.navigation.state.params.addressId);
  }
  componentDidMount(){
    //https://www.tstcgb.com/switch/tst-switch-paye.php?merchantID=Nyota092019&merchantPWD=Nyota@0001&transID=niota25483&amount=50&action=getID
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    //    
    client.get('switch/tst-switch-paye.php?merchantID=Nyota092019&merchantPWD=Nyota@0001&transID=niota'+'_'+this.state.orderId+'_'+date +''+ month + '' + year + '' + hours + '' + min + '' + sec+'&amount='+this.state.totalAmt+'&action=getID')
    .then((response) => {
            if(response.request._response.split(',')[1]=="Duplicated transID"){
                this.setState({
                  isSuccess:1,
                  paymentURL:''
                })
            }else{
              this.setState({
                isSuccess:2,
                paymentURL:'https://www.tstcgb.com/switch/tst-switch-paye.php?token='+response.request._response.split(',')[1]
              })
            }
         }, (error) => {
           alert(JSON.stringify(error.data))
    });
  }
  render(){
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
                <Header headerTitle="Payment" headerNavigation={this.props.navigation} isBack={true} notificationCount={0}/>
                <View style={{flex:1}}>
                {
                  (this.state.isSuccess==2)?
                        <WebView style={{flexGrow: 1}} source={{ uri: this.state.paymentURL }}/>
                  :(this.state.isSuccess==1)?null:<ActivityIndicator style={{width:60,height:60,alignSelf: 'center'}} size="large" color="#035B00"/>
                }
                </View>
            </SafeAreaView>
      </View>
    )
  }
}

mapStateToProps=state=>{
  return{
     payment:state
  }
}

export default connect(mapStateToProps,{getRequest,reset,setToken,setNotificationCounter})(PaymentComponent);
