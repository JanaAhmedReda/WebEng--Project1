import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import Loading from './Loading';

export default function ProtectedRoute({ children, allowedRoles, fallbackTo = '/' }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const roles = user?.roles ?? [];
  const hasAllowedRole = !allowedRoles?.length || allowedRoles.some((role) => roles.includes(role));

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasAllowedRole) {
    return <Navigate to={fallbackTo} replace />;
  }

  return children;
}