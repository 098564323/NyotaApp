import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text
} from 'react-native';


const DemoRow =({name,age,isNameOrAge})=>{
  return(
        <View>
              {
                isNameOrAge ?
                            <Text>{name}</Text>
                            :
                            <Text>{age}</Text>
              }
        </View>
  );
};

// class DemoRow extends Component{
//
//     render(){
//       return(
//             <View>
//                   {
//                     this.props.isNameOrAge ?
//                                 <Text>{this.props.name}</Text>
//                                 :
//                                 <Text>{this.props.age}</Text>
//                   }
//                   {/*<Text>{this.props.name}</Text>*/}
//             </View>
//       );
//     }
// }
//
// DemoRow.propTypes = {
//   name:PropTypes.string,
//   age:PropTypes.number,
//   isNameOrAge:PropTypes.bool
// }



export default DemoRow;
