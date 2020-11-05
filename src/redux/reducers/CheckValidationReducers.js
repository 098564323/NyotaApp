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
} from '../actions/Types';

import {emailValidation,checkBlankField,checkPasswordValidation,checkNumberValidation} from '../../utils/Utils';

const initialState={
  isEmailValid:false,
  isPasswordValid:false,
  isEmailBlank:false,
  isPasswordBlank:false,
  isCityBlank:false,
  isNameBlank:false,
  isNumberBlank:false,
  isNumberValid:false,
  isNewPassword:false,
  isNewPasswordValid:false,
  isRePassword:false,
  isRePasswordValid:false,
  emailText:'',
  passwordText:'',
  cityText:'',
  nameText:'',
  numberText:'',
  newPasswordText:'',
  rePasswordText:''
}

export default(state=initialState,action)=>{
  switch (action.type) {
    case CHECK_EMAIL:
      return {...state,
              isEmailBlank:checkBlankField(action.payload),
              isEmailValid:emailValidation(action.payload),
              emailText:action.payload
      };
    case CHECK_PASSWORD:
      return {...state,
              isPasswordBlank:checkBlankField(action.payload),
              isPasswordValid:checkPasswordValidation(action.payload),
              passwordText:action.payload
      };
    case CHECK_CITY:
      return {...state,
              isCityBlank:checkBlankField(action.payload),
              cityText:action.payload
      };
    case CHECK_NAME:
      return {...state,
              isNameBlank:checkBlankField(action.payload),
              nameText:action.payload
      };
    case CHECK_NUMBER:
      return {...state,
              isNumberBlank:checkBlankField(action.payload),
              isNumberValid:checkNumberValidation(action.payload),
              numberText:action.payload
      };
    case PROFILE_NEW_PASSWORD:
      return {...state,
              isNewPassword:checkBlankField(action.payload),
              isNewPasswordValid:checkPasswordValidation(action.payload),
              newPasswordText:action.payload
      };
    case PROFILE_RE_PASSWORD:
      return {...state,
              isRePassword:checkBlankField(action.payload),
              isRePasswordValid:checkPasswordValidation(action.payload),
              rePasswordText:action.payload
      };
    case CHECK_RESET:
      return state = initialState;
    case RESET_PASSWORD:
      return {...state,
              passwordText:'',
              newPasswordText:'',
              rePasswordText:''
      };
    default:
      return state;

  }
}
