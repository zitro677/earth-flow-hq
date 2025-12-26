
import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";

const SidebarUserRole: React.FC = () => {
  const { userRole } = useAuth();
  
  if (!userRole) return null;

  return (
    <div className="px-4 py-2 mb-2">
      <Badge variant={userRole === 'admin' ? "default" : "secondary"} className="w-full justify-center">
        {userRole === 'admin' ? 'Administrator' : 'Read Only'}
      </Badge>
    </div>
  );
};

export default SidebarUserRole;
