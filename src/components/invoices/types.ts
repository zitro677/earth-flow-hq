
import { Database } from "@/integrations/supabase/types";

export type Invoice = Database["public"]["Tables"]["invoices"]["Row"] & {
  client_name?: string;
  clients?: {
    name?: string;
    email?: string;
    address?: string;
  };
  items?: InvoiceItem[];
};

export type InvoiceItem = Database["public"]["Tables"]["invoice_items"]["Row"];

export type InvoiceStatus = "Draft" | "Pending" | "Paid" | "Overdue" | "Cancelled";

export type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
};
