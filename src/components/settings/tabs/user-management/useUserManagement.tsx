
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface UserWithRole {
  id: string;
  email: string;
  role: 'admin' | 'read_only';
}

export const useUserManagement = () => {
  const { user, isAdmin, updateUserRole } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // First get all user roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (roleError) {
        console.error("Error fetching user roles:", roleError);
        toast.error("Failed to load user roles");
        return;
      }

      if (roleData) {
        const userIds = roleData.map(item => item.user_id);
        
        // Then fetch user profiles separately
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds);

        if (profileError) {
          console.error("Error fetching user profiles:", profileError);
          toast.error("Failed to load user profiles");
          return;
        }

        // Combine the data from both queries
        const userList: UserWithRole[] = roleData.map(role => {
          const profile = profileData?.find(p => p.id === role.user_id);
          return {
            id: role.user_id,
            email: profile?.email || 'Unknown email',
            role: role.role as 'admin' | 'read_only'
          };
        });
        
        setUsers(userList);
      }
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'read_only') => {
    if (!updateUserRole) {
      toast.error("Role update functionality is not available");
      return;
    }
    
    const success = await updateUserRole(userId, newRole);
    if (success) {
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    }
  };

  const handleInviteUser = async (email: string, role: 'admin' | 'read_only') => {
    // In a real application, you would send an invitation email
    // For this demo, we'll show a message with instructions
    toast.success(`Invitation would be sent to ${email} with role: ${role}`);
  };

  return {
    users,
    loading,
    handleRoleChange,
    handleInviteUser,
    isAdmin
  };
};
