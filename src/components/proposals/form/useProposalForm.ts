
import { useProposalFormState } from "./hooks/useProposalFormState";
import { useProposalFormItems } from "./hooks/useProposalFormItems";
import { useProposalFormData } from "./hooks/useProposalFormData";
import { useProposalFormSubmission } from "./hooks/useProposalFormSubmission";

export const useProposalForm = () => {
  // Core form state
  const { form, isLoading, setIsLoading } = useProposalFormState();
  
  // Item management
  const { items, subtotal, tax, total, addItem, removeItem } = useProposalFormItems(form);
  
  // Loading and edit mode handling
  const { isEditMode, id, navigate } = useProposalFormData(form, setIsLoading);
  
  // Form submission
  const { onSubmit, isPending } = useProposalFormSubmission(form, isEditMode, id);

  return {
    form,
    items,
    subtotal,
    tax,
    total,
    addItem,
    removeItem,
    onSubmit,
    isPending,
    isEditMode,
    isLoading
  };
};
