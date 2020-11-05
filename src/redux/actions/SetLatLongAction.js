import{ SETLATITUDE,SETLONGITUDE,SETCITY}from './Types';
//
export const setLatitude=(latitude)=>({
  type:SETLATITUDE,
  payload:latitude
});
//
export const setLongitude=(longitude)=>({
  type:SETLONGITUDE,
  payload:longitude
});
//
export const setCityData=(city)=>({
  type:SETCITY,
  payload:city
});
