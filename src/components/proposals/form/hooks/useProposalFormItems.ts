
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { proposalFormSchema, ProposalItemType } from "../formSchema";

export function useProposalFormItems(
  form: UseFormReturn<z.infer<typeof proposalFormSchema>>
) {
  const items = form.watch("items");
  
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxRate = 0.19; // IVA 19%
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const addItem = () => {
    form.setValue("items", [
      ...form.getValues("items"),
      { description: "", quantity: 1, unitPrice: 0 } as ProposalItemType,
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  return {
    items,
    subtotal,
    tax,
    total,
    addItem,
    removeItem,
  };
}
