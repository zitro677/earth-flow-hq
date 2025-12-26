
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarSignOutProps {
  onSignOut: () => Promise<void>;
}

const SidebarSignOut: React.FC<SidebarSignOutProps> = ({ onSignOut }) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 px-3">
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground hover:text-current"
        onClick={onSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
    </div>
  );
};

export default SidebarSignOut;
