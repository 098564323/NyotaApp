import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
  BackHandler,
  TextInput,
  Navigator
} from 'react-native';
import {Badge} from 'react-native-elements';
import * as global from '../styles/Global';
import FastImage from 'react-native-fast-image';
import {storeCurrentPreference} from '../utils/Utils';
import { SearchBar } from 'react-native-elements';
import { Input } from 'react-native-elements';

class Header extends Component{

    searchIconClick = () => {
            var {navigate} = this.props.headerNavigation;
            navigate('Search')
      }
    notificatinIconClick = () => {
            var {navigate} = this.props.headerNavigation;
            navigate('Notification')
      }
    backButtonPress = () =>{
      this.props.headerNavigation.goBack()
    }

    searchClick = () => {
            var {navigate} = this.props.headerNavigation;
            navigate('Search')
      }

      homeIconClick = () => {
              var {navigate} = this.props.headerNavigation;
              navigate('Dashboard')
        }

      constructor(props) {
            super(props);
            this.state = {
              searchText: '',
            }
          }

    render(){
    return(
            <View style={{flexDirection: 'column'}}>
                  <View style={{width: undefined,height: 45,elevation: 10,justifyContent: 'flex-end',flexDirection: 'row'}}>
                        <Image
                                   resizeMode='cover'
                                   source={require('../../images/backgrounds/home_header_bg.png')}
                                   style={styleHeader.bgStyle}/>
                        <View style={{paddingLeft: 10,
                                      paddingRight: 10,
                                      position: 'absolute',
                                      alignItems: 'center',
                                      flexDirection: 'row',
                                      width: Dimensions.get('window').width,
                                      height: 45}}>
                                {(this.props.isBack)?
                                      <TouchableOpacity onPress={this.backButtonPress}>
                                            <Image source={require('../../images/header/back_arrow_white.png')}
                                                    style={styleHeader.iconStyle}/>
                                      </TouchableOpacity>
                                      :null
                                }
                                {(!this.props.isBack || this.props.isFromSearch)?
                                        <View style={{flex: 1,height: 25,flexDirection: 'row',alignItems: 'center'}}>
                                            <View style={{flex: 1,marginRight: 30,marginLeft: 10,width: undefined,height: 25,flexDirection: 'row',backgroundColor: 'white',alignItems: 'center',borderRadius:5}}>
                                                  <Image  source={require('../../images/header/search_color.png')}
                                                          style={[styleHeader.iconStyle,{marginLeft: 10,width: 15,height: 15}]}/>


                                                  <Input
                                                      placeholder={`${this.props.typeHere}...`}
                                                      multiline={false}
                                                       inputStyle={{fontSize: 13,flex:1}}
                                                       onSubmitEditing={() => {(this.props.headerTitle=='Search')?'':this.props.headerNavigation.navigate('Search',{"product_name":this.state.searchText})}}
                                                         onChangeText={text => this.setState({
                                                           searchText:text
                                                         })}
                                                         value={this.state.searchText}
                                                     />
                                              </View>
                                        </View>
                                        :
                                      <Text style={{marginLeft: 5,flex: 1,color: 'white',fontWeight: 'bold',fontSize: 16}}>{this.props.headerTitle}</Text>
                                }
                                {
                                  (this.props.isSearch)?
                                        <TouchableOpacity onPress={this.searchIconClick.bind(this)}>
                                              <Image source={require('../../images/header/search_white.png')}
                                                      style={[styleHeader.iconStyle,{marginRight: 15}]}/>
                                        </TouchableOpacity>:
                                        null
                                }
                                {
                                  (this.props.isNotification)?
                                      <TouchableOpacity onPress={this.notificatinIconClick.bind(this)}>
                                            <Image source={require('../../images/header/notification_white.png')}
                                                    style={styleHeader.iconStyle}/>

                                      </TouchableOpacity>
                                      :null
                                }

                                {
                                  (this.props.isHome)?
                                      <TouchableOpacity onPress={this.homeIconClick.bind(this)}>
                                            <Image source={require('../../images/header/home.png')}
                                                    style={styleHeader.iconStyle}/>

                                      </TouchableOpacity>
                                      :null
                                }


                        </View>
                        {
                            (this.props.isNotification && this.props.notificationCount!=0)?
                            <Badge onPress={this.notificatinIconClick.bind(this)}
                                   containerStyle={{position: 'absolute',padding:5}}
                                   badgeStyle={{backgroundColor: 'green',alignSelf: 'center'}}
                                   value={this.props.notificationCount} status="error" />
                                   :null
                        }
                  </View>
            </View>

      );
    }

}

Header.propTypes = {
   headerTitle:PropTypes.string,
   typeHere:PropTypes.string,
   headerNavigation:PropTypes.any,
   isNotification:PropTypes.bool,
   isHome:PropTypes.bool,
   isSearch:PropTypes.bool,
   isBack:PropTypes.bool,
   isFromSearch:PropTypes.bool
}

const styleHeader = StyleSheet.create({
  bgStyle:{
    width: Dimensions.get('window').width+60,
    height: undefined
  },
  iconStyle:{
    resizeMode: 'contain',
    width: 20,
    height: 20,
  }

});

export default Header;
