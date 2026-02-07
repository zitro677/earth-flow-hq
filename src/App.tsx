import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import DashboardPage from "./components/dashboard/DashboardPage";
import InvoicesPage from "./components/invoices/InvoicesPage";
import InvoiceForm from "./components/invoices/InvoiceForm";
import ProposalsPage from "./components/proposals/ProposalsPage";
import ProposalForm from "./components/proposals/ProposalForm";
import FinancesPage from "./components/finances/FinancesPage";
import ProjectsPage from "./components/projects/ProjectsPage";
import ProjectDetail from "./components/projects/ProjectDetail";
import ProjectForm from "./components/projects/ProjectForm";
import LoginPage from "./components/auth/LoginPage";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import ClientsPage from "./components/clients/ClientsPage";
import ClientForm from "./components/clients/ClientForm";
import SuppliersPage from "./components/suppliers/SuppliersPage";
import SupplierForm from "./components/suppliers/SupplierForm";
import SettingsPage from "./components/settings/SettingsPage";
import { Loader2 } from "lucide-react";
import React from "react";

// Configure the query client with better error handling and retry options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on recursion errors
        if (
          error instanceof Error && 
          error.message && 
          error.message.includes("recursion")
        ) {
          return false;
        }
        // Otherwise retry once
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      meta: {
        onError: (error: Error) => {
          console.error("Query error:", error);
        }
      }
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry on recursion errors
        if (
          error instanceof Error && 
          error.message && 
          error.message.includes("recursion")
        ) {
          return false;
        }
        // Otherwise retry once
        return failureCount < 1;
      },
      meta: {
        onError: (error: Error) => {
          console.error("Mutation error:", error);
        }
      }
    }
  }
});

// Auth guard component to protect routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Debug logging
  React.useEffect(() => {
    console.log("ProtectedRoute - Auth status:", user ? "Authenticated" : "Not authenticated");
    console.log("ProtectedRoute - Auth loading:", loading);
    console.log("ProtectedRoute - Current path:", location.pathname);
  }, [user, loading, location.pathname]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  if (!user) {
    // Save the current path to redirect back after login
    console.log("ProtectedRoute - User not authenticated, redirecting to auth page");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute - User authenticated, rendering children");
  return <>{children}</>;
};

const AppRoutes = () => (
  <AnimatePresence mode="wait">
    <Routes>
      <Route path="/auth" element={<LoginPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="invoices/new" element={<InvoiceForm />} />
        <Route path="invoices/edit/:id" element={<InvoiceForm />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clients/new" element={<ClientForm />} />
        <Route path="clients/edit/:id" element={<ClientForm />} />
        <Route path="proposals" element={<ProposalsPage />} />
        <Route path="proposals/new" element={<ProposalForm />} />
        <Route path="proposals/edit/:id" element={<ProposalForm />} />
        <Route path="finances" element={<FinancesPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/edit/:id" element={<ProjectForm />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="suppliers/new" element={<SupplierForm />} />
        <Route path="suppliers/edit/:id" element={<SupplierForm />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AnimatePresence>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
