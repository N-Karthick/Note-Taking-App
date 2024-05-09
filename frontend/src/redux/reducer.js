import {
  OTP_REQUEST, OTP_SUCCESS, OTP_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE,
  SIGNUPRESPONSE_SUCCESS, SIGNUPRESPONSE_FAILURE,
  LOGINRESPONSE_SUCCESS, LOGINRESPONSE_FAILURE,

} from './actionTypes'

const initialState = {
  users: [],
  error: null,
  loginDetails: [],
  userDetails: [],
  loading: false,
  signinResponse: { message: '' },
  loginResponse: { message: '' },

};

const userTrip = (state = initialState, action) => {
  switch (action.type) {

    case OTP_REQUEST:
    case LOGIN_REQUEST:
    case SIGNUP_REQUEST:
      return { ...state, loading: false, error: null };

    case OTP_SUCCESS:
      return {
        ...state,
        users: action.payload,
        error: null,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        userDetails: action.payload,
        error: null,
      }
    case SIGNUPRESPONSE_SUCCESS:
      return {
        ...state,
        signinResponse: { message: action.payload.message },
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        userLoginDetails: action.payload,
        error: null,
      };
    case LOGINRESPONSE_SUCCESS:
      return {
        ...state,
        loginResponse: { message: action.payload.message },
        error: null,
      };
    case SIGNUPRESPONSE_FAILURE:
      return {
        ...state,
        signinResponse: null,
        error: { message: action.payload.error },
      }
    case LOGINRESPONSE_FAILURE:
      return {
        ...state,
        loginResponse: null,
        error: { message: action.payload.error },
      }
    case OTP_FAILURE:
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default userTrip;
