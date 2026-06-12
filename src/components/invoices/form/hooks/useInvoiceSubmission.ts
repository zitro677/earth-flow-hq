
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCreateInvoice, useUpdateInvoice } from "../../useInvoices";
import { formSchema, InvoiceFormValues } from "../formSchema";
import { getWorkspaceUserId } from "@/lib/workspace";

export const useInvoiceSubmission = (
  form: UseFormReturn<z.infer<typeof formSchema>>, 
  invoiceId?: string
) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<boolean>(false);
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();
  const isEditMode = Boolean(invoiceId);

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `INV-${year}-${randomPart}`;
  };

  const onSubmit = async (values: InvoiceFormValues) => {
    setIsLoading(true);
    
    try {
      if (!user) {
        console.error("User is not authenticated");
        setAuthError(true);
        setIsLoading(false);
        return;
      }
      
      const category = (values as any).category === "efectivo" ? "efectivo" : "aliaddo";
      const taxRate = category === "efectivo" ? 0 : 0.19;
      const subtotal = values.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      const totalAmount = subtotal + subtotal * taxRate;

      const invoiceData: any = {
        user_id: getWorkspaceUserId(user.id),
        client_id: values.client_id,
        invoice_number: isEditMode ? undefined : generateInvoiceNumber(),
        issue_date: values.invoiceDate,
        due_date: values.dueDate,
        amount: totalAmount,
        tax_rate: taxRate,
        category,
        notes: values.notes,
        status: isEditMode ? undefined : "Pending",
      };
      
      console.log(`${isEditMode ? "Updating" : "Submitting"} invoice:`, invoiceData);
      
      const invoiceItems = values.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }));
      
      if (isEditMode && invoiceId) {
        await updateInvoice.mutateAsync({
          id: invoiceId,
          invoice: invoiceData,
          items: invoiceItems,
        });
        toast.success("Invoice updated successfully");
      } else {
        await createInvoice.mutateAsync({
          invoice: invoiceData,
          items: invoiceItems,
        });
        toast.success("Invoice created successfully");
      }
      
      navigate("/invoices");
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} invoice:`, error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to ${isEditMode ? "update" : "create"} invoice: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { onSubmit, isLoading, authError };
};
