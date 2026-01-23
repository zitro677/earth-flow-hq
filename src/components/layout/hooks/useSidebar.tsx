
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const closeSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  const handleSignOut = useCallback(async () => {
    toast.loading("Cerrando sesión...");
    await signOut();
  }, [signOut]);

  return {
    isMobileOpen,
    setIsMobileOpen,
    closeSidebar,
    toggleSidebar,
    handleSignOut,
    user
  };
}
