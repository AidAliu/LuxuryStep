import React, { useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './register.css'; // Import the CSS file

const Register = () => {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const firstNameRef = useRef(); // Added ref for First Name
    const lastNameRef = useRef(); // Added ref for Last Name
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const firstName = firstNameRef.current.value; 
        const lastName = lastNameRef.current.value; 

        try {
            const response = await axios.post('http://localhost:8000/api/register/', {
                username: name,
                email: email,
                password: password,
                firstName: firstName, 
                lastName: lastName, 
            });

            console.log('User registered:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Error registering user', error.response ? error.response.data : error);
        }
    };
    
    return (
        <section className="register-section">
            <div className="wrapper">
                <div className="form-box shadow">
                    <div className="card-body">
                        <h2 className="text-center mb-4">Register</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Username Field */}
                            <div className="input-box mb-3">
                                <label htmlFor="name" className="form-label">
                                </label>
                                <input
                                    ref={nameRef}
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Username"
                                    required
                                />
                            </div>

                            {/* First Name Field */}
                            <div className="input-box mb-3">
                                <label htmlFor="first-name" className="form-label">
                                </label>
                                <input
                                    ref={firstNameRef}
                                    type="text"
                                    className="form-control"
                                    id="first-name"
                                    placeholder="First name"
                                    required
                                />
                            </div>

                            {/* Last Name Field */}
                            <div className="input-box mb-3">
                                <label htmlFor="last-name" className="form-label">
                                </label>
                                <input
                                    ref={lastNameRef}
                                    type="text"
                                    className="form-control"
                                    id="last-name"
                                    placeholder="Last name"
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <div className="input-box mb-3">
                                <label htmlFor="email" className="form-label">
                                </label>
                                <input
                                    ref={emailRef}
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="input-box mb-3">
                                <label htmlFor="password" className="form-label">
                                </label>
                                <input
                                    ref={passwordRef}
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="submit-button btn btn-primary w-100">
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
