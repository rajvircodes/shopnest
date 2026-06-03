import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── Protects routes that require login ───────────────────────────
// If not logged in → redirect to /login
// If adminOnly and not admin → redirect to /
// Otherwise → render the page
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;