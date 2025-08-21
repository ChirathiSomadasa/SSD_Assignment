// src/pges/SignUp.js
import { useState } from 'react';
import { Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
    const navigate = useNavigate();

    const onFinishSignIn = (values) => {
        axios.post('http://localhost:5001/register', values)
            .then((response) => {
                const data = response.data;
                if (data.status === 'success') {
                    alert("Registration successful! Please log in.");
                    navigate('/login');
                } else {
                    alert(data.message || 'Registration failed');
                }
            })
            .catch((error) => {
                alert("Error: " + (error.response?.data?.message || error.message));
            });
    };

    // Redirect to backend Google OAuth (Sign up or Login)
    const handleGoogleSignUp = () => {
        window.location.href = 'http://localhost:5001/auth/google';
    };

    const validatePhoneNumber = (rule, value, callback) => {
        const phoneNumberPattern = /^\d{10}$/;
        if (!phoneNumberPattern.test(value)) {
            callback('Please enter a valid 10-digit phone number');
        } else {
            callback();
        }
    };

    const validateEmail = (rule, value, callback) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            callback('Please enter a valid email address');
        } else {
            callback();
        }
    };

    const validatePassword = (rule, value, callback) => {
        if (value && value.length < 4) {
            callback('Password must be at least 4 characters');
        } else {
            callback();
        }
    };

    const validateName = (rule, value, callback) => {
        const namePattern = /^[a-zA-Z]+$/;
        if (!namePattern.test(value)) {
            callback('Please enter only letters');
        } else {
            callback();
        }
    };

    return (
        <div className="bg-image">
            <div className="authentication">
                <div className="authentication-form card p-2">
                    <h1 className="card-title">CREATE AN ACCOUNT</h1>

                    <Form className='signup-form-credentials' layout="vertical" onFinish={onFinishSignIn}>
                        <Form.Item label="First Name" name="first_name" rules={[{ required: true }, { validator: validateName }]}>
                            <Input className="signup_input" placeholder="First Name" />
                        </Form.Item>
                        <Form.Item label="Last Name" name="last_name" rules={[{ required: true }, { validator: validateName }]}>
                            <Input className="signup_input" placeholder="Last Name" />
                        </Form.Item>
                        <Form.Item label="Contact Number" name="mobile_number" rules={[{ required: true }, { validator: validatePhoneNumber }]}>
                            <Input className="signup_input" placeholder="Contact Number" />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true }, { validator: validateEmail }]}>
                            <Input className="signup_input" placeholder="Email" />
                        </Form.Item>
                        <Form.Item label="City" name="city" rules={[{ required: true }]}>
                            <Input className="signup_input" placeholder="City" />
                        </Form.Item>
                        <Form.Item label="Password" name="password" rules={[{ required: true }, { validator: validatePassword }]}>
                            <Input.Password className="signup_input" placeholder="Password" />
                        </Form.Item>
                        <Form.Item name="confirm" label="Confirm Password" dependencies={['password']} hasFeedback
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password className="signup_input" placeholder="Confirm Password" />
                        </Form.Item>
                        <button className="primary-button" type="submit">SIGN UP</button>


                    </Form>
                        {/* Divider */}
                        <div className="divider-container">
                            <div className="divider-line"></div>
                            <span className="divider-text">or</span>
                            <div className="divider-line"></div>
                        </div>

                        {/* Google Sign-Up Button */}
                        <button className="google-signup-btn" onClick={handleGoogleSignUp}>
                            <span className="google-icon">
                                <img src="https://www.google.com/favicon.ico" alt="Google" width="18" height="18" />
                            </span>
                            <span className="google-text">Sign up with Google</span>
                        </button>

                        <p className="para">
                            Already have an account? <Link to="/login" className="anchor">LOGIN</Link>
                        </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;