
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

interface UserInviteFormProps {
  onInvite: (email: string, role: 'admin' | 'read_only') => Promise<void>;
}

const UserInviteForm: React.FC<UserInviteFormProps> = ({ onInvite }) => {
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<'admin' | 'read_only'>('read_only');
  const [inviteLoading, setInviteLoading] = useState(false);

  const handleInvite = async () => {
    if (!newUserEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setInviteLoading(true);
      await onInvite(newUserEmail, newUserRole);
      
      // Clear form
      setNewUserEmail("");
      setNewUserRole('read_only');
    } catch (error) {
      console.error("Error inviting user:", error);
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-4">Invite New User</h4>
      <div className="flex gap-4 flex-col sm:flex-row">
        <Input
          placeholder="Email address"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          className="sm:flex-1"
        />
        <Select
          value={newUserRole}
          onValueChange={(value) => setNewUserRole(value as 'admin' | 'read_only')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="read_only">Read Only</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={handleInvite} 
          disabled={inviteLoading}
        >
          {inviteLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          Invite
        </Button>
      </div>
    </div>
  );
};

export default UserInviteForm;
