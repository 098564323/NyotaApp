import{
    FETCHING_DATA,
    FETCHING_SUCCESS,
    FETCHING_FAILURE,
    RESET
} from '../actions/Types';

import DefaultPreference from 'react-native-default-preference';
var currentState = ''

const initialState = {
  isFetchning:false,
  data:[],
  error:[],
  screenName:''
}

export default(state=initialState,action)=>{
  DefaultPreference.get('currentState').then(function(value) {
    currentState = value
  });
  switch (action.type) {
    case FETCHING_DATA:
      return {...state,isFetchning:true};
    case FETCHING_SUCCESS:
      return {...state,isFetchning:false,data:action.payload,screenName:currentState};
    case FETCHING_FAILURE:
      return {...state,isFetchning:false,error:action.payload,screenName:currentState};
    case RESET:
      return state = initialState;
    default:
      return state;
  }
}
