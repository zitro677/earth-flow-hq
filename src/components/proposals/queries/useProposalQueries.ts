
import { useQuery } from "@tanstack/react-query";
import { getProposals, getProposalById } from "../api/proposalApi";
import { useAuth } from "@/components/auth/AuthProvider";

export function useProposalQueries() {
  const { user, loading: authLoading } = useAuth();
  
  const proposalsQuery = useQuery({
    queryKey: ["proposals"],
    queryFn: getProposals,
    // Only run the query if the user is authenticated
    enabled: !!user,
    // Retry configuration to handle authentication issues
    retry: (failureCount, error) => {
      console.log("Retrying proposals query, attempt:", failureCount, "Error:", error);
      // Only retry a few times to avoid infinite loops
      return failureCount < 2;
    },
    // Avoid multiple refetches with their own unique queryKeys
    staleTime: 1000 * 60, // 1 minute
    // Focus refetching
    refetchOnWindowFocus: true,
    // Only refetch when component mounts and then rely on manual refetches
    refetchOnMount: 'always',
    // Set a cache time
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  // Log the raw data for debugging
  console.log("useProposalQueries - Raw Query Result:", proposalsQuery);
  console.log("useProposalQueries - Auth state:", user ? "Authenticated" : "Not authenticated");
  console.log("useProposalQueries - Auth loading:", authLoading);
  console.log("useProposalQueries - Proposals Data:", proposalsQuery.data);
  console.log("useProposalQueries - Is Loading:", proposalsQuery.isLoading);
  console.log("useProposalQueries - Is Error:", proposalsQuery.isError);
  
  if (proposalsQuery.isError) {
    console.error("useProposalQueries - Error:", proposalsQuery.error);
  }

  return {
    proposals: proposalsQuery.data || [],
    isLoading: proposalsQuery.isLoading || authLoading, // Include auth loading state
    isError: proposalsQuery.isError && !authLoading, // Only show error if auth is not loading
    error: proposalsQuery.error,
    refetch: proposalsQuery.refetch,
    isSuccess: proposalsQuery.isSuccess,
    status: proposalsQuery.status,
  };
}

export { getProposalById };
