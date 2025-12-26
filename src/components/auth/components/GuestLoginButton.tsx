
import React from "react";
import { Button } from "@/components/ui/button";

interface GuestLoginButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
}

const GuestLoginButton: React.FC<GuestLoginButtonProps> = ({ 
  onClick, 
  isLoading 
}) => {
  // This component is now empty since we're removing the guest login functionality
  return null;
};

export default GuestLoginButton;
