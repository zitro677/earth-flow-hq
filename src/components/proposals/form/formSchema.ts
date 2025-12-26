
import { z } from "zod";

// Define the item schema separately for reuse
const itemSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Quantity must be at least 1" }),
  unitPrice: z.coerce
    .number()
    .min(0.01, { message: "Price must be greater than 0" }),
});

export const proposalFormSchema = z.object({
  client: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  proposalDate: z.string(),
  expirationDate: z.string(),
  items: z.array(itemSchema),
  scope: z.string().min(10, {
    message: "Project scope is required and must be detailed.",
  }),
  timeline: z.string().min(5, {
    message: "Timeline is required.",
  }),
  notes: z.string().optional(),
});

// Export the item schema type for reuse
export type ProposalItemType = z.infer<typeof itemSchema>;
export type ProposalFormValues = z.infer<typeof proposalFormSchema>;
