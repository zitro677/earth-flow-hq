
import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UserSettings } from "../types";

interface NotificationsTabProps {
  initialSettings: UserSettings;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const NotificationsTab = ({ initialSettings, onSave, isLoading }: NotificationsTabProps) => {
  const notificationsForm = useForm({
    defaultValues: {
      emailNotifications: initialSettings.emailNotifications,
      projectUpdates: initialSettings.projectUpdates,
      invoiceReminders: initialSettings.invoiceReminders,
      marketingEmails: initialSettings.marketingEmails,
      smsNotifications: initialSettings.smsNotifications
    }
  });

  return (
    <Form {...notificationsForm}>
      <form onSubmit={notificationsForm.handleSubmit(onSave)}>
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={notificationsForm.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email Notifications</FormLabel>
                      <FormDescription>
                        Receive notifications via email
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="ml-6 space-y-4">
                <FormField
                  control={notificationsForm.control}
                  name="projectUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!notificationsForm.watch("emailNotifications")}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Project Updates
                        </FormLabel>
                        <FormDescription>
                          Get notified about changes to your projects
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={notificationsForm.control}
                  name="invoiceReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!notificationsForm.watch("emailNotifications")}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Invoice Reminders
                        </FormLabel>
                        <FormDescription>
                          Receive reminders about upcoming and overdue invoices
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={notificationsForm.control}
                  name="marketingEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!notificationsForm.watch("emailNotifications")}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Marketing Emails
                        </FormLabel>
                        <FormDescription>
                          Receive updates about new features and promotions
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={notificationsForm.control}
                name="smsNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">SMS Notifications</FormLabel>
                      <FormDescription>
                        Receive important notifications via SMS
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Notification Settings'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default NotificationsTab;
