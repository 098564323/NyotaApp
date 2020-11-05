import{
  SETLANGUAGECODE
} from '../actions/Types';



const initialState={
  languageCode:''
}

export default(state=initialState,action)=>{
  switch (action.type) {
    case SETLANGUAGECODE:
      return {...state,
              languageCode:action.payload,
      };

    default:
      return state;
  }
}
