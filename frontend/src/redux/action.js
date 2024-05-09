
import axios from 'axios';
import {
  OTP_REQUEST, OTP_SUCCESS, OTP_FAILURE,
  TRIP_REQUEST, TRIP_SUCCESS, TRIP_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  SIGNUP_SUCCESS, SIGNUP_REQUEST, SIGNUP_FAILURE,
  SIGNUPRESPONSE_SUCCESS,  SIGNUPRESPONSE_FAILURE,
  LOGINRESPONSE_SUCCESS,  LOGINRESPONSE_FAILURE,
  NOTESRESPONSE_REQUEST,NOTESRESPONSE_SUCCESS,NOTESRESPONSE_FAILURE,
  ADDNOTERESPONSE_REQUEST,ADDNOTERESPONSE_SUCCESS,ADDNOTERESPONSE_FAILURE
} from './actionTypes'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000'
});

const otpRequest = () => ({ type: OTP_REQUEST });
const addNoteResponseRequest = () => ({ type:  ADDNOTERESPONSE_REQUEST });
const otpSuccess = (user) => ({ type: OTP_SUCCESS, payload: user });
const loginRequest = () => ({ type: LOGIN_REQUEST });
const SigupRequest = () => ({ type: SIGNUP_REQUEST });
const NotesResponseRequest = () => ({ type: NOTESRESPONSE_REQUEST });

const loginSuccess = (loginDetails) => ({ type: LOGIN_SUCCESS, payload: loginDetails });


export const SigupResponseSuccess = (message) => ({
  type: SIGNUPRESPONSE_SUCCESS,
  payload: { message },
});

export const SigupResponseFailure = (error) => ({
  type: SIGNUPRESPONSE_FAILURE,
  payload: { error },
});

export const LoginResponseSuccess = (message) => ({
  type: LOGINRESPONSE_SUCCESS,
  payload: { message },
});

export const LoginResponseFailure = (error) => ({
  type: LOGINRESPONSE_FAILURE,
  payload: { error },
});

export const NotesResponseSuccess = (notesData) => ({
  type: NOTESRESPONSE_SUCCESS,
  payload: { notesData },
});

export const NotesResponseFailure = (error) => ({
  type: NOTESRESPONSE_FAILURE,
  payload: { error },
});

export const AddNotesResponseSuccess = (addNotesData) => ({
  type: ADDNOTERESPONSE_SUCCESS,
  payload: { addNotesData },
});

export const AddNotesResponseFailure = (error) => ({
  type: ADDNOTERESPONSE_FAILURE,
  payload: { error },
});

export const userLoginDetails = (credentials) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await axiosInstance.post('/Login', credentials);
      dispatch(loginSuccess(response.data));
      const message = response.data.message;
      dispatch(LoginResponseSuccess(message));
      console.log("RES====>", response.data)
      const {email , name, token,id } = response.data;    
      localStorage.setItem('token', token);
      localStorage.setItem('email',email);
      localStorage.setItem('userId',id);
    } catch (error) {
      dispatch(LoginResponseFailure(error.response.data.error));
      console.log('-----LoginResponseFailure---->',error.response.data.error)
    }
  };
};


export const getOtp = (credentials) => {
  return async (dispatch) => {
    dispatch(otpRequest());
    try {
      const response = await axiosInstance.post('/getOTP', credentials);
      dispatch(otpSuccess(response.data));  
      const message = response.data.message;
      console.log('Response from backend:', message); 
      dispatch(SigupResponseSuccess(message));
    } catch (error) {
      // dispatch(otpFailure(error.message));
      dispatch(SigupResponseFailure(error.response.data.error));
      console.log('-----SigupResponseFailure---->',error.response.data.error)
    }
  };
};

export const userSigninDetails = (userDetails) => {
  return async (dispatch) => {
    dispatch(SigupRequest());
    try {
      const response = await axiosInstance.post('/Signup', userDetails);
      const message = response.data.message;
      console.log('Response from backend:', message); 
      dispatch(SigupResponseSuccess(message));
    } catch (error) {
      dispatch(SigupResponseFailure(error.response.data.error));
      console.log('-----SigupResponseFailure---->',error.response.data.error)
    }
  }
}

export const userNotes = (email) => {
  return async (dispatch, getState) => {
    dispatch(NotesResponseRequest());
    console.log("============1",NotesResponseRequest)
    try {
      const token = getState().token; 
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, 
        } };
      
    console.log("============2",NotesResponseRequest);
      const response = await axiosInstance.get('/Notes', config);
      const notes = response.data; 
      console.log("============response",response,notes);
      dispatch(NotesResponseSuccess(notes));
    } catch (error) {
      dispatch(NotesResponseFailure(error.response.data.error));
      console.log('-----NotesResponseFailure---->', error.response.data.error);
    }
  };
};

export const addNotes = (title, note) => {
  return async (dispatch, getState) => {
    dispatch(addNoteResponseRequest());

    try {
      const token = getState().token; 
      const email = localStorage.getItem('email');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const data = { title, note, email }; 
      const response = await axiosInstance.post('/addNotes', data, config); 
      dispatch(AddNotesResponseSuccess());
      console.log('Notes added successfully:', response.data);
    } catch (error) {
      dispatch(AddNotesResponseFailure(error.response.data.error));
      console.log('Error adding notes:', error.response.data.error);
    }
  };
};