
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
    try {
      toast.loading("Signing out...");
      await signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  }, [signOut, navigate]);

  return {
    isMobileOpen,
    setIsMobileOpen,
    closeSidebar,
    toggleSidebar,
    handleSignOut,
    user
  };
}
