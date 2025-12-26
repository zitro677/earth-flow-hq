
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProposal, updateProposal } from "../api/proposalApi";
import { ProposalFormData } from "../types";
import { toast } from "sonner";

export function useProposalMutations() {
  const queryClient = useQueryClient();

  // For creating a proposal
  const createProposalMutation = useMutation({
    mutationFn: createProposal,
    onMutate: () => {
      toast.loading("Creating proposal...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      if (data) {
        // Invalidate queries to force an immediate refetch
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        
        toast.success("Proposal created successfully");
        console.log("Proposal created successfully:", data);
        
        // Force an immediate refetch
        queryClient.refetchQueries({ queryKey: ["proposals"] });
      }
    },
    onError: (error: any) => {
      toast.dismiss();
      console.error("Proposal creation error:", error);
      toast.error(`Error creating proposal: ${error.message || "Unknown error"}`);
    }
  });

  // For updating a proposal
  const updateProposalMutation = useMutation({
    mutationFn: updateProposal,
    onMutate: () => {
      toast.loading("Updating proposal...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      if (data) {
        // Invalidate queries to force an immediate refetch
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        
        toast.success("Proposal updated successfully");
        console.log("Proposal updated successfully:", data);
        
        // Force an immediate refetch
        queryClient.refetchQueries({ queryKey: ["proposals"] });
      }
    },
    onError: (error: any) => {
      toast.dismiss();
      console.error("Proposal update error:", error);
      toast.error(`Error updating proposal: ${error.message || "Unknown error"}`);
    }
  });

  return {
    createProposal: createProposalMutation.mutateAsync,
    updateProposalMutation,
    isPending: createProposalMutation.isPending || updateProposalMutation.isPending,
  };
}
