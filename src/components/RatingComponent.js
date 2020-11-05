import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  View,
  Text,
  Image,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import { NavigationEvents } from 'react-navigation';
import Header from '../utils/Header';
import DefaultPreference from 'react-native-default-preference';
import * as global from '../styles/Global';
import {setToken} from '../redux/actions/SetTokenActions';
import {connect} from 'react-redux';
import * as Utils from '../utils/Utils';
import FastImage from 'react-native-fast-image';
import NumberFormat from 'react-number-format';
import {BASE_URL} from '../utils/ApiMethods';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
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


class App extends Component {
  state={
      review:'',
  }
  handleReview=(text) => {
    this.setState({review: text})
  }

  constructor(props) {
    super(props);
    client.defaults.headers.common['Authorization'] = (this.props.ratingData.getCurrentToken.currentToken=='-1')?'':'Bearer '+this.props.ratingData.getCurrentToken.currentToken;
    //
    stringsoflanguages.setLanguage((this.props.ratingData.getLanguageCode.languageCode=='en')?'en':'fr');
    //
    this.state = {
      int_position:'',
      starPosition1:false,
      starPosition2:false,
      starPosition3:false,
      starPosition4:false,
      starPosition5:false,
      userComment:'',
      totalRating:0
    };
  }

  onStarRatingPress= (int_position) => {
    //
    if(int_position==1){
      console.log('int_position '+int_position);
    this.setState({
      starPosition1:true,
      starPosition2:false,
      starPosition3:false,
      starPosition4:false,
      starPosition5:false,
      totalRating:1
      })
    }else if(int_position==2){
        this.setState({
          starPosition1:true,
          starPosition2:true,
          starPosition3:false,
          starPosition4:false,
          starPosition5:false,
          totalRating:2
          })
    }else if(int_position==3){
    this.setState({
      starPosition1:true,
      starPosition2:true,
      starPosition3:true,
      starPosition4:false,
      starPosition5:false,
      totalRating:3
      })
    }else if(int_position==4){
    this.setState({
      starPosition1:true,
      starPosition2:true,
      starPosition3:true,
      starPosition4:true,
      starPosition5:false,
      totalRating:4
      })
    }else if(int_position==5){
    this.setState({
      starPosition1:true,
      starPosition2:true,
      starPosition3:true,
      starPosition4:true,
      starPosition5:true,
      totalRating:5
      })
    }
  }

  callAPIfun=()=>{
    //
    if(this.state.totalRating!==0){
          let requestData={
            "product_id":this.props.navigation.state.params.orderData.product_id,
            "comment":this.state.userComment,
            "rating":this.state.totalRating,
            "order_id":this.props.navigation.state.params.orderData.o_id,
          };
          client.post('addcomment',requestData)
          .then((response) => {
                Alert.alert(
                    '',
                    response.data.message,
                    [
                      {text: 'OK', onPress: () => {this.props.navigation.goBack()}},
                    ],
                    {cancelable: false},
                  );
               }, (error) => {
                console.log('Rating screen Error  '+JSON.stringify(error.response.data));
          });
    }else{
      alert(stringsoflanguages.giveRatingToProduct)
    }
  }

  render(){
    const {navigate} = this.props.navigation;
    return (
      <View style={{flexGrow:1}}>
            <NavigationEvents
              onWillFocus={payload => console.log('test')}
              onDidFocus={payload => console.log('test')}
              onWillBlur={payload => console.log('test')}
              onDidBlur={payload => console.log('')}
             />
            <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
            <SafeAreaView style={{flexGrow:1}}>
                <Header headerTitle={stringsoflanguages.rating} headerNavigation={this.props.navigation} isNotification={false} isBack={true} notificationCount={0}/>
                <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,width: Dimensions.get('window').width}}>
                    {
                      (Platform.OS === 'android')?
                                  <this.ratingRowData/>:
                              <KeyboardAvoidingView behavior="padding" enabled>
                                  <this.ratingRowData/>
                              </KeyboardAvoidingView>
                    }
                </View>
            </SafeAreaView>
      </View>
    );
}
      ratingRowData=()=>{
        return(
              <ScrollView>
              <KeyboardAvoidingView behavior="position" enabled>
                <View style={{flexGrow:1,backgroundColor:'#F5F5F5'}}>
                <View style={{flex:0.27,marginVertical:10}}>
                <View style={styles.Rectangle}>
                    <View style={{flex:0.7,flexDirection:'row'}}>
                    <View style={{flex:0.3,justifyContent:'flex-start',marginHorizontal:7}}>
                    <Image  source={{uri:this.props.navigation.state.params.orderData.order_image[0]}}
                                resizeMode='cover'
                                style={{alignSelf:'center',height:100,width:80}}/>
                    </View>
                      <View style={{flex:1,flexDirection:'column'}}>
                            <View style={{flex:1,flexDirection:'column',paddingVertical:9}}>
                                  <Text style={{fontWeight:'bold',fontSize:15}}>{this.props.navigation.state.params.orderData.name}</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'column',paddingVertical:9}}>
                                  <Text style={{color:'grey'}}>{this.props.navigation.state.params.orderData.attribute[0].quantity}</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'column',paddingVertical:9}}>
                                  <NumberFormat value={this.props.navigation.state.params.orderData.attribute[0].price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} renderText={value =>
                                          <Text style={{color:'#38a935',fontWeight:'bold'}}>{`${value} XAF`}</Text>} />
                            </View>
                      </View>
                      </View>
                      <View style={styles.lineStyle}></View>
              {
                (this.props.navigation.state.params.orderStatus=="Delivered")?
                      <View style={{flex:0.4,flexDirection:'row'}}>
                                     <View style={{flex:0.17,justifyContent:'center'}}>
                                           <Image
                                                source={require('../../images/Rating/delivered.png')}
                                                style={{resizeMode:'contain',alignSelf:'center',height:23}}>
                                                </Image>
                                      </View>
                                     <Text style={{fontSize:17,fontWeight:'bold',color:'#38a935',alignSelf:'center'}}>{stringsoflanguages.delivered}</Text>
                       </View>
                       :null
               }
                   </View>
              </View>

                <View style={{flex:0.5,marginHorizontal:16,margin:5}}>
                      <View style={styles.SquareShapeView}>
                              <Text style={{fontSize:18,fontWeight:'bold',marginTop:30,alignSelf:'center'}}>{stringsoflanguages.rateTheProduct}</Text>
                              <View style={{flexDirection:'row',marginTop:10,justifyContent:'center',alignItems:'center',paddingHorizontal:50}}>
                                    <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',flexGrow:1}}>
                                              <TouchableOpacity onPress={() => this.onStarRatingPress(1)} >
                                              <Image source={(this.state.starPosition1)?require('../../images/Rating/filled_start.png'):require('../../images/Rating/star.png')}
                                                    style={{resizeMode:'contain',alignSelf:'center',width:25,height:25}}>
                                               </Image>
                                               </TouchableOpacity>
                                           <Text style={{alignSelf:'flex-end',fontSize:12,color:'grey',marginTop:10,marginHorizontal:5}}>{stringsoflanguages.horribleText}</Text>
                                     </View>
                                     <View style={{flexGrow:1,justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                                               <TouchableOpacity onPress={() => this.onStarRatingPress(2)} >
                                               <Image source={(this.state.starPosition2)?require('../../images/Rating/filled_start.png'):require('../../images/Rating/star.png')}
                                                     style={{resizeMode:'contain',alignSelf:'center',width:25,height:25}}>
                                                </Image>
                                                </TouchableOpacity>
                                            <Text style={{alignSelf:'flex-end',fontSize:12,color:'grey',marginTop:10,marginHorizontal:5}}>{stringsoflanguages.badText}</Text>
                                      </View>
                                      <View style={{flexGrow:1,justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                                                <TouchableOpacity onPress={() => this.onStarRatingPress(3)} >
                                                <Image source={(this.state.starPosition3)?require('../../images/Rating/filled_start.png'):require('../../images/Rating/star.png')}
                                                      style={{resizeMode:'contain',alignSelf:'center',width:25,height:25}}>
                                                 </Image>
                                                 </TouchableOpacity>
                                             <Text style={{alignSelf:'flex-end',fontSize:12,color:'grey',marginTop:10,marginHorizontal:5}} >{stringsoflanguages.goodText}</Text>
                                       </View>
                                       <View style={{flexGrow:1,justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                                                 <TouchableOpacity onPress={() => this.onStarRatingPress(4)} >
                                                 <Image source={(this.state.starPosition4)?require('../../images/Rating/filled_start.png'):require('../../images/Rating/star.png')}
                                                       style={{resizeMode:'contain',alignSelf:'center',width:25,height:25}}>
                                                  </Image>
                                                  </TouchableOpacity>
                                              <Text style={{alignSelf:'flex-end',fontSize:12,color:'grey',marginTop:10,marginHorizontal:5}}>{stringsoflanguages.goodText}</Text>
                                        </View>
                                        <View style={{flexGrow:1,justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                                                  <TouchableOpacity onPress={() => this.onStarRatingPress(5)} >
                                                  <Image source={(this.state.starPosition5)?require('../../images/Rating/filled_start.png'):require('../../images/Rating/star.png')}
                                                        style={{resizeMode:'contain',alignSelf:'center',width:25,height:25}}>
                                                   </Image>
                                                   </TouchableOpacity>
                                               <Text style={{alignSelf:'flex-end',fontSize:12,color:'grey',marginTop:10,marginHorizontal:5}}>{stringsoflanguages.excellentText}</Text>
                                         </View>
                            </View>

                    <View style={{width:Dimensions.get('window').width-40,flex:0.5,marginVertical:15}}>
                            <TextInput style={styles.input}
                                placeholder={stringsoflanguages.moreReviewText}
                                placeholderTextColor = "grey"
                                placeholderStyle={{alignSelf:'flex-start'}}
                                onChangeText={(value) => {this.setState({userComment:value})}}
                                value={this.state.userComment}/>
                    </View>

                    <TouchableOpacity onPress={this.callAPIfun}
                                      style={{alignSelf:'center',height:35,marginTop:65,width:35}}>
                          <Image
                                source={(this.props.ratingData.getLanguageCode.languageCode=='en')?require('../../images/Rating/send.png'):require('../../images/Rating/send_fr.png')}
                                style={{resizeMode:'contain',alignSelf:'center',height:35}}>
                           </Image>
                     </TouchableOpacity>
                </View>
                </View>
                </View>
              </KeyboardAvoidingView>
            </ScrollView>
        );
      }
}

const styles = StyleSheet.create({
  Rectangle: {
      width:Dimensions.get('window').width-40,
       height: 156,
       alignSelf:'center',
             elevation:4,
             backgroundColor: 'white',
    },
    lineStyle:{
      borderColor:'grey',
      borderWidth:0.3,
      borderRadius:0.2,
    },
    SquareShapeView: {
     borderRadius:10,
     width:Dimensions.get('window').width-40,
     alignSelf:'center',
     height: 315,
     elevation:4,
     backgroundColor: 'white',

  },
  input: {
        borderWidth:0.3,
        borderRadius:3,
        elevation:1,
        borderColor:'grey',
        margin: 8,
        height: 95,
        paddingHorizontal:13,
     }
});

mapStateToProps=state=>{
  return{
     ratingData:state
  }
}

export default connect(mapStateToProps,{setToken,setNotificationCounter,setLanguageCode}) (App);
