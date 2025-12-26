
import React from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserWithRole {
  id: string;
  email: string;
  role: 'admin' | 'read_only';
}

interface UsersListProps {
  users: UserWithRole[];
  loading: boolean;
  onRoleChange: (userId: string, newRole: 'admin' | 'read_only') => void;
}

const UsersList: React.FC<UsersListProps> = ({ 
  users, 
  loading, 
  onRoleChange 
}) => {
  const { user } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No users found
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((userItem) => (
        <div 
          key={userItem.id} 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4"
        >
          <div className="mb-2 sm:mb-0">
            <p className="font-medium">{userItem.email}</p>
            <p className="text-xs text-muted-foreground">
              {userItem.id === user?.id ? "(You)" : ""}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={userItem.role}
              onValueChange={(value) => 
                onRoleChange(userItem.id, value as 'admin' | 'read_only')
              }
              disabled={userItem.id === user?.id} // Cannot change own role
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="read_only">Read Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
