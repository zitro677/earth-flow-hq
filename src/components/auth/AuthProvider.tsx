
import React from "react";
import { useAuthState } from "./hooks/useAuthState";
import { AuthContext } from "./AuthContext";
import { useRoleManagement } from "./hooks/useRoleManagement";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, loading, signOut } = useAuthState();
  const { userRole, isAdmin, updateUserRole } = useRoleManagement(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        userRole,
        isAdmin,
        signOut,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
