import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route that only allows access to users with ADMIN role.
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
