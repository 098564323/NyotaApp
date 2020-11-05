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
  PermissionsAndroid,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
//
import Header from '../utils/Header';
import * as global from '../styles/Global';
import * as Utils from '../utils/Utils';
import FastImage from 'react-native-fast-image';
//
import {connect} from 'react-redux';
import {setToken} from '../redux/actions/SetTokenActions';
import {postRequest,reset,getRequest} from '../redux/actions/ApiCallerAction';
import {UPDATEPROFILE,CHANGEPASSWORD} from '../utils/ApiMethods';
import {checkNumber,checkPassword,newPassword,rePassword,checkReset,checkName,resetPassword} from '../redux/actions/CheckValidationAction';
//
import DefaultPreference from 'react-native-default-preference';
import { NavigationEvents } from 'react-navigation';
import { CameraKitCameraScreen,CameraKitGalleryView } from 'react-native-camera-kit';
import ImagePicker from 'react-native-image-picker';
import {setNotificationCounter} from '../redux/actions/SetNotificationCounter';
//
import ImageResizer from 'react-native-image-resizer';
//
import {setLanguageCode} from '../redux/actions/SetLanguageCodeAction';
import stringsoflanguages from '../../stringsoflanguages';
//
import {BASE_URL} from '../utils/ApiMethods';
import axios from 'axios';
//
var isAvailable=false
var userToken=''

//
const takePhoto = async () => {
    try {
      const photo = await this.camera.takePictureAsync();
    }catch (error) {
    }
};
//
class UpdateProfileComponent extends Component{
       //
       constructor(props){
         super(props)
         //
         stringsoflanguages.setLanguage((this.props.updateProfile.getLanguageCode.languageCode=='en')?'en':'fr');
         //
         this.props.reset();
         this.props.checkReset();
         //
         this.onBottomButtonPressed = this.onBottomButtonPressed.bind(this);
         //
         this.changePassword = this.changePassword.bind(this);
         this.updateProfileData = this.updateProfileData.bind(this);
         this.state={
            isPermitted: false,
            name:'',
            isCamClick:false,
            imageURI:'',
            sendURIToServer:'',
            userName:this.props.navigation.state.params.profileData.name,
            userPhoneNo:this.props.navigation.state.params.profileData.phone_no,
            isUserNameValid:true,
            isPhoneNoValid:true
          }
          //
          DefaultPreference.get('userToken').then(function(value) {
            userToken = value
            return value;
          });
          this.onPress()
      }
    //
    checkUserPhoneNo = (inputText) =>{
      this.setState({
        userPhoneNo:inputText
      })
      if(inputText.length.toString() >= 6 && inputText.length.toString() <= 10){
        this.setState({
          isPhoneNoValid:true
        })
      }else{
        this.setState({
          isPhoneNoValid:false
        })
      }
    }
    //
    checkUserName = (inputText) => {
      //
      this.setState({
        userName:inputText
      })
      //
      if(inputText === ''){
        this.setState({
          isUserNameValid:false
        })
      }else{
        this.setState({
          isUserNameValid:true
        })
      }
  }

  onPress() {
    var that = this;
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'CameraExample App Camera Permission',
              message: 'CameraExample App needs access to your camera ',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If CAMERA Permission is granted
            //Calling the WRITE_EXTERNAL_STORAGE permission function
            requestExternalWritePermission();
          } else {
            alert('CAMERA permission denied');
          }
        } catch (err) {
          alert('Camera permission err', JSON.stringify(err));
          console.warn(err);
        }
      }
      async function requestExternalWritePermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'CameraExample App External Storage Write Permission',
              message:
                'CameraExample App needs access to Storage data in your SD Card ',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If WRITE_EXTERNAL_STORAGE Permission is granted
            //Calling the READ_EXTERNAL_STORAGE permission function
            requestExternalReadPermission();
          } else {
            alert('WRITE_EXTERNAL_STORAGE permission denied');
          }
        } catch (err) {
          alert('Write permission err', err);
          console.warn(err);
        }
      }
      async function requestExternalReadPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'CameraExample App Read Storage Read Permission',
              message: 'CameraExample App needs access to your SD Card ',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If READ_EXTERNAL_STORAGE Permission is granted
            //changing the state to re-render and open the camera
            //in place of activity indicator
            that.setState({ isPermitted: true });
          } else {
            alert('READ_EXTERNAL_STORAGE permission denied');
          }
        } catch (err) {
          alert('Read permission err', err);
          console.warn(err);
        }
      }
      //Calling the camera permission function
      requestCameraPermission();
    } else {
      this.setState({ isPermitted: true });
    }
  }
   takePhoto = async () => {
       try {
         const photo = await this.camera.capture(true);
         Alert.alert(
           event.type,
           JSON.stringify(photo),
           [{ text: stringsoflanguages.okText, onPress: () => this.setState({isCamClick:false}) }],
           { cancelable: false }
         );
       } catch (error) {
       }

   };

  onBottomButtonPressed(event) {
       const captureImages = JSON.stringify(event.captureImages);
         if (event.type === 'left') {
           this.setState({isCamClick:false})
         }else if(event.type === 'right'){
           this.setState({isCamClick:false})
         } else {
           this.setState({
              imageURI:'file://'+event.captureImages[0].uri,
              sendURIToServer:'file://'+event.captureImages[0].uri,
              isUpdateProfile:false
           })
         }
   }
       //
      render(){
        //
        const {navigate} = this.props.navigation;
        //
        if(this.props.updateProfile.apiData.isFetchning===false
          && this.props.updateProfile.apiData.data.data!==undefined
          && isAvailable){
            Alert.alert(
                '',
                this.props.updateProfile.apiData.data.message,
                [
                  {text: stringsoflanguages.okText, onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
            isAvailable=false
            this.props.reset()
            this.props.resetPassword()
          }
          if(this.props.updateProfile.apiData.error.status!==undefined){
            alert(this.props.updateProfile.apiData.error.message);
            this.props.reset()
            this.props.resetPassword()
          }
        if(!this.state.isCamClick){
              return(
                <View style={{flexGrow:1}}>
                      <NavigationEvents
                        onWillFocus={payload => {this.props.checkReset()}}
                        onDidFocus={payload => console.log('')}
                        onWillBlur={payload => {this.props.reset()}}
                        onDidBlur={payload => {isAvailable = false,this.props.reset(),this.props.checkReset()}}
                       />
                      <SafeAreaView style={{flexshrink:0,backgroundColor:global.LIGHT_YELLOW}}/>
                      <SafeAreaView style={{flexGrow:1}}>
                          <Header headerTitle={stringsoflanguages.updateProfile} headerNavigation={this.props.navigation} isBack={true} notificationCount={0} isHome={true} />
                          <View style={{flexGrow:1,flexBasis: 0,backgroundColor:global.APP_BG,width: Dimensions.get('window').width}}>
                                {(Platform.OS === 'android')?
                                            <this.updateProfileView/>:
                                        <KeyboardAvoidingView behavior="padding" enabled>
                                            <this.updateProfileView/>
                                        </KeyboardAvoidingView>
                                }
                          </View>
                      </SafeAreaView>
                </View>
              );
         }else{
           return (

              <CameraKitGalleryView
                    ref={gallery => this.gallery = gallery}
                    style={{flex: 1, marginTop: 20}}
                    minimumInteritemSpacing={10}
                    minimumLineSpacing={10}
                    columnCount={3}
                    onTapImage={event => {
                      alert(''+event.nativeEvent.selected)
                    }}

                  />


           );
         }
      }

    updateProfileView = ()=>{
      return(
        <ScrollView>
              <View style={{flexShrink: 0,flexDirection: 'column',marginTop: 20}}>
                    <View style={{borderRadius: 400/ 2,alignSelf: 'center',alignSelf: 'center',borderColor: 'grey'}}>
                            {
                              (this.props.navigation.state.params.profileData.image.length===0 && this.state.imageURI==='')
                                    ?<Image source={require('../../images/profile/default_user_01.png')}
                                                  resizeMode='cover'
                                                  style={{width: 120,height: 120,borderRadius: 400/ 2}}/>
                                    :
                                    (this.state.imageURI != '')?
                                    <Image source={{uri:this.state.imageURI}}
                                                  style={{width: 120,height: 120,borderRadius: 400/ 2}}/>:
                                    <Image source={{uri:this.props.navigation.state.params.profileData.image}}
                                                  resizeMode='cover'
                                                  style={{width: 120,height: 120,borderRadius: 400/ 2}}/>
                            }
                    </View>
                    <View style={{position: 'absolute',marginTop: 90,marginLeft: Dimensions.get('window').width/2+30}}>
                          <TouchableOpacity onPress={this.chooseFile.bind(this)}>
                                <Image source={require('../../images/profile/camera.png')}
                                        style={{width: 25,height: 25}}/>
                          </TouchableOpacity>
                    </View>
                    <View style={[(Platform.OS==='ios')?styles.viewShadowIOS:styles.viewShadowAndroid,{backgroundColor: 'white',flexDirection: 'column',borderRadius: 5,paddingBottom: 15,paddingTop: 7,paddingHorizontal: 15,margin:20}]}>
                                <TextInput style={[styles.row,{paddingTop:7,paddingBottom: 7,color:(this.state.isUserNameValid)?global.DARK_GREEN:'red'}]}
                                           placeholderTextColor="#000"
                                           onChangeText={(value) => this.checkUserName(value)}
                                           value={this.state.userName}/>
                          <View style={{height: 1,backgroundColor: global.BORDER_COLOR,width: Dimensions.get('window').width-70}}/>
                                <TextInput style={[styles.row,{paddingTop:7,paddingBottom: 7,marginTop: 5,color:(this.state.isPhoneNoValid)?global.DARK_GREEN:'red'}]}
                                           placeholderTextColor="#000"
                                           maxLength={10}
                                           keyboardType='numeric'
                                           onChangeText={(value) => this.checkUserPhoneNo(value)}
                                           value={this.state.userPhoneNo}/>
                          <View style={{height: 1,backgroundColor: global.BORDER_COLOR,width: Dimensions.get('window').width-70}}/>
                                <Text style={[styles.row,{paddingTop:7,paddingBottom: 7,marginTop: 5,color: 'grey'}]}>{this.props.navigation.state.params.profileData.email_address}</Text>
                          <View style={{height: 1,backgroundColor: global.BORDER_COLOR,width: Dimensions.get('window').width-70}}/>

                          <View style={{marginTop:15}}>
                                                    {
                                                      (this.state.isUpdateProfile)?
                                                      <ActivityIndicator/>:
                                                        <View style={styles.update_btn}>
                                                        <TouchableOpacity  onPress={this.updateProfileData}>
                                                             <Text style={{alignSelf:'center',color:'white',margin:4}}>{stringsoflanguages.updateText}</Text>
                                                         </TouchableOpacity>
                                                        </View>
                                                      }
                          </View>
                    </View>
                    <View style={[(Platform.OS==='ios')?styles.viewShadowIOS:styles.viewShadowAndroid,{backgroundColor: 'white',flexDirection: 'column',borderRadius: 5,elevation: 10,margin: 20,marginTop:5}]}>
                          <Text style={{padding:15}}>{stringsoflanguages.changePassword}</Text>
                          <View style={{height: 1,backgroundColor: global.DARK_GRAY,width: Dimensions.get('window').width-40}}/>
                          <View style={{flexDirection: 'column',padding: 15}}>
                                <TextInput style={[styles.row,{paddingTop:5,paddingBottom: 5,color:(this.props.updateProfile.validation.isPasswordValid)?global.DARK_GREEN:'red'}]}
                                          onChangeText={(value) => this.props.checkPassword(value)}
                                          value={this.props.updateProfile.validation.passwordText}
                                          autoCapitalize = 'none'
                                          secureTextEntry={true}
                                          placeholder={stringsoflanguages.currentPassword}/>
                                <View style={{height: 1,backgroundColor: global.BORDER_COLOR,width: Dimensions.get('window').width-70}}/>
                                <TextInput style={[styles.row,{paddingTop:5,paddingBottom: 5,marginTop: 7,color:(this.props.updateProfile.validation.isNewPasswordValid)?global.DARK_GREEN:'red'}]}
                                          onChangeText={(value) => this.props.newPassword(value)}
                                          value={this.props.updateProfile.validation.newPasswordText}
                                          autoCapitalize = 'none'
                                          secureTextEntry={true}
                                          placeholder={stringsoflanguages.newPassword}/>
                                <View style={{height: 1,backgroundColor: global.BORDER_COLOR,width: Dimensions.get('window').width-70}}/>
                                <TextInput style={[styles.row,{paddingTop:5,paddingBottom: 5,marginTop: 7,color:(this.props.updateProfile.validation.isRePasswordValid)?global.DARK_GREEN:'red'}]}
                                           onChangeText={(value) => this.props.rePassword(value)}
                                           value={this.props.updateProfile.validation.rePasswordText}
                                           autoCapitalize = 'none'
                                           secureTextEntry={true}
                                           autoCapitalize = 'none'
                                           secureTextEntry={true}  placeholder={stringsoflanguages.reEnterPassword}/>
                                <View style={{height: 1,backgroundColor: global.BORDER_COLOR,width: Dimensions.get('window').width-70}}/>
                          </View>

                          <TouchableOpacity onPress={this.changePassword}>
                               <View style={[styles.update_btn,{marginBottom:15}]}>
                                    <Text style={{alignSelf:'center',color:'white',margin:4}}>{stringsoflanguages.updateText}</Text>
                               </View>
                          </TouchableOpacity>
                    </View>
              </View>
              </ScrollView>
      );
    }
    chooseFile = () => {
      var options = {
        title: 'Select Image',
        storageOptions: {
          skipBackup: false,
          path: 'images',
        },
      };

      ImagePicker.showImagePicker(options, response => {
        //
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        } else {
          let source=response;
          if(Platform.OS === 'android'){
              ImageResizer.createResizedImage(response.uri, 200, 200, 'JPEG', 50, 0, null).then((newResponse) => {
                this.setState({
                  imageURI:newResponse.uri,
                  sendURIToServer:newResponse.uri
                })
              }).catch((err) => {
              });
        }else{
              ImageResizer.createResizedImage(response.uri, 200, 200, 'JPEG', 50, 0, null).then((newResponse) => {
                this.setState({
                  imageURI:newResponse.uri,
                  sendURIToServer:newResponse.uri
                })
              }).catch((err) => {
              });
          }
        }
      });
    };
    changePassword=()=>{
          if(this.props.updateProfile.validation.isPasswordValid
            && this.props.updateProfile.validation.isNewPasswordValid
            && this.props.updateProfile.validation.isRePasswordValid){
              if(this.props.updateProfile.validation.newPasswordText == this.props.updateProfile.validation.rePasswordText){
                let requestData = {
                 "old_password":this.props.updateProfile.validation.passwordText,
                 "new_password":this.props.updateProfile.validation.newPasswordText,
                };
                //
                isAvailable=true
                //
                this.props.postRequest(CHANGEPASSWORD,requestData);
              }else{
                alert(stringsoflanguages.passwordDoesntMatch)
              }
          }else{
              alert(stringsoflanguages.afamapmh6c)
          }
      }

    updateProfileData=()=>{
          //
          this.setState({
            isUpdateProfile:true
          })
          //
          let options = {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': 'Bearer '+userToken,
            },
            method: 'POST'
          };
          options.body = new FormData();
          if(this.state.imageURI != ''){
              options.body.append('image', {
                  uri: this.state.imageURI,
                  type: '*/*',
                  name: 'userProfile.jpg',
              });
          }
          //
          options.body.append('name',this.state.userName);
          options.body.append('phonenumber',this.state.userPhoneNo);
          //'application/x-www-form-urlencoded'
          console.log('option '+JSON.stringify(options.body));
          fetch(BASE_URL+'updateprofile', options)
          .then(response => response.json())
          .then(success => {
            Alert.alert(
                '',
                success.message,
                [
                  {text: stringsoflanguages.okText, onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
            this.setState({
              isUpdateProfile:false
            })
          },
          (error) => {
              alert('error' +JSON.stringify(error))
              this.setState({
                isUpdateProfile:false
              })
          })
          .catch(error =>console.log(''));
    }
}




const styles = StyleSheet.create({
  viewShadowIOS:{
    shadowOffset:{  width: 10,  height: 10,  },
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,

  },
  viewShadowAndroid:{
    elevation: 10
  },
  profileImgContainer: {
      alignSelf:'center',
      borderRadius: 400/ 2,
    },
    rectangle1: {
    width:Dimensions.get('window').width-50,
    height: 200,
    alignSelf:'center',
    borderColor:'grey',
    borderWidth: 0.7,
    backgroundColor: 'white',
  },
  rectangle2: {
  width:Dimensions.get('window').width-50,
  height: 210,
  alignSelf:'center',
  borderColor:'grey',
  borderWidth: 0.7,
  backgroundColor: 'white',
},
lineStyle:{
       borderWidth: 0.5,
       borderColor:'grey',
  },
  lineStyle1:{
        marginHorizontal:20,
        borderWidth: 0.5,
         borderColor:'grey',
    },
  input: {
       margin: 15,
       height: 40,
       borderColor: '#7a42f4',
       borderWidth: 1
    },
    row:{
      marginTop:1
    },

    update_btn:{
     marginHorizontal:20,
     alignSelf:'center',
     width: 150 * 2,
    height: 30,
    marginBottom:5,
    backgroundColor: '#38a935'
   }
});


mapStateToProps=state=>{
  return{
     updateProfile:state
  }
}

export default connect(mapStateToProps,
  {checkReset,
    postRequest,
    reset,
    checkNumber,
    checkName,
    checkPassword,
    newPassword,
    resetPassword,
    setToken,
    setNotificationCounter,
    setLanguageCode,
    rePassword})(UpdateProfileComponent);
