
import { useProposalQueries } from "./queries/useProposalQueries";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { useEffect } from "react";

export function useProposals() {
  const { user } = useAuth();
  const queryResult = useProposalQueries();
  
  // Log authentication state and proposals data
  console.log("useProposals hook called - Auth state:", user ? "Authenticated" : "Not authenticated");
  console.log("useProposals hook called - User ID:", user?.id);
  console.log("useProposals returned proposals:", queryResult.proposals?.length || 0);
  
  // Show a toast error if there's a query error
  useEffect(() => {
    if (queryResult.isError && !queryResult.isLoading) {
      toast.error("Failed to load proposals. Please try again.");
      console.error("Proposals loading error:", queryResult.error);
    }
  }, [queryResult.isError, queryResult.error, queryResult.isLoading]);
  
  if (queryResult.proposals?.length) {
    console.log("Sample proposal:", queryResult.proposals[0]);
  }
  
  return queryResult;
}
