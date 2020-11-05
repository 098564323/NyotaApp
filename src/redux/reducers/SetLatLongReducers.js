import{SETLATITUDE,SETLONGITUDE,SETCITY} from '../actions/Types';

const initialState={
  currentLatitude:'',
  currentLongitude:'',
  city:''
}

export default(state=initialState,action)=>{
  switch (action.type) {

    case SETLATITUDE:
      return {...state,
              currentLatitude:action.payload,
      };

    case SETLONGITUDE:
      return {...state,
              currentLongitude:action.payload,
      };
    case SETCITY:
      return {...state,
              city:action.payload,
      };
    default:
      return state;
  }
}
