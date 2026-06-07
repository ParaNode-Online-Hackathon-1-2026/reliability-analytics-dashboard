import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleGuard({ allowedRoles, children }) {
  const { user } = useAuth();
  const params = useParams();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin gets full access
  if (user.role === 'admin') {
    return children;
  }

  // If component requires specific roles and user doesn't have it
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  // Specific check for Vendor Detail page to ensure vendors only see their own data
  if (user.role === 'vendor' && params.id) {
    if (user.vendorId !== params.id) {
      return <Navigate to="/access-denied" replace />;
    }
  }

  return children;
}
