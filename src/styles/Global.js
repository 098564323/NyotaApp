import {StyleSheet,Platform,Dimensions} from 'react-native';
import * as Utils from '../utils/Utils';
//Dark Green
export const DARK_GREEN = '#035B00';
//Light Green
export const LIGHT_GREEN = '#38a935';
//Dark Yellow
export const DARK_YELLOW = '#ba7a01';
//Light Yellow
export const LIGHT_YELLOW = '#c68404';
//Dark Gray
export const DARK_GRAY = '#626161';
//Ligth Gray
export const LIGHT_GRAY = '#828282';
//App Backgroud color
export const APP_BG = "#F5F5F5";
//Border Line color
export const BORDER_COLOR = "#BCBBBB";

//Common Style
export const COMMON_STYLES = StyleSheet.create({

  bgStyle:{
    flexGrow: 1,
    backgroundColor: '#FF0000'
  },
  backgroundImg:{
          height: Platform.OS === 'ios' ? Utils.heightPercentageToDP('100%') : Utils.heightPercentageToDP('130%'),
          width:Utils.widthPercentageToDP('100%'),
          resizeMode:'stretch',
          position:'absolute',
          marginTop:Platform.OS === 'ios'? 0 : 0
  },
  appImageBGUserMod:{
        resizeMode:'contain',
        width:Utils.widthPercentageToDP('65%'),
        height:Utils.heightPercentageToDP('65%')
  },
  textInputUserMod:{
        width:Dimensions.get('window').width-100,
        marginLeft:20,
        marginTop:10,
        height:50,
        flexDirection:'row',
        alignItems:'center',
        borderRadius:50,
        backgroundColor:'#FCF8F0',
        borderWidth: 1,
        borderColor: '#F8F3EB'
  }

});
