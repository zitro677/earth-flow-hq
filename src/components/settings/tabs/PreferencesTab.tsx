
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UserSettings } from "../types";

interface PreferencesTabProps {
  initialSettings: UserSettings;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const PreferencesTab = ({ initialSettings, onSave, isLoading }: PreferencesTabProps) => {
  const preferencesForm = useForm({
    defaultValues: {
      darkMode: initialSettings.darkMode,
      compactView: initialSettings.compactView,
      defaultDashboard: initialSettings.defaultDashboard || "overview",
      emailDigest: true
    }
  });

  return (
    <div className="space-y-4">
      <Form {...preferencesForm}>
        <form onSubmit={preferencesForm.handleSubmit(onSave)}>
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={preferencesForm.control}
                name="darkMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Dark Mode</FormLabel>
                      <FormDescription>
                        Enable dark mode for reduced eye strain in low light environments
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
              <FormField
                control={preferencesForm.control}
                name="compactView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Compact View</FormLabel>
                      <FormDescription>
                        Display more content per page with a compact layout
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
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      
      <Card>
        <CardHeader>
          <CardTitle>Default Views</CardTitle>
          <CardDescription>
            Configure your default views for projects and invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="default-dashboard">Default Dashboard View</Label>
            <select 
              id="default-dashboard"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="overview"
            >
              <option value="overview">Overview</option>
              <option value="projects">Projects</option>
              <option value="finances">Finances</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="default-project-view">Default Project View</Label>
            <select 
              id="default-project-view"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="grid"
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
              <option value="kanban">Kanban</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={() => toast.success("Default views updated successfully")}
          >
            Save View Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PreferencesTab;
