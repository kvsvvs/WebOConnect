import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/defaultAvatar.svg';

const ProfileUpdate = () => {
  const API_BASE_URL = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}auth/getuser`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': token,
            },
          });
          const json = await response.json();
          if (response.ok) {
            setUser(json);
            setProfileData({
              phone: json.phone || '',
              profilePicture: null,
              gender: json.gender || '',
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [API_BASE_URL]);

  const [profileData, setProfileData] = useState({
    phone: '',
    profilePicture: null,
    gender: '',
  });

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleFileChange = (e) => {
    setProfileData({
      ...profileData,
      profilePicture: e.target.files[0],
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { phone, profilePicture, gender } = profileData;

    let body = new FormData();
    body.append('phone', phone);

    body.append('gender', gender);
    if (profilePicture) {
      body.append('profilePicture', profilePicture);
    }

    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}auth/updateprofile`, {
      method: 'PUT',
      headers: {
        'auth-token': token,
      },
      body: body,
    });

    if (response.ok) {
      navigate('/dashboard');
    } else {
      // Handle error
    }
  };
  const handleDeleteProfile = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}auth/deleteprofile`, {
        method: 'DELETE',
        headers: {
          'auth-token': token,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error while deleting profile:', error.message);
    }
  };

  return (
    <>
      <div className='Profile'>
        <div className='OuterContainer'>
          <div className='InnerContainer'>
            {user && (
              <>
                <img
                  src={
                    user?.profile_pic
                      ? `${API_BASE_URL}${user?.profile_pic}`
                      : defaultAvatar
                  }
                  alt={user.name}
                  className='profilePicture mb-4'
                />

                <h3 className='boldFont'>{user.name}</h3>
              </>
            )}
            <div className='FormContainer'>
              <form onSubmit={handleSubmit} className='form'>
                <div className='flexContainer'>
                  <div className='flexItem'>
                    <label htmlFor='email' className='label-small'>
                      Email
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={user ? user.email : ''}
                      disabled
                      className=''
                    />
                  </div>
                  <div className='flexItem'>
                    <label htmlFor='password' className='label-small'>
                      Password
                    </label>
                    <input
                      type='password'
                      id='password'
                      name='password'
                      value='********'
                      disabled
                      className=''
                    />
                  </div>
                </div>
                <h2 className=''>Other Details</h2>
                <div className='flexContainer'>
                  <div className='flexItem'>
                    <label htmlFor='phone' className='label-small'>
                      Phone
                    </label>
                    <input
                      type='tel'
                      id='phone'
                      name='phone'
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className=''
                    />
                  </div>
                  <div className='flexItem'>
                    <label htmlFor='gender' className='label-small'>
                      Gender
                    </label>
                    <select
                      id='gender'
                      name='gender'
                      value={profileData.gender}
                      onChange={handleInputChange}
                      className=''
                    >
                      <option value=''>Select gender</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                  </div>

                  <div className='flexItem'>
                    <label htmlFor='profilePicture' className='label-small'>
                      Profile Picture
                    </label>
                    <input
                      type='file'
                      id='profilePicture'
                      name='profilePicture'
                      onChange={handleFileChange}
                      className=''
                    />
                  </div>
                </div>
                <button type='submit' className='mx-auto '>
                  Save Changes
                </button>
                <button
                  type='button'
                  className='mx-auto '
                  onClick={handleDeleteProfile}
                >
                  Delete Profile
                </button>
                <button
                  type='button'
                  className='mx-auto '
                  onClick={handleNavigateToDashboard}
                >
                  Go To Dashboard
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUpdate;
