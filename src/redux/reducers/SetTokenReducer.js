import{
  SETTOKEN
} from '../actions/Types';
//
const initialState={
  currentToken:''
}

export default(state=initialState,action)=>{
  switch (action.type) {
    case SETTOKEN:
      return {...state,
              currentToken:action.payload,
      };

    default:
      return state;
  }
}
