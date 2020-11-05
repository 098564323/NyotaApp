import { combineReducers } from 'redux';
import ApiCallerReducer from './ApiCallerReducer';
import CheckValidationReducers from './CheckValidationReducers';
import SetTokenReducer from './SetTokenReducer';
import setCartCounterReducers from './setCartCounterReducers';
import SearchTextReducers from './SearchTextReducers';
import setNotificationReducers from './setNotificationReducers';
import SetLanguageCodeReducers from './SetLanguageCodeReducers';
import SetLatLongReducers from './SetLatLongReducers';

export default combineReducers({
  apiData:ApiCallerReducer,
  validation:CheckValidationReducers,
  getCurrentToken:SetTokenReducer,
  getCartCounter:setCartCounterReducers,
  getSearchText:SearchTextReducers,
  getNotificationCounter:setNotificationReducers,
  getLanguageCode:SetLanguageCodeReducers,
  getLatitudeLongitude:SetLatLongReducers
});
