import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginDetails, userNotes } from '../../redux/action';
import './Login.css';
import { Alert } from '@mui/material';

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error) || {};
  const successMessage = useSelector((state) => state.loginResponse);
  const token = useSelector((state) => state.token);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  console.log("error-----=>",error)

  const handleLoginClick = async (e) => {
    if ( !email || !password) {
      setShowErrorAlert(true);
      setTimeout(() => {
         setShowErrorAlert(false);
      }, 2000);
    } else {
      e.preventDefault();
       dispatch(userLoginDetails({ email, password }));
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        dispatch(userNotes());
        console.log('dispatch to notes---->',dispatch(userNotes(
          { email: email }
         )))
        navigate('/Notes')
      }, 2000);
    }
   };
 

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login Form</h2>
        <form onSubmit={handleLoginClick}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>
        <div className="signup-link">
          <h4>Not registered yet?</h4>
          <Link to="/Signup">Sign Up Here</Link><br />
          {/* <Link to="/flights">Home</Link> */}
        </div>
        {/* {error.message  &&(
          <Alert
            sx={{ zIndex: 10, display: 'flex', position: 'absolute', left: '80px', bottom: '521px' }}
            severity="warning"
          >
            {error.message}
            
          </Alert>
        )}   */}
            {showSuccessMessage && (
          <Alert
            // icon={<CheckIcon fontSize="inherit" />}
            sx={{ zIndex: 10, display: 'flex', position: 'absolute', left: '42rem', bottom: '37rem' }}
          >
            {successMessage.message}
          </Alert>
        )}        
        {showErrorAlert && (
          <Alert
            sx={{ zIndex: 10, display: 'flex', position: 'absolute', left: '40rem', bottom: '37rem' }}
            severity="warning"
          >
            All Fields Required...
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Login;
