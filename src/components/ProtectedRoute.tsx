import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}


export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();


  // if (!isAuthenticated) {
  //   // Redirect to login with the current location as redirect parameter
  //   return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  // }

  return <>{children}</>;
}