import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const token = localStorage.getItem('cg_token');
  return token ? children : <Navigate to="/login" replace />;
}
