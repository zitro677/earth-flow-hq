
import React from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { useLoginForm } from "./hooks/useLoginForm";
import EmailLoginForm from "./components/EmailLoginForm";
import LoginErrorMessage from "./components/LoginErrorMessage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { 
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleEmailLogin,
    handleSignUp,
    handleGoogleLogin
  } = useLoginForm();
  
  // Redirect if already logged in
  if (user && !loading) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">AutoseguroDJ S.A.S</CardTitle>
            <CardDescription>
              Inicia sesión para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <LoginErrorMessage message={errorMessage} />
            
            <EmailLoginForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              handleEmailLogin={handleEmailLogin}
              handleSignUp={handleSignUp}
            />

            <div className="relative flex justify-center text-xs uppercase my-4">
              <span className="bg-background px-2 text-muted-foreground">O continuar con</span>
              <div className="absolute inset-x-0 top-1/2 h-px bg-muted"></div>
            </div>
            
            {/* Google Sign In Button */}
            <Button 
              onClick={handleGoogleLogin} 
              className="w-full mb-2"
              variant="outline"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path 
                  fill="#4285F4" 
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path 
                  fill="#34A853" 
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path 
                  fill="#FBBC05" 
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path 
                  fill="#EA4335" 
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Iniciar sesión con Google
            </Button>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Desarrollado por Arkana Tech
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
