
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserSettings } from "../types";

interface AccountTabProps {
  initialSettings: UserSettings;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const AccountTab = ({ initialSettings, onSave, isLoading }: AccountTabProps) => {
  const { user } = useAuth();

  const accountForm = useForm({
    defaultValues: {
      name: initialSettings.name,
      email: initialSettings.email || user?.email || "user@example.com",
      company: initialSettings.company,
      bio: initialSettings.bio
    }
  });

  return (
    <div className="space-y-4">
      <Form {...accountForm}>
        <form onSubmit={accountForm.handleSubmit(onSave)}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your account details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={accountForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-muted/50" />
                    </FormControl>
                    <FormDescription>
                      Your email address is used for login and cannot be changed.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={accountForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your full name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={accountForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your company name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={accountForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Write a short bio about yourself" 
                        className="resize-none min-h-[120px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Update your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={() => toast.success("Password updated successfully")}
          >
            Update Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountTab;
