
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { proposalFormSchema, ProposalItemType } from "../formSchema";
import { getProposalById } from "../../queries/useProposalQueries";

export function useProposalFormData(
  form: UseFormReturn<z.infer<typeof proposalFormSchema>>,
  setIsLoading: (loading: boolean) => void
) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Effect to load existing proposal data if editing
  useEffect(() => {
    const loadProposal = async () => {
      if (!id) return;
      
      setIsEditMode(true);
      setIsLoading(true);
      
      try {
        const proposal = await getProposalById(id);
        
        if (proposal) {
          console.log("Loaded proposal for editing:", proposal);
          
          // Extract proposal items with proper type assertion
          const items = proposal.items?.filter(item => item.type === 'item').map(item => ({
            description: item.description || "",
            quantity: item.quantity || 1,
            unitPrice: item.unit_price || 0
          } as ProposalItemType)) || [];
          
          // If no items found, add a default empty one
          if (items.length === 0) {
            items.push({
              description: "",
              quantity: 1,
              unitPrice: 0
            } as ProposalItemType);
          }
          
          // Find scope, timeline and notes items
          const scopeItem = proposal.items?.find(item => item.type === 'scope');
          const timelineItem = proposal.items?.find(item => item.type === 'timeline');
          const notesItem = proposal.items?.find(item => item.type === 'note');
          
          // Create a complete form data object before resetting the form
          // This prevents partial updates that could cause flickering
          const formData = {
            client: proposal.client_name || proposal.title?.replace("Proposal for ", "") || "",
            email: proposal.clients?.email || "",
            phone: proposal.clients?.phone || "",
            address: proposal.clients?.address || "",
            proposalDate: proposal.issue_date || form.getValues("proposalDate"),
            expirationDate: proposal.valid_until || form.getValues("expirationDate"),
            items: items,
            scope: scopeItem?.description || "",
            timeline: timelineItem?.description || "",
            notes: notesItem?.description || ""
          };
          
          // Use a single atomic update to prevent flickering
          form.reset(formData);
        } else {
          console.error("Proposal not found:", id);
          navigate("/proposals");
        }
      } catch (error) {
        console.error("Error loading proposal:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      loadProposal();
    }
  }, [id, navigate, form, setIsLoading]);

  return {
    isEditMode,
    id,
    navigate
  };
}
