import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const ResetPassword = () => {
  const API_BASE_URL = process.env.REACT_APP_SERVER_URL;
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}auth/resetpassword/${resetToken}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      }
    );

    const json = await response.json();

    if (json.success) {
      alert('Password Reset Success');
      navigate('/');
    } else {
      alert('Invalid Token or Error Occurred');
    }
  };

  return (
    <>
      <div className='ResetPassword'>
        <div className='OuterContainer'>
          <div className='InnerContainer'>
            <h2 className='mb-4'>Reset Password</h2>
            <form onSubmit={handleSubmit} className='ResetPasswordForm'>
              <div className='mb-3'>
                <label htmlFor='password' className=''>
                  New Password
                </label>
                <input
                  type='password'
                  className=''
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id='password'
                  name='password'
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='confirmPassword' className=''>
                  Confirm New Password
                </label>
                <input
                  type='password'
                  className=''
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id='confirmPassword'
                  name='confirmPassword'
                />
              </div>
              <button type='submit' className=''>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
