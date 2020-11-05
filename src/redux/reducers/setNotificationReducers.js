import{
  NOTIFICATION_COUNTER
} from '../actions/Types';



const initialState={
  notificatinCounter:''
}

export default(state=initialState,action)=>{
  switch (action.type) {
    case NOTIFICATION_COUNTER:
      return {...state,
              notificatinCounter:action.payload,
      };

    default:
      return state;
  }
}
