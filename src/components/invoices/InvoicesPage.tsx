
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import AnimatedPage from "../shared/AnimatedPage";
import { useInvoices } from "./useInvoices";
import InvoicesHeader from "./InvoicesHeader";
import InvoiceStats from "./InvoiceStats";
import InvoiceFilters from "./InvoiceFilters";
import InvoicesList from "./InvoicesList";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  
  const { 
    invoices, 
    isLoading, 
    error, 
    refetch 
  } = useInvoices();

  // Debug logging
  useEffect(() => {
    console.log("InvoicesPage - Auth status:", user ? "Authenticated" : "Not authenticated");
    console.log("InvoicesPage - Auth loading:", authLoading);
    console.log("InvoicesPage - Invoices loading:", isLoading);
    console.log("InvoicesPage - Invoices count:", invoices?.length || 0);
    
    if (error) {
      console.error("InvoicesPage - Error loading invoices:", error);
    }
  }, [user, authLoading, isLoading, invoices, error]);

  // Load invoices when component mounts
  useEffect(() => {
    if (user && !isLoading) {
      console.log("InvoicesPage - Attempting to refetch invoices data");
      const loadData = async () => {
        try {
          await refetch();
        } catch (err) {
          console.error("Error refetching invoices:", err);
          toast.error("Failed to load invoices");
        }
      };
      
      loadData();
    }
  }, [user, refetch, isLoading]);

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("InvoicesPage - User not authenticated, redirecting to auth page");
      toast.error("You need to be logged in to view invoices");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <AnimatedPage>
        <div className="page-container">
          <InvoicesHeader />
          <div className="space-y-4 mt-4">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[70px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (!user) {
    return null; // Will be redirected by the useEffect hook
  }

  // Filter invoices based on status
  const filteredInvoices = Array.isArray(invoices) 
    ? invoices.filter(invoice => {
        if (statusFilter === "all") return true;
        return invoice.status?.toLowerCase() === statusFilter.toLowerCase();
      })
    : [];

  // Sort invoices based on selected criteria
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    const dateA = new Date(a.issue_date || a.created_at || "").getTime();
    const dateB = new Date(b.issue_date || b.created_at || "").getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Get error message
  const errorMessage = error instanceof Error 
    ? error.message 
    : "An unexpected error occurred loading invoices";

  return (
    <AnimatedPage>
      <div className="page-container">
        <InvoicesHeader />
        
        {isLoading ? (
          <div className="space-y-4 mt-4">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[70px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <>
            <InvoiceStats invoices={invoices || []} />
            
            <InvoiceFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            
            <InvoicesList
              invoices={invoices || []}
              filteredAndSortedInvoices={sortedInvoices}
              isLoading={isLoading}
              isError={!!error}
              errorMessage={errorMessage}
            />
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default InvoicesPage;
