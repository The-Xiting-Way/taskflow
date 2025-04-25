import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsTimeout(true);
    }, 5000); // 5 second timeout

    return () => window.clearTimeout(timer);
  }, []);

  if (loading && !isTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || isTimeout) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}; 