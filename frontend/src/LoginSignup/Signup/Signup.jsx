import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOtp, userSigninDetails } from '../../redux/action';
import { Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import '../Signup/Signup.css';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.loading);
  const successMessage = useSelector((state) => state.signinResponse);
  const error = useSelector((state) => state.error);
  console.log("--->", successMessage)
  console.log("--->", error)

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleVerify = async () => {
    if (!name || !email || !phone || !password) {
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 2000);
    } else {
      dispatch(getOtp({ email, password }));
      setOtpSent(true);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!otp) {
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 2000);
    } else {
      dispatch(
        userSigninDetails({
          name,
          email,
          phone,
          password,
          otp,
        }),
        setShowSuccessMessage(true),
      setTimeout(() => { 
        setShowSuccessMessage(false);
        navigate('/')
      }, 2000)
      );
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h2>Sign Up</h2>
      </div>
      <div className="signup-form" style={{ backgroundImage: 'linear-gradient(#ffffff, #f3eeee4d, #a9a4a4, #000' }}>
        <form onSubmit={handleSignup}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />

          <label htmlFor="phone">Mobile</label>
          <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your mobile number" />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />

          {!otpSent && (
            <button type="button" onClick={handleVerify} className="submit-btn">
              Verify
            </button>
          )}

          {otpSent && (
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP"
              />
            </div>
          )}

          {otpSent &&
            <button type="submit" className="signup-submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          }
        </form>
        <div className="login-link">
          <p>Already have an account? <Link to="/">Login here</Link></p>
        </div>
        {showSuccessMessage && (
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            sx={{ zIndex: 10, display: 'flex', position: 'absolute', left: '80px', bottom: '563px' }}
          >
            {successMessage.message}
          </Alert>
        )}
        { error && (
          <Alert
            sx={{ zIndex: 10, display: 'flex', position: 'absolute', left: '80px', bottom: '521px' }}
            severity="warning"
          >
            Email or Mobile Number Already Exists...
            
          </Alert>
        )}

        {showErrorAlert && (
          <Alert
            sx={{ zIndex: 10, display: 'flex', position: 'absolute', left: '80px', bottom: '420px' }}
            severity="warning"
          >
            All Fields Required...
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Signup;
