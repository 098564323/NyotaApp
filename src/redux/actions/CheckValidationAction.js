import{
    CHECK_EMAIL,
    CHECK_PASSWORD,
    CHECK_CITY,
    CHECK_NAME,
    CHECK_NUMBER,
    CHECK_RESET,
    PROFILE_NEW_PASSWORD,
    PROFILE_RE_PASSWORD,
    RESET_PASSWORD
}from './Types';


export const checkEmail=(emailText)=>({
  type:CHECK_EMAIL,
  payload:emailText
});

export const checkPassword=(passwordText)=>({
  type:CHECK_PASSWORD,
  payload:passwordText
});

export const checkCity=(cityText)=>({
  type:CHECK_CITY,
  payload:cityText
});

export const checkName=(nameText)=>({
  type:CHECK_NAME,
  payload:nameText
});

export const checkNumber=(numberText)=>({
  type:CHECK_NUMBER,
  payload:numberText
});

export const checkReset=()=>({
  type:CHECK_RESET
});

export const resetPassword=()=>({
  type:RESET_PASSWORD
});

export const newPassword=(newPasswordText)=>({
  type:PROFILE_NEW_PASSWORD,
  payload:newPasswordText
});

export const rePassword=(rePasswordText)=>({
  type:PROFILE_RE_PASSWORD,
  payload:rePasswordText
});
