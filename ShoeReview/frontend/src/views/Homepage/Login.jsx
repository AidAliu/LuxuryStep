import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './login.css'; // Linking the CSS file

const Login = ({ onSubmit, error, loading, formatError }) => {
    const emailRef = useRef();
    const passwordRef = useRef();

    return (
        <section className="login-section" id="Login">
            <div className="wrapper">
                <div className="form-box login">
                    <h2 className="title">
                        <strong style={{ color: '#178ca4' }}>Log in</strong>
                    </h2>
                    <form onSubmit={onSubmit}>
                        <div className="input-box">
                            <span className="icon">
                                <ion-icon name="mail"></ion-icon>
                            </span>
                            <input ref={emailRef} type="email" name="email" required />
                            <label>Email</label>
                        </div>
                        <div className="input-box">
                            <span className="icon">
                                <ion-icon name="lock-closed"></ion-icon>
                            </span>
                            <input ref={passwordRef} type="password" name="password" required />
                            <label>Password</label>
                        </div>
                        <button type="submit" name="login-submit" className="submit-button">
                            Login
                        </button>
                        {error && <div style={{ color: 'red' }}>{formatError(error)}</div>}
                        {loading && <p>Loading...</p>}
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
