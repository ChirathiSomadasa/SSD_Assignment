// src/components/Login.js
import { useState } from 'react';
import { Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

function Login() {
    const [cookies, setCookies] = useCookies(['auth_email']);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinishLogin = (values) => {
        setLoading(true);

        axios.post('http://localhost:5001/login', values)
            .then((response) => {
                setLoading(false);
                const data = response.data;

                if (data.status === 'success') {
                    // Store JWT in localStorage for general use
                    localStorage.setItem('token', data.token);
                    setCookies('auth_email', data.email, { path: '/' });

                    if (data.user_type === 'admin') {
                        // Also store token in admin_token cookie for admin validation
                        setCookies('admin_token', data.token, { path: '/' });

                        // Redirect admin to admin panel (port 3001)
                        window.location.href = 'http://localhost:3001/';
                    } else {
                        // Normal user navigate to home
                        navigate('/');
                    }
                }

            })
            .catch((error) => {
                setLoading(false);
                alert("Error: " + (error.response?.data?.message || error.message));
            });
    };

    // Redirect to backend Google OAuth
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5001/auth/google';
    };

    return (
        <div className='bg-image-login'>
            <div className='authentication-login'>
                <div className='authentication-form-login card p-2'>
                    <h1 className='card-title'>LOGIN</h1>

                    <Form className='login-form-credentials' layout='vertical' onFinish={onFinishLogin}>
                        <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Please input your Email!' }]}>
                            <Input className='login_input' placeholder='Email' />
                        </Form.Item>
                        <Form.Item label='Password' name='password' rules={[{ required: true, message: 'Please input your Password!' }]}>
                            <Input.Password className='login_input' placeholder='Password' />
                        </Form.Item>
                        <button className='primary-button-login' type='submit' disabled={loading}>
                            {loading ? 'Logging in...' : 'LOGIN'}
                        </button>
                    </Form>

                    {/* Divider */}
                    <div className="divider-container">
                        <div className="divider-line"></div>
                        <span className="divider-text">or</span>
                        <div className="divider-line"></div>
                    </div>

                    {/* Google Button */}
                    <button className="google-login-btn" onClick={handleGoogleLogin}>
                        <span className="google-icon">
                            <img src="https://www.google.com/favicon.ico" alt="Google" width="18" height="18" />
                        </span>
                        <span className="google-text">Continue with Google</span>
                    </button>

                    <p className='para'>
                        Don't have an account? <Link to='/signup' className='anchor'>SIGN UP</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;