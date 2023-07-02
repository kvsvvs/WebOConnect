import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

const Login = (props) => {
  const API_BASE_URL = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();

    if (json.success) {
      localStorage.setItem('token', json.authToken);
      props.onAuthentication(true);
      const token = localStorage.getItem('token');

      await fetch(`${API_BASE_URL}attendance/fetchAttendance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
      });

      navigate('/dashboard');
    } else {
      setErrorMessage(json.message);
      console.log(errorMessage);
      alert('Invalid credentials');
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='login'>
      <div className='OuterContainer'>
        <div className='InnerContainer'>
          <form onSubmit={handleSubmit} className='LoginForm'>
            <div className='floating-label-content'>
              <input
                type='email'
                className='floating-input'
                value={credentials.email}
                onChange={onChange}
                id='email'
                placeholder=' '
                name='email'
                aria-describedby='emailHelp'
              />
              <label htmlFor='email' className='floating-label'>
                Email
              </label>
              {/* <div id='emailHelp' className={style1.TextC}>
            We'll never share your email with anyone else.
          </div> */}
            </div>
            <div className='floating-label-content'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='floating-input'
                value={credentials.password}
                onChange={onChange}
                placeholder=' '
                name='password'
                id='password'
              />
              <label htmlFor='password' className='floating-label'>
                Password
              </label>
              <div className='input-group-append'>
                <button
                  className='PasswordVisibilityBtn'
                  type='button'
                  onClick={togglePasswordVisibility}
                  style={{ zIndex: '5' }}
                >
                  <i
                    className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                  />
                </button>
              </div>
            </div>

            <button type='submit' className='nwt-btn-primarry w-100'>
              Login
            </button>
          </form>
          <button
            className='ForgotPasswordBtn'
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </button>

          {/* <div className={style1.SignupDiv}>
        <p className={style1.TextA}>Are you new here? &nbsp;</p>
         <Link className={style1.SignUpBtn} to='/signup' role='button'>
          Signup
        </Link>
      </div> */}
          {errorMessage && (
            <div className='alert alert-danger mt-3' role='alert'>
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
