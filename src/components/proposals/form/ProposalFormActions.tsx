
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { proposalFormSchema } from "./formSchema";

type FormData = z.infer<typeof proposalFormSchema>;

interface ProposalFormActionsProps {
  form: UseFormReturn<FormData>;
  isPending: boolean;
  position: "top" | "bottom";
  isEditMode?: boolean;
}

export const ProposalFormActions: React.FC<ProposalFormActionsProps> = ({ 
  form, 
  isPending,
  position,
  isEditMode = false
}) => {
  const navigate = useNavigate();
  
  // Only show back button at the top, and full button set at the bottom
  if (position === "top") {
    return (
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/proposals")}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Proposals
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Proposal" : "Create New Proposal"}
        </h1>
      </div>
    );
  }
  
  // Full button set at the bottom
  return (
    <div className="flex justify-end gap-2 mt-8">
      <Button type="button" variant="outline" onClick={() => navigate("/proposals")}>
        Cancel
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : isEditMode ? "Update Proposal" : "Save Proposal"}
      </Button>
    </div>
  );
};
