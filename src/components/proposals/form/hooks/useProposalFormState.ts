
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { z } from "zod";
import { proposalFormSchema, ProposalItemType } from "../formSchema";
import { useState } from "react";

export function useProposalFormState() {
  // Default date values
  const today = format(new Date(), "yyyy-MM-dd");
  const defaultExpirationDate = format(
    new Date(new Date().setDate(new Date().getDate() + 30)),
    "yyyy-MM-dd"
  );

  // Form state management
  const form = useForm<z.infer<typeof proposalFormSchema>>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      client: "",
      email: "",
      phone: "",
      address: "",
      proposalDate: today,
      expirationDate: defaultExpirationDate,
      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        } as ProposalItemType,
      ],
      scope: "",
      timeline: "",
      notes: "",
    },
  });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  return {
    form,
    isLoading,
    setIsLoading,
    today,
    defaultExpirationDate,
  };
}
