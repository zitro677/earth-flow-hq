
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Invoice } from "../types";

export const useInvoice = (invoiceId?: string) => {
  return useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => {
      if (!invoiceId) return null;
      
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error("No authenticated user session");
        }

        // First try to get the invoice with client info
        try {
          const { data, error } = await supabase
            .from("invoices")
            .select(`
              *,
              clients!client_id (
                name,
                email,
                address
              ),
              items:invoice_items(*)
            `)
            .eq('id', invoiceId)
            .eq('user_id', session.user.id)
            .single();

          if (error) throw error;
          
          return data as Invoice;
          
        } catch (error: any) {
          // If recursion error or any other error, try a simpler approach
          console.log("Using alternate query approach for single invoice");
          
          // Get invoice without joins
          const { data: invoice, error: invoiceError } = await supabase
            .from("invoices")
            .select("*")
            .eq('id', invoiceId)
            .eq('user_id', session.user.id)
            .single();
            
          if (invoiceError) throw invoiceError;
          
          // Create the result object with the expected shape
          const result: any = { ...invoice };
          
          // Get client separately if needed
          if (invoice.client_id) {
            const { data: client, error: clientError } = await supabase
              .from('clients')
              .select('*')
              .eq('id', invoice.client_id)
              .single();
              
            if (!clientError && client) {
              result.clients = client;
            }
          }
          
          // Get invoice items
          const { data: items, error: itemsError } = await supabase
            .from('invoice_items')
            .select('*')
            .eq('invoice_id', invoiceId);
            
          if (!itemsError && items) {
            result.items = items;
          }
          
          return result as Invoice;
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
        toast.error("Failed to load invoice");
        throw err;
      }
    },
    enabled: !!invoiceId,
  });
};
