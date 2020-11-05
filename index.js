/**
 * @format
 */

import {AppRegistry,AsyncStorage,AppState,Alert} from 'react-native';
import React from 'react';
//
import { createAppContainer,NavigationActions } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
//
import SplashComponent from './src/components/SplashComponent';
import LoginComponent from './src/components/LoginComponent';
import ForgotPassword from './src/components/ForgotPassword';
import RegisterComponent from './src/components/RegisterComponent';
import DashBoardComponent from './src/components/DashBoardComponent';
import CategoryComponent from './src/components/CategoryComponent';
import CartComponent from './src/components/CartComponent';
import ProfileComponent from './src/components/ProfileComponent';
import CategoryDetailComponent from './src/components/CategoryDetailComponent';
import NotificationComponent from './src/components/NotificationComponent';
import SettingComponent from './src/components/SettingComponent';
import WhishListComponent from './src/components/WhishListComponent';
import UpdateProfileComponent from './src/components/UpdateProfileComponent';
import OrderHistoryComponent from './src/components/OrderHistoryComponent';
import PrivacyAboutUsComponent from './src/components/PrivacyAboutUsComponent';
import TestComponent from './src/components/TestComponent';
import AddressComponent from './src/components/AddressComponent';
import AddAddressComponent from './src/components/AddAddressComponent';
import OrderConfirmComponent from './src/components/OrderConfirmComponent';
import SearchComponent from './src/components/SearchComponent';
import CurrentOrderComponent from './src/components/CurrentOrderComponent';
import RatingComponent from './src/components/RatingComponent';
import SimilarProductComponent from './src/components/SimilarProductComponent';
import SingleProductListingComponent from './src/components/SingleProductListingComponent';
import SimilarProductCategoryComponent from './src/components/SimilarProductCategoryComponent';
import DashBaordCategoryComponent from './src/components/DashBaordCategoryComponent';
import ChatComponent from './src/components/ChatComponent';
import PaymentComponent from './src/components/PaymentComponent';
import PaymentModeComponent from './src/components/PaymentModeComponent';
import LanguageComponent from './src/components/LanguageComponent';
import SubCategoryComponent from './src/components/SubCategoryComponent';
import ProductSubCategoryComponent from './src/components/ProductSubCategoryComponent';
import UpdateOrderComponent from './src/components/UpdateOrderComponent';
//
import bgMessage from './src/components/bgMessage';
//
import {name as appName} from './app.json';
//
import { Provider } from 'react-redux';
import { createStore,applyMiddleware,bindActionCreators } from 'redux';
import thunk from 'redux-thunk';
import reducers from './src/redux/reducers';
//
import firebase from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';
//
import {setNotificationCounter} from './src/redux/actions/SetNotificationCounter';
import {setCartCounter} from './src/redux/actions/cartCounterAction';
import {connect} from 'react-redux';
//
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
//
import {BASE_URL} from './src/utils/ApiMethods';
//
import Flurry from 'react-native-flurry-sdk';
//
console.disableYellowBox = true;
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
axiosMiddleware(client);
// import {setCartCounter} from './src/redux/actions/cartCounterAction';
// import {connect} from 'react-redux';
// import {setToken} from './src/redux/actions/SetTokenActions';
import DefaultPreference from 'react-native-default-preference';
//
new Flurry.Builder()
  .withCrashReporting(true)
  .withLogEnabled(true)
  .withLogLevel(Flurry.LogLevel.DEBUG)
  .build('JD26KYCM8YQDYR8K588D', 'JMJHR8G7KPFDBCYTM9CH');
//
const AppNavigator = createStackNavigator({
    Splash: { screen : SplashComponent},
    Login: { screen: LoginComponent },
    ForgotPassword: { screen: ForgotPassword },
    Register : {screen : RegisterComponent},
    Dashboard: { screen : DashBoardComponent },
    Category:{ screen : CategoryComponent},
    CategoryDetail:{screen: CategoryDetailComponent},
    Cart : {screen : CartComponent },
    ProfileComponent: { screen : ProfileComponent },
    Notification: { screen : NotificationComponent },
    Settings: { screen : SettingComponent },
    WishList: { screen : WhishListComponent },
    UpdateProfile: { screen : UpdateProfileComponent },
    OrderHistory: { screen : OrderHistoryComponent },
    PrivactAboutUs:{screen :PrivacyAboutUsComponent},
    Address:{screen :AddressComponent},
    AddAddress:{screen :AddAddressComponent},
    OrderConfirm:{screen:OrderConfirmComponent},
    Search:{screen:SearchComponent},
    CurrentOrder:{screen:CurrentOrderComponent},
    RatingComponent:{screen:RatingComponent},
    TestCom: { screen : TestComponent },
    SimilarProduct:{screen:SimilarProductComponent},
    SingleProductListing:{screen:SingleProductListingComponent},
    SimilarPCC:{screen:SimilarProductCategoryComponent},
    dashRowCC:{screen:DashBaordCategoryComponent},
    chatcc:{screen:ChatComponent},
    paymentCC:{screen:PaymentComponent},
    paymentMode:{screen:PaymentModeComponent},
    languageCC:{screen:LanguageComponent},
    subCategoryCC:{screen:SubCategoryComponent},
    ProductSubCategory:{screen:ProductSubCategoryComponent},
    updateOrder:{screen:UpdateOrderComponent},
  },
  {
    initialRouteName: 'Splash',
    headerMode: 'none',
    transitionConfig: () => ({ screenInterpolator: () => null})
  },
);
//
let NavigationView = createAppContainer(AppNavigator);
//
//export default
class ReduxExampleApp extends React.Component {
  //
  navigator: any;
  state = {
    appState: AppState.currentState
  }
  //
  store = createStore(reducers,applyMiddleware(thunk));
  constructor(props) {
    super(props)
    const { dispatch } = props
    this.boundActionCreators = bindActionCreators({setNotificationCounter}, dispatch)
  }
  componentDidMount(){
    //
    var that = this
    //
    AppState.addEventListener('change', this._handleAppStateChange);
    //
    const channelId = new firebase.notifications.Android.Channel("nyotaApp", "nyotaApp",
    firebase.notifications.Android.Importance.High);
    firebase.notifications().android.createChannel(channelId);
    //
    // this.notificationListener = firebase.notifications().onNotification((notification) => {
    //     console.log('recevied '+JSON.stringify(notification));
    //     alert(JSON.stringify(notification))
    // });

      this.notificationListener =
        firebase.notifications().onNotificationOpened((notificationOpen) => {
            // alert(this.navigator)
            // this.props.navigator.push({
            //   title: "Notification",
            //   component: NotificationComponent,
            // });

        });

      this.messageListener = firebase.messaging().onMessage((message) => {
            // Process your message as required
            if(message.data.title=='Payment'){
              //order_id & address_id
              //alert(JSON.stringify(message.data))
              //console.log('paymentAddID '+JSON.stringify(message.data));
              //

              //
              DefaultPreference.get('paymentAddID').then(function(value) {
                  //
                  new Promise(function(resolve, reject) {
                      resolve(value);
                  }).then(value => {
                    that.updateOrderAPI(message.data.body,value,that.store.getState().getCurrentToken.currentToken.toString(),that.store.getState().getLanguageCode.languageCode.toString())
                  });
              });
              //console.log('paymentAddID token '+this.store.getState().getCurrentToken.currentToken.toString());
              //

              //
              // Alert.alert(
              //    '',
              //    notification.body,
              //    [{ text: 'OK', onPress: () => this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Dashboard'})) }],
              //    { cancelable: false }
              // );
              //
            }else{
                  let notification_to_be_displayed = new  firebase.notifications.Notification({
                                                              data: "",
                                                              sound: 'default',
                                                              show_in_foreground: true,
                                                              title: message.data.title,
                                                              body: message.data.body,
                                                          });
                  if(Platform.OS == "android") {
                      notification_to_be_displayed
                      .android.setPriority(firebase.notifications.Android.Priority.High)
                      .android.setAutoCancel(true)
                      .android.setChannelId("nyotaApp")
                      .android.setVibrate(1000);
                  }

                  firebase.notifications().displayNotification(notification_to_be_displayed);
                  //
                  var that = this
                  //
                  DefaultPreference.get('notificationCounter').then(function(value) {
                      //
                      if(value!==undefined && value!==null){
                        new Promise(function(resolve, reject) {
                            resolve(Number(value));
                        }).then(value => {
                          DefaultPreference.set('notificationCounter',(value+1).toString())
                          new Promise(function(resolve, reject) {
                              resolve(value);
                          }).then(value => {
                            that.store.dispatch(setNotificationCounter(value+1));
                          });
                        });
                      }else{
                        new Promise(function(resolve, reject) {
                            resolve(1);
                        }).then(value => {
                          DefaultPreference.set('notificationCounter',value.toString())
                          new Promise(function(resolve, reject) {
                              resolve(value);
                          }).then(value => {
                            that.store.dispatch(setNotificationCounter(value));
                          });
                        });
                      }
                      //
                  });
                  //
           }
    });
  }
  //


  componentWillUnmount() {
    // this is where you unsubscribe notification listner
   this.notificationListener();

   //
   AppState.removeEventListener('change', this._handleAppStateChange);
  }
  //
  updateOrderAPI = (orderId,addressId,userToken,languageCode) =>{
    //
    alert(languageCode)
    //
    client.defaults.headers.common['Authorization'] = 'Bearer '+userToken
    //
    let requestData={
      "order_id":orderId,
      "address_id":addressId,
      "languageCode":(languageCode=='fr')?"1":"0"
    };
    //
    client.post('addorder',requestData)
    .then((response) => {
         //alert('response '+JSON.stringify(response))
         DefaultPreference.clear('cartCounterValue')
         this.store.dispatch(setCartCounter(0));
         //
         Alert.alert(
            '',
            (languageCode=='fr')?'Paiement réussi':'Payment Successfully',
            [{ text: 'OK', onPress: () => this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Dashboard'})) }],
            { cancelable: false }
         );
     }, (error) => {
         //alert('error '+JSON.stringify(error.data))
    });
    //
  }

  callLocationAPI=()=>{

  }

  //
  _handleAppStateChange = (nextAppState) => {

    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      //
      var that = this;
      let { dispatch } = that.props
      //that.props.setNotificationCounter(12)
      DefaultPreference.get('notificationCounter').then(function(value) {
          //
          //alert(value)
          //
          if(value!==undefined && value!==null){
              new Promise(function(resolve, reject) {
                  resolve(value);
              }).then(value => {
                that.store.dispatch(setNotificationCounter(value));
              });
          }
      });
      //
    }else{
    //  console.log('App has come to the background!'+this.store.getState().getCartCounter.cartCounter)
      DefaultPreference.set('cartCounterValue', this.store.getState().getCartCounter.cartCounter.toString())
        .then(function() {
          //console.log('added success');
        });
    }
    this.setState({appState: nextAppState});
  }
  //
  render() {
    let { todos } = this.props
    return (
      <Provider store={this.store} todos={todos} {...this.boundActionCreators}>
        <NavigationView ref={nav => { this.navigator = nav; }}/>
      </Provider>
    );
  }
}
mapStateToProps=state=>{
  return{
     indexData:state
  }
}
export default connect(mapStateToProps,{setNotificationCounter,setCartCounter})(ReduxExampleApp);
//
AppRegistry.registerComponent(appName, () => ReduxExampleApp);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessage);
