import { Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : null;
};

export default PrivateRoute;
