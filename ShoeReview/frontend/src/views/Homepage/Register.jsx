import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './register.css';

const Registration = ({ onSubmit }) => {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    return (
        <>
            <section className="register-section" id="Register">
                <div className="wrapper" style={{ marginTop: '200px' }}>
                    <div className="form-box register">
                        <h2 className="title">Registration</h2>
                        <form onSubmit={onSubmit}>
                            {/* Name Field */}
                            <div className="input-box">
                                <span className="icon">
                                    <ion-icon name="person"></ion-icon>
                                </span>
                                <input ref={nameRef} type="text" name="name" required />
                                <label>Name</label>
                            </div>

                            {/* Email Field */}
                            <div className="input-box">
                                <span className="icon">
                                    <ion-icon name="mail"></ion-icon>
                                </span>
                                <input ref={emailRef} type="email" name="email" required />
                                <label>Email</label>
                            </div>

                            {/* Password Field */}
                            <div className="input-box">
                                <span className="icon">
                                    <ion-icon name="lock-closed"></ion-icon>
                                </span>
                                <input ref={passwordRef} type="password" name="password" required />
                                <label>Password</label>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" name="register-submit" className="submit-button">
                                Register
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="login-shift">
                            <p>
                                Back to{' '}
                                <button
                                    className="login-link"
                                    style={{
                                        background: 'none',
                                        textDecoration: 'none',
                                        border: 'none',
                                    }}
                                >
                                    <Link to="/login">Log in</Link>
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Registration;
