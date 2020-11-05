import{
    CART_COUNTER
}from './Types';


export const setCartCounter=(cartCounter)=>({
  type:CART_COUNTER,
  payload:cartCounter
});
