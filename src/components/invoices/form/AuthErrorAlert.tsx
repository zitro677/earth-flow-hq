
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AuthErrorAlertProps {
  show: boolean;
}

const AuthErrorAlert: React.FC<AuthErrorAlertProps> = ({ show }) => {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="p-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          You must be logged in to create an invoice. Please login and try again.
        </AlertDescription>
      </Alert>
      <div className="mt-4">
        <Button onClick={() => navigate("/auth")}>Go to Login</Button>
      </div>
    </div>
  );
};

export default AuthErrorAlert;
