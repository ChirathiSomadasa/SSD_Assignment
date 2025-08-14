import { useState } from 'react';
import React from 'react';
import { Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

function Login() {

  const [cookies, setCookies, removeCookies] = useCookies(['auth_email', 'auth_password']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinishLogin = (values) => {
    setLoading(true);

    // Send form data to backend API
    axios
      .post('http://localhost:5001/user/login', values)
      .then((response) => {
        setLoading(false);
        var data = response.data;
        var status = data.status;
        // Check the backend response
        if (status === 'success') {
          // Save token or user data in localStorage or context
          localStorage.setItem('email', response.data.email); // Example: saving user email
          // You can add more user information in localStorage if necessary
          setCookies("auth_email", response.data.email);
          setCookies("auth_password", response.data.password);
          navigate('/'); // Redirect to the dashboard or homepage after successful login
        } else if (status === 'invalid_user') {
          const message = data.message;
          alert(message);
        } else {
          alert(JSON.stringify(data));
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Error - " + error);
      });
  };

  return (
    <div className='bg-image-login'>
      <div className='authentication-login'>
        <div className='authentication-form-login card p-2'>
          <h1 className='card-title'>LOGIN</h1>

          <Form className='login-form-credentials' layout='vertical' onFinish={onFinishLogin}>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please input your Email!',
                },
              ]}
            >
              <Input className='login_input' placeholder='Email' />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!',
                },
              ]}
            >
              <Input.Password className='login_input' placeholder='Password' type='password' />
            </Form.Item>

            <button className='primary-button-login' type='submit' disabled={loading}>
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>

            <p className='para'>
              Don't have an account? <Link to='/signup' className='anchor'>SIGN UP</Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
