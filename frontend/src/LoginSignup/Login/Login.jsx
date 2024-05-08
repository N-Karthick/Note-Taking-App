import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginDetails } from '../../redux/action';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  const handleLoginClick = async (e) => {
    e.preventDefault();
     dispatch(userLoginDetails({ email, password }));
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
            {error && <h1 className="error-message">{error}</h1>}
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
      </div>
    </div>
  );
};

export default Login;
