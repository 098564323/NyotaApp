import{
    FETCHING_DATA,
    FETCHING_SUCCESS,
    FETCHING_FAILURE,
    RESET
} from './Types';
import DefaultPreference from 'react-native-default-preference';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
//
import {BASE_URL} from '../../utils/ApiMethods';
//
const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json'
});
//
axiosMiddleware(client);

export const fetching=()=>({
  type:FETCHING_DATA
});

export const success=(response)=>({
  type:FETCHING_SUCCESS,
  payload:response
});

export const failure=(error)=>({
  type:FETCHING_FAILURE,
  payload:error
});

export const reset=()=>({
  type:RESET
});


export const getRequest = (methodName)=>{
  //
  DefaultPreference.get('userToken').then(function(value) {
    client.defaults.headers.common['Authorization'] = (value=='-1')?'':'Bearer '+value;
    return value;
  });
  return async dispatch => {
        dispatch(reset())
        dispatch(fetching())
        await client.get(methodName)
        .then((response) => {
               return dispatch(success(response.data));
           }, (error) => {
               return  dispatch(failure(error.response.data));
        });
   }
}

export const postRequest = (methodName,requestData)=>{
  //
  DefaultPreference.get('userToken').then(function(value) {
    client.defaults.headers.common['Authorization'] = (value=='-1')?'':'Bearer '+value;
    return value;
  });
  //
  return async dispatch => {
        dispatch(reset())
        dispatch(fetching())
        await client.post(methodName,requestData)
        .then((response) => {
               return dispatch(success(response.data));
           }, (error) => {
               return  dispatch(failure(error.response.data));
        });
  }
}
