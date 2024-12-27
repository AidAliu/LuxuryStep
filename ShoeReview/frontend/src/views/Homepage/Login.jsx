// file: src/pages/Login.jsx

import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    try {
      // Get tokens from /api/login/
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Check staff status
      const meResponse = await axios.get('http://127.0.0.1:8000/api/me/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      setLoading(false);

   
      if (meResponse.data.is_staff) {
        navigate('/controlpanel');
      } else {
        navigate('/');
      }

    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error.response?.data?.detail || 'Invalid credentials.'
      );
    }
  };

  return (
    <section className="login-section">
      <div className="wrapper">
        <div className="form-box login">
          <h2 className="title">
            <strong style={{ color: '#178ca4' }}>Log in</strong>
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                ref={usernameRef}
                type="text"
                name="username"
                placeholder="Username"
                required
              />
            </div>
            <div className="input-box">
              <input
                ref={passwordRef}
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              {loading ? 'Loading...' : 'Login'}
            </button>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
          </form>
          <div className="login-register">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="register-link">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
