import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/defaultAvatar.svg';
import { message } from 'antd';

const CreateUser = () => {
  const API_BASE_URL = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
    profile_pic: defaultAvatar,
  });

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'cpassword') {
      setIsConfirmPasswordValid(e.target.value === credentials.password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, avatar, phone, gender } = credentials;

    const body = new FormData();
    body.append('name', name);
    body.append('email', email);
    body.append('password', password);
    body.append('phone', phone);
    body.append('gender', gender);
    body.append('avatar', avatar);

    // Fetch token from localStorage
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      setErrorMessage('No auth token in localStorage. Please log in again.');
      return;
    }

    // Include the token in the headers
    const headers = new Headers();
    headers.append('auth-token', authToken);

    // Make the POST request with headers including the token
    const response = await fetch(`${API_BASE_URL}auth/createuser`, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    const json = await response.json();

    // Check if there was an error
    if (response.status >= 400 && response.status < 600) {
      if (json.error) {
        setErrorMessage(json.error);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
      return;
    }

    if (response.status >= 400 && response.status < 600) {
      if (json.error) {
        setErrorMessage(json.error);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
      return;
    }

    // Show success message
    message.success('User successfully added!');

    setCredentials({
      name: '',
      email: '',
      password: '',
      cpassword: '',
    });

    navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <div className='Signup'>
        <div className='OuterContainer'>
          <div className='InnerContainer2'>
            <div className='FormContainer'>
              <h2 className='mb-4'>Register with WebOConnect</h2>
              <form onSubmit={handleSubmit} className='Form'>
                <div className='inputPair'>
                  <div className='inputWrapper'>
                    <label htmlFor='name' className='label-small'>
                      Name
                    </label>
                    <input
                      type='text'
                      placeholder='Name'
                      name='name'
                      id='name'
                      value={credentials.name}
                      onChange={handleInputChange}
                      className=''
                    />
                  </div>
                  <div className='inputWrapper'>
                    <label htmlFor='email' className='label-small'>
                      Email
                    </label>
                    <input
                      type='email'
                      placeholder='Email'
                      name='email'
                      id='email'
                      value={credentials.email}
                      onChange={handleInputChange}
                      className=''
                    />
                  </div>
                </div>
                <div className='inputPair'>
                  <div className='inputWrapper'>
                    <label htmlFor='phone' className='label-small'>
                      Phone
                    </label>
                    <input
                      type='text'
                      placeholder='Phone'
                      name='phone'
                      id='phone'
                      value={credentials.phone}
                      onChange={handleInputChange}
                      className=''
                    />
                  </div>
                  <div className='inputWrapper'>
                    <label htmlFor='gender' className='label-small'>
                      Gender
                    </label>
                    <select
                      name='gender'
                      id='gender'
                      value={credentials.gender}
                      onChange={handleInputChange}
                      className=''
                    >
                      <option value=''>Select gender</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                  </div>
                </div>
                <div className='inputPair'>
                  <div className='inputWrapper'>
                    <label htmlFor='password' className='label-small'>
                      Password
                    </label>
                    <div className='PasswordDivs'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Password'
                        name='password'
                        id='password'
                        value={credentials.password}
                        onChange={handleInputChange}
                        className=''
                      />
                      <button
                        className='PasswordVisibilityBtn'
                        type='button'
                        onClick={togglePasswordVisibility}
                      >
                        <i
                          className={`fa ${
                            showPassword ? 'fa-eye-slash' : 'fa-eye'
                          }`}
                          style={{ color: 'black' }}
                        />
                      </button>
                    </div>
                  </div>
                  <div className='inputWrapper'>
                    <label htmlFor='cpassword' className='label-small'>
                      Confirm Password
                    </label>
                    <div className='PasswordDivs'>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='Confirm Password'
                        name='cpassword'
                        id='cpassword'
                        value={credentials.cpassword}
                        onChange={handleInputChange}
                        className={` ${
                          !isConfirmPasswordValid
                            ? 'invalidConfirmPassword'
                            : ''
                        }`}
                      />
                      <button
                        className='PasswordVisibilityBtn'
                        type='button'
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        <i
                          className={`fa ${
                            showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'
                          }`}
                          style={{ color: 'black' }}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {errorMessage && <div className='error'>{errorMessage}</div>}
                <button type='submit' className='mx-auto mt-5'>
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUser;
