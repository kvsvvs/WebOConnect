import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const API_BASE_URL = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}auth/forgotpassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const json = await response.json();

    if (json.success) {
      alert('Password reset email has been sent.');
      navigate('/resetLanding');
    } else {
      alert('Error: ' + json.message);
    }
  };

  return (
    <div className='OuterContainer'>
      <div className='InnerContainer'>
        <h2 className=''>Enter Your Registered Email Id</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email address
            </label>
            <input
              type='email'
              className=''
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id='email'
              name='email'
              aria-describedby='emailHelp'
            />
          </div>
          <button type='submit' className=''>
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
