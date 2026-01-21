
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserSettings } from "../types";

export const useSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Load user settings from localStorage
  const loadUserSettings = (): UserSettings => {
    try {
      const storedSettings = localStorage.getItem("user_settings");
      if (storedSettings) {
        return JSON.parse(storedSettings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
    
    // Default settings if nothing found
    return {
      name: user?.email?.split('@')[0] || "Usuario",
      email: user?.email || "usuario@ejemplo.com",
      company: "AutoseguroDJ S.A.S",
      bio: "Especialistas en blindaje vehicular, seguridad automotriz, detailing y servicios integrales para vehículos.",
      darkMode: false,
      compactView: true,
      defaultDashboard: "overview",
      emailNotifications: true,
      projectUpdates: true,
      invoiceReminders: true,
      marketingEmails: false,
      smsNotifications: false
    };
  };
  
  // Save settings to localStorage
  const saveUserSettings = (settings: UserSettings): boolean => {
    try {
      localStorage.setItem("user_settings", JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      return false;
    }
  };

  const onSubmitAccount = (data: Partial<UserSettings>) => {
    setIsLoading(true);
    
    // Get current settings
    const currentSettings = loadUserSettings();
    
    // Update account information
    const updatedSettings = {
      ...currentSettings,
      name: data.name || currentSettings.name,
      email: data.email || currentSettings.email,
      company: data.company || currentSettings.company,
      bio: data.bio || currentSettings.bio
    };
    
    // Save to localStorage
    if (saveUserSettings(updatedSettings)) {
      toast.success("Account information updated successfully");
    } else {
      toast.error("Failed to save account information");
    }
    
    setIsLoading(false);
  };

  const onSubmitPreferences = (data: Partial<UserSettings>) => {
    setIsLoading(true);
    
    // Get current settings
    const currentSettings = loadUserSettings();
    
    // Update preferences
    const updatedSettings = {
      ...currentSettings,
      darkMode: data.darkMode !== undefined ? data.darkMode : currentSettings.darkMode,
      compactView: data.compactView !== undefined ? data.compactView : currentSettings.compactView,
      defaultDashboard: data.defaultDashboard || currentSettings.defaultDashboard
    };
    
    // Save to localStorage
    if (saveUserSettings(updatedSettings)) {
      toast.success("Preferences updated successfully");
    } else {
      toast.error("Failed to save preferences");
    }
    
    setIsLoading(false);
  };

  const onSubmitNotifications = (data: Partial<UserSettings>) => {
    setIsLoading(true);
    
    // Get current settings
    const currentSettings = loadUserSettings();
    
    // Update notification settings
    const updatedSettings = {
      ...currentSettings,
      emailNotifications: data.emailNotifications !== undefined ? data.emailNotifications : currentSettings.emailNotifications,
      projectUpdates: data.projectUpdates !== undefined ? data.projectUpdates : currentSettings.projectUpdates,
      invoiceReminders: data.invoiceReminders !== undefined ? data.invoiceReminders : currentSettings.invoiceReminders,
      marketingEmails: data.marketingEmails !== undefined ? data.marketingEmails : currentSettings.marketingEmails,
      smsNotifications: data.smsNotifications !== undefined ? data.smsNotifications : currentSettings.smsNotifications
    };
    
    // Save to localStorage
    if (saveUserSettings(updatedSettings)) {
      toast.success("Notification settings updated successfully");
    } else {
      toast.error("Failed to save notification settings");
    }
    
    setIsLoading(false);
  };

  return {
    loadUserSettings,
    isLoading,
    onSubmitAccount,
    onSubmitPreferences,
    onSubmitNotifications
  };
};
