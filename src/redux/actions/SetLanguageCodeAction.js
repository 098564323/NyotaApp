import{
    SETLANGUAGECODE
}from './Types';


export const setLanguageCode=(code)=>({
  type:SETLANGUAGECODE,
  payload:code
});
