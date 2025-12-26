
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";

const SidebarSettings: React.FC = () => {
  return (
    <div className="mt-6">
      <p className="mb-2 text-xs font-medium text-sidebar-foreground/70 px-3">
        Settings
      </p>
      <nav className="flex flex-col gap-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )
          }
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default SidebarSettings;
