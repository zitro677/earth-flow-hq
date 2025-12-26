
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface LoginErrorMessageProps {
  message: string | null;
}

const LoginErrorMessage: React.FC<LoginErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default LoginErrorMessage;
