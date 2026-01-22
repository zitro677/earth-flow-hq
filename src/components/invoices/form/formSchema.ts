
import { z } from "zod";

export const formSchema = z.object({
  client_id: z.string().min(1, {
    message: "Please select a client.",
  }),
  client: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  address: z.string().optional().default(""),
  invoiceDate: z.string(),
  dueDate: z.string(),
  items: z.array(
    z.object({
      description: z.string().min(1, { message: "Description is required" }),
      quantity: z.coerce
        .number()
        .min(1, { message: "Quantity must be at least 1" }),
      unitPrice: z.coerce
        .number()
        .min(0.01, { message: "Price must be greater than 0" }),
    })
  ),
  notes: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof formSchema>;

// Define the item type for reuse across components
export type InvoiceItemType = {
  description: string;
  quantity: number;
  unitPrice: number;
};
