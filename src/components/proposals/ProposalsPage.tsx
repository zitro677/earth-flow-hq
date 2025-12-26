
import React, { useState, useEffect, useCallback } from "react";
import AnimatedPage from "../shared/AnimatedPage";
import { useProposals } from "./useProposals"; 
import { useAuth } from "@/components/auth/AuthProvider";
import ProposalFilters from "./ProposalFilters";
import ProposalStats from "./ProposalStats";
import ProposalsList from "./ProposalsList";
import ProposalsHeader from "./ProposalsHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Proposal } from "./types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProposalsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const { 
    proposals, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useProposals();

  // Improved logging for debugging
  useEffect(() => {
    console.log("ProposalsPage - Auth status:", user ? "Authenticated" : "Not authenticated");
    console.log("ProposalsPage - Auth loading:", authLoading);
    console.log("ProposalsPage - isLoading:", isLoading);
    console.log("ProposalsPage - isError:", isError);
    console.log("ProposalsPage - Proposals count:", proposals?.length || 0);
    
    if (error) {
      console.error("ProposalsPage - Error details:", error);
    }
  }, [proposals, isLoading, isError, user, authLoading, error]);

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("ProposalsPage - User not authenticated, redirecting to auth page");
      toast.error("You need to be logged in to view proposals");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Improved load proposals function with better error handling
  const loadProposals = useCallback(async () => {
    if (!user) {
      console.log("ProposalsPage - Not loading proposals, user not authenticated");
      return;
    }
    
    console.log("ProposalsPage - Loading proposals...");
    const loadingToast = toast.loading("Loading proposals...");
    
    try {
      await refetch();
      toast.dismiss(loadingToast);
      
      if (!isError && proposals) {
        if (proposals.length > 0) {
          toast.success(`Loaded ${proposals.length} proposals`);
        } else {
          toast.info("No proposals found");
        }
      } else {
        toast.error("Failed to load proposals");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Failed to load proposals");
      console.error("ProposalsPage - Error refetching proposals:", err);
    }
  }, [refetch, user, proposals, isError]);
  
  // Force a refetch when the component mounts
  useEffect(() => {
    if (user && !isLoading) {
      console.log("ProposalsPage - Component mounted, loading proposals");
      loadProposals();
    }
  }, [user, loadProposals, isLoading]);

  // If auth is still loading, show skeleton
  if (authLoading) {
    return (
      <AnimatedPage>
        <div className="page-container">
          <ProposalsHeader />
          <div className="space-y-4 mt-4">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[70px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </AnimatedPage>
    );
  }

  // If user is not authenticated, don't render content
  if (!user) {
    return null; // Will be redirected by the useEffect hook
  }

  // Ensure proposals is an array before filtering
  const filteredProposals = Array.isArray(proposals) ? proposals.filter((proposal) => {
    if (statusFilter === "all") return true;
    return proposal.status?.toLowerCase() === statusFilter.toLowerCase();
  }) : [];

  // Ensure proposals is an array before sorting
  const sortedProposals = [...filteredProposals].sort((a, b) => {
    const dateA = new Date(a.issue_date || a.created_at || "").getTime();
    const dateB = new Date(b.issue_date || b.created_at || "").getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  if (isError) {
    return (
      <AnimatedPage>
        <div className="page-container">
          <ProposalsHeader />
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading proposals. Please try again.
              {error instanceof Error && (
                <div className="mt-2 text-xs opacity-80">
                  {error.message}
                </div>
              )}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => loadProposals()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </Button>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-container">
        <ProposalsHeader />
        
        {isLoading ? (
          <div className="space-y-4 mt-4">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[70px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <>
            <ProposalStats proposals={proposals as Proposal[]} />
            
            <ProposalFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            
            <ProposalsList
              proposals={proposals as Proposal[]}
              isLoading={isLoading}
              isError={isError}
              filteredAndSortedProposals={sortedProposals}
            />
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default ProposalsPage;
