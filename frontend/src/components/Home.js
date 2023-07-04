import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Link, useNavigate } from 'react-router-dom';
const Home = () => {
  const API_BASE_URL = process.env.REACT_APP_SERVER_URL;
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}auth/users`, {
        headers: {
          'auth-token': token,
        },
      });
      const data = await response.json();
      setUsers(data.users);
    };

    fetchUsers();
  }, []);

  const handleDownloadCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Gender',
      'Phone',
      'Status',
      'Profile Pic',
    ];
    const data = [headers].concat(
      users.map((user) => [
        user.id,
        user.name,
        user.email,
        user.gender,
        user.phone,
        user.status,
        user.profile_pic,
      ])
    );
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'users.csv';
    link.click();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td>{user.phone}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleDownloadCSV}>Download CSV</button>
      <Link to='/profile'>
        <button>Go To Profile</button>
      </Link>
    </div>
  );
};

export default Home;
