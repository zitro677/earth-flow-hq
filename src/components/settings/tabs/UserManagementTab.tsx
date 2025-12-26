
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserManagement } from "./user-management/useUserManagement";
import UserInviteForm from "./user-management/UserInviteForm";
import UsersList from "./user-management/UsersList";

const UserManagementTab = () => {
  const {
    users,
    loading,
    handleRoleChange,
    handleInviteUser,
    isAdmin
  } = useUserManagement();

  if (!isAdmin) {
    return (
      <Alert>
        <AlertDescription>
          You need administrator privileges to access user management.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">User Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage users and their access roles
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <UserInviteForm onInvite={handleInviteUser} />

          <div>
            <h4 className="text-sm font-medium mb-4">Current Users</h4>
            <UsersList 
              users={users}
              loading={loading}
              onRoleChange={handleRoleChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementTab;
