
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'read_only' | 'user' | null;

export const useRoleManagement = (user: User | null) => {
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Function to fetch user role from database
  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for:", userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        // Set as read_only if no role found or error occurs
        setUserRole('read_only');
        return;
      }

      console.log('User role fetched:', data.role);
      setUserRole(data.role as UserRole);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      // Fallback: set as read_only if there's an error
      setUserRole('read_only');
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchUserRole(user.id);
    } else {
      setUserRole(null);
    }
  }, [user]);

  // Function to update user role - only works if current user is admin (enforced by RLS)
  const updateUserRole = async (userId: string, role: 'admin' | 'read_only'): Promise<boolean> => {
    try {
      // Client-side check for better UX (actual security is enforced by RLS)
      if (userRole !== 'admin') {
        toast.error("Only administrators can update user roles");
        return false;
      }

      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);

      if (error) {
        console.error("Error updating user role:", error);
        toast.error("Failed to update user role");
        return false;
      }

      toast.success(`User role updated to ${role}`);
      
      // If updating the current user's role, update the local state
      if (userId === user?.id) {
        setUserRole(role);
      }
      
      return true;
    } catch (error) {
      console.error("Error in updateUserRole:", error);
      toast.error("An unexpected error occurred");
      return false;
    }
  };

  return {
    userRole,
    isAdmin: userRole === 'admin',
    updateUserRole
  };
};
