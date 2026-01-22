
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Invoice } from "../types";

// Create invoice mutation
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      invoice, 
      items 
    }: { 
      invoice: Partial<Invoice>; 
      items: Array<{ description: string; quantity: number; unit_price: number }>;
    }) => {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No authenticated user session");
      }
      
      // Make sure required fields are present for insert
      const invoiceToInsert = {
        ...invoice,
        user_id: session.user.id,
        // Ensure required fields have values
        amount: invoice.amount || 0,
        issue_date: invoice.issue_date || new Date().toISOString().split('T')[0],
        due_date: invoice.due_date || new Date().toISOString().split('T')[0],
        invoice_number: invoice.invoice_number || `INV-${Date.now()}`,
      };
      
      // Insert the invoice
      const { data, error } = await supabase
        .from("invoices")
        .insert(invoiceToInsert)
        .select()
        .single();
        
      if (error) throw error;
      
      // Insert invoice items
      if (items && items.length > 0) {
        const invoiceItems = items.map(item => ({
          invoice_id: data.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.quantity * item.unit_price,
        }));
        
        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(invoiceItems);
          
        if (itemsError) {
          console.error("Error creating invoice items:", itemsError);
          throw itemsError;
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

// Update invoice mutation
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      invoice, 
      items 
    }: { 
      id: string; 
      invoice: Omit<Partial<Invoice>, 'clients' | 'items' | 'client_name'>; 
      items: Array<{ description: string; quantity: number; unit_price: number }>;
    }) => {
      // Update invoice - remove extended properties before sending to Supabase
      const { data, error } = await supabase
        .from("invoices")
        .update(invoice)
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Delete existing invoice items
      const { error: deleteError } = await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", id);
        
      if (deleteError) throw deleteError;
      
      // Insert new invoice items
      if (items && items.length > 0) {
        const invoiceItems = items.map(item => ({
          invoice_id: id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.quantity * item.unit_price,
        }));
        
        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(invoiceItems);
          
        if (itemsError) throw itemsError;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", variables.id] });
    },
  });
};

// Update invoice status mutation
export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("invoices")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

// Delete invoice mutation
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // First delete associated invoice items
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", id);
        
      if (itemsError) throw itemsError;
      
      // Then delete the invoice
      const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};
