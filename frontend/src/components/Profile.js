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
              address: json.address || '',
              department: json.department || '',
              designation: json.designation || '',
              dateOfJoining: json.dateOfJoining
                ? new Date(json.dateOfJoining).toISOString().split('T')[0]
                : '',
              salary: json.salary || '',
              profilePicture: null,
              userType: json.userType || '',
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
    address: '',
    department: '',
    designation: '',
    dateOfJoining: '',
    salary: '',
    profilePicture: null,
  });

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfileData({
      ...profileData,
      profilePicture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      phone,
      address,
      department,
      designation,
      dateOfJoining,
      salary,
      profilePicture,
    } = profileData;

    let body = new FormData();
    body.append('phone', phone);
    body.append('address', address);
    body.append('department', department);
    body.append('designation', designation);
    body.append('dateOfJoining', dateOfJoining);
    body.append('salary', salary);
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

  return (
    <>
      <div className='Profile'>
        <div className='OuterContainer'>
          <div className='InnerContainer'>
            {user && (
              <>
                <img
                  src={
                    `${API_BASE_URL}${user?.profilePicture}` || defaultAvatar
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
                    <label htmlFor='address' className='label-small'>
                      Address
                    </label>
                    <input
                      type='text'
                      id='address'
                      name='address'
                      value={profileData.address}
                      onChange={handleInputChange}
                      className=''
                    />
                  </div>
                  <div className='flexItem'>
                    <label htmlFor='department' className='label-small'>
                      Department
                    </label>
                    <input
                      type='text'
                      id='department'
                      name='department'
                      value={profileData.department}
                      onChange={handleInputChange}
                      className=''
                    />
                  </div>
                  <div className='flexItem'>
                    <label htmlFor='designation' className='label-small'>
                      Designation
                    </label>
                    <input
                      type='text'
                      id='designation'
                      name='designation'
                      value={profileData.designation}
                      onChange={handleInputChange}
                      className=''
                    />
                  </div>
                  <div className='flexItem'>
                    <label htmlFor='dateOfJoining' className='label-small'>
                      Date Of Joining
                    </label>
                    <input
                      type='date'
                      id='dateOfJoining'
                      name='dateOfJoining'
                      value={profileData.dateOfJoining}
                      onChange={handleInputChange}
                      className=''
                    />
                  </div>
                  <div className='flexItem'>
                    <label htmlFor='salary' className='label-small'>
                      Salary
                    </label>
                    <input
                      type='number'
                      id='salary'
                      name='salary'
                      value={profileData.salary}
                      onChange={handleInputChange}
                      className=''
                    />
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUpdate;
