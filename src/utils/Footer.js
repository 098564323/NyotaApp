import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import {Badge} from 'react-native-elements';
import * as global from '../styles/Global';
import DefaultPreference from 'react-native-default-preference';
import {storeCurrentPreference} from './Utils'
//
import {reset} from '../redux/actions/ApiCallerAction';
import {connect} from 'react-redux';
//
class Footer extends Component{
    constructor(props){
      super(props);
      this.state = {tabPos: this.props.screenPos};
    }

    changeValue = (tabVal) => {
      //
      if(this.state.tabPos!=3)
          this.props.reset()
      //
      switch(tabVal) {
        case 1:
              storeCurrentPreference('Dashboard')
              this.props.footerNavigate('Dashboard')
        break;
        case 2:
               storeCurrentPreference('Category')
               this.props.footerNavigate('dashRowCC',{isFromUpdateOrder:'false'})
        break;
        case 3:
            if(this.state.tabPos!=3){
              storeCurrentPreference('Cart')
              this.props.footerNavigate('Cart')
            }else{
              console.log('Else Footer '+this.state.tabPos);
            }
        break;
        case 4:
              storeCurrentPreference('ProfileComponent')
              this.props.footerNavigate('ProfileComponent')
        break;
        case 5:
              storeCurrentPreference('chatcc')
              this.props.footerNavigate('chatcc')
        break;
        default:
            Alert.alert("NUMBER NOT FOUND");
      }
    }

    render(){
      return(
            <View style={{flexDirection: 'column',justifyContent: 'flex-end'}}>

                  <View style={{width: undefined,height: 45,elevation: 10,backgroundColor: 'white',flexDirection: 'row'}}>
                        <View style={styles.bgStyle}>
                              <TouchableOpacity onPress={this.changeValue.bind(this,1)}>
                                      {this.state.tabPos===1?
                                              <Image source={require('../../images/footer/home_selected.png')}
                                                      style={styles.imaegStyle}/>
                                              :<Image source={require('../../images/footer/home.png')}
                                                      style={styles.imaegStyle}/>
                                      }
                              </TouchableOpacity>
                        </View>
                        <View style={styles.bgStyle}>
                              <TouchableOpacity onPress={this.changeValue.bind(this,2)}>
                                      {this.state.tabPos===2?
                                              <Image source={require('../../images/footer/category_selected.png')}
                                              style={styles.imaegStyle}/>
                                              :<Image source={require('../../images/footer/category.png')}
                                                      style={styles.imaegStyle}/>
                                      }
                              </TouchableOpacity>
                        </View>
                        <View style={{flexGrow:2}}>

                        </View>
                        <View style={styles.bgStyle}>
                              {
                                (Number(this.props.footerCartCounter) != 0)?
                                        <Badge containerStyle={{paddingLeft: 5,position: 'absolute',justifyContent: 'flex-start',alignItems: 'flex-end',width: 30,height: 40}}
                                               badgeStyle={{backgroundColor: 'green',width: 22,height: 22}}
                                               value={Number(this.props.footerCartCounter)} status="error" />:null
                              }
                              <TouchableOpacity onPress={this.changeValue.bind(this,3)}>
                                        {this.state.tabPos===3?
                                                <Image source={require('../../images/footer/cart_selected.png')}
                                                style={styles.imaegStyle}/>
                                                :<Image source={require('../../images/footer/cart.png')}
                                                        style={styles.imaegStyle}/>
                                        }
                              </TouchableOpacity>

                        </View>
                        <View style={styles.bgStyle}>
                              <TouchableOpacity onPress={this.changeValue.bind(this,4)}>
                                        {this.state.tabPos===4?
                                                <Image source={require('../../images/footer/user_selected.png')}
                                                style={styles.imaegStyle}/>
                                                :<Image source={require('../../images/footer/user.png')}
                                                        style={styles.imaegStyle}/>
                                        }
                              </TouchableOpacity>
                        </View>
                        <View style={{position: 'absolute',marginLeft: Dimensions.get('window').width/2-30,alignSelf: 'center'}}>
                              <TouchableOpacity onPress={this.changeValue.bind(this,5)}>
                                            <Image source={require('../../images/footer/chat-w-bg.png')}
                                            style={{resizeMode: 'contain',marginBottom: 20,width: 70,height: 70}}/>
                              </TouchableOpacity>
                        </View>
                  </View>
            </View>

      );
    }

}

Footer.propTypes = {
   screenPos:PropTypes.number,
   footerNavigate:PropTypes.any,
   footerCartCounter:PropTypes.number
}

const styles = StyleSheet.create({
  imaegStyle:{
    resizeMode: 'contain',
    width: 25,
    height: 25,

  },
  bgStyle:{
    flexGrow:1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

mapStateToProps=state=>{
  return{
     state
  }
}

export default connect(mapStateToProps,{reset})(Footer);
