import{ SETTOKEN
}from './Types';


export const setToken=(token)=>({
  type:SETTOKEN,
  payload:token
});
