
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountTab from "./tabs/AccountTab";
import NotificationsTab from "./tabs/NotificationsTab";
import PreferencesTab from "./tabs/PreferencesTab";
import UserManagementTab from "./tabs/UserManagementTab";
import AnimatedPage from "../shared/AnimatedPage";
import { useAuth } from "../auth/AuthProvider";
import { useSettings } from "./hooks/useSettings";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const { isAdmin, signOut } = useAuth();
  const isMobile = useIsMobile();
  const { 
    loadUserSettings, 
    isLoading, 
    onSubmitAccount, 
    onSubmitPreferences, 
    onSubmitNotifications 
  } = useSettings();
  
  // Load user settings
  const userSettings = loadUserSettings();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const renderSignOutButton = () => (
    <Button 
      variant="outline" 
      className="flex items-center gap-2" 
      onClick={handleSignOut}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );

  return (
    <AnimatedPage>
      <div className="container mx-auto py-6 space-y-4 max-w-5xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          
          {/* Desktop sign out button */}
          <div className="hidden md:block">
            {renderSignOutButton()}
          </div>
          
          {/* Mobile sign out button */}
          <div className="md:hidden">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-auto">
                  <div className="py-6 flex justify-center">
                    <Button 
                      onClick={handleSignOut} 
                      className="w-full max-w-xs flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            {isAdmin && <TabsTrigger value="users">User Management</TabsTrigger>}
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="account">
              <AccountTab 
                initialSettings={userSettings} 
                onSave={onSubmitAccount} 
                isLoading={isLoading} 
              />
            </TabsContent>
            <TabsContent value="preferences">
              <PreferencesTab 
                initialSettings={userSettings} 
                onSave={onSubmitPreferences} 
                isLoading={isLoading} 
              />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationsTab 
                initialSettings={userSettings} 
                onSave={onSubmitNotifications} 
                isLoading={isLoading} 
              />
            </TabsContent>
            {isAdmin && (
              <TabsContent value="users">
                <UserManagementTab />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default SettingsPage;
