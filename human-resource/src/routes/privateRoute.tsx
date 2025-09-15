import { Navigate } from 'react-router-dom';
import { getTokenWithExpiry } from '../services/localStorage';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = getTokenWithExpiry();

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
