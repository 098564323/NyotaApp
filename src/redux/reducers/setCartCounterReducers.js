import{
  CART_COUNTER
} from '../actions/Types';



const initialState={
  cartCounter:0
}

export default(state=initialState,action)=>{
  switch (action.type) {
    case CART_COUNTER:
      return {...state,
              cartCounter:action.payload,
      };

    default:
      return state;
  }
}
