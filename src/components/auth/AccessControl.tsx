
import React from 'react';
import { useAuth } from './AuthProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AccessControlProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'read_only';
  fallback?: React.ReactNode;
}

const AccessControl: React.FC<AccessControlProps> = ({ 
  children, 
  requiredRole = 'read_only',
  fallback 
}) => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Admin users have access to everything
  if (userRole === 'admin') {
    return <>{children}</>;
  }

  // Check if user meets the required role
  if (requiredRole === 'read_only' && userRole === 'read_only') {
    return <>{children}</>;
  }

  // User doesn't have required permissions
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Alert>
      <AlertDescription>
        You don't have permission to access this feature. Contact an administrator for access.
      </AlertDescription>
    </Alert>
  );
};

export default AccessControl;
