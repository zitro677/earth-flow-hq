
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { formSchema } from "./formSchema";
import { useInvoiceClients } from "./hooks/useInvoiceClients";
import { useInvoiceItems } from "./hooks/useInvoiceItems";
import { useInvoiceCalculations } from "./hooks/useInvoiceCalculations";
import { useInvoiceSubmission } from "./hooks/useInvoiceSubmission";
import { useCallback } from "react";
import { useInvoice } from "../useInvoices";

export const useInvoiceForm = (invoiceId?: string) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const defaultDueDate = format(
    new Date(new Date().setDate(new Date().getDate() + 30)),
    "yyyy-MM-dd"
  );

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      client: "",
      email: "",
      address: "",
      invoiceDate: today,
      dueDate: defaultDueDate,
      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
      notes: "",
    },
  });

  const { clients, isLoading: clientsLoading, handleClientChange } = useInvoiceClients(form);
  const { items, addItem, removeItem, setItems } = useInvoiceItems(form);
  const { subtotal, tax, total } = useInvoiceCalculations(items);
  const { onSubmit, isLoading: submissionLoading, authError } = useInvoiceSubmission(form, invoiceId);
  
  const { refetch: fetchInvoice } = useInvoice(invoiceId);

  const loadInvoiceData = useCallback(async (id: string) => {
    try {
      const { data: invoice } = await fetchInvoice();
      
      if (invoice) {
        console.log("Loaded invoice for editing:", invoice);
        
        // Update form with invoice data
        form.setValue("client_id", invoice.client_id || "");
        form.setValue("client", invoice.clients?.name || "");
        form.setValue("email", invoice.clients?.email || "");
        form.setValue("address", invoice.clients?.address || "");
        form.setValue("invoiceDate", invoice.issue_date || today);
        form.setValue("dueDate", invoice.due_date || defaultDueDate);
        form.setValue("notes", invoice.notes || "");
        
        // Format and set invoice items
        if (invoice.items && invoice.items.length > 0) {
          const formattedItems = invoice.items.map((item: any) => ({
            description: item.description || "",
            quantity: item.quantity || 1,
            unitPrice: item.unit_price || 0,
          }));
          form.setValue("items", formattedItems);
          setItems(formattedItems);
        }
      }
    } catch (error) {
      console.error("Error loading invoice:", error);
    }
  }, [fetchInvoice, form, setItems, today, defaultDueDate]);

  const isLoading = clientsLoading || submissionLoading;

  return {
    form,
    clients,
    isLoading,
    authError,
    items,
    subtotal,
    tax,
    total,
    handleClientChange,
    onSubmit,
    addItem,
    removeItem,
    loadInvoiceData,
  };
};
