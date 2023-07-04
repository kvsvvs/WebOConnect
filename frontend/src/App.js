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
import ResetLandingPage from './components/ResetLandingPage';

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
        <Route path='/' element={<SignUp />} />
        <Route path='/resetLanding' element={<ResetLandingPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/passwordReset/:resetToken' element={<ResetPassword />} />

        <Route
          path=''
          element={<PrivateRoute isAuthenticated={isAuthenticated} />}
        >
          <Route path='/dashboard' element={<Home />} />
          <Route path='/profile' element={<ProfileUpdate />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
