import './app.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import PrivateRoute from './PrivateRoute';
import ProfileUpdate from './components/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleAuthentication = (authState) => setIsAuthenticated(authState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path='/login'
          element={<Login onAuthentication={handleAuthentication} />}
        />
        <Route path='/dashboard' element={<Home />} />

        <Route path='/' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route
          path='/profile'
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Route index element={<ProfileUpdate />} />
            </PrivateRoute>
          }
        />
        <Route path='/passwordReset/:resetToken' element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
