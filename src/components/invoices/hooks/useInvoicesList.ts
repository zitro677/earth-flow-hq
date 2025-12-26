
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Invoice } from "../types";

export const useInvoicesList = () => {
  const { 
    data: invoices = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      try {
        // Get the current session for the user ID
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error("No authenticated user session");
        }

        try {
          // Standard query with joins
          const { data, error } = await supabase
            .from("invoices")
            .select(`
              *,
              clients!client_id (
                name,
                email
              )
            `)
            .eq('user_id', session.user.id)
            .order("issue_date", { ascending: false });

          if (error) {
            throw error;
          }

          return data.map((invoice: any) => ({
            ...invoice,
            client_name: invoice.clients?.name || "Unknown Client",
          })) as Invoice[];

        } catch (error: any) {
          // If recursion error, try a simpler approach
          if (error.message && error.message.includes('infinite recursion')) {
            console.log("Detected recursion error in invoices, using alternate query");

            // Get invoices directly without joins
            const { data: invoicesData, error: invoicesError } = await supabase
              .from("invoices")
              .select("*")
              .eq('user_id', session.user.id)
              .order("issue_date", { ascending: false });

            if (invoicesError) {
              throw invoicesError;
            }

            // If we have invoices with client IDs, get the clients separately
            if (invoicesData && invoicesData.length > 0) {
              const clientIds = invoicesData
                .filter(inv => inv.client_id)
                .map(inv => inv.client_id);

              if (clientIds.length > 0) {
                const { data: clientsData, error: clientsError } = await supabase
                  .from('clients')
                  .select('id, name')
                  .in('id', clientIds);

                if (clientsError) {
                  console.error("Error fetching client data for invoices:", clientsError);
                }

                // Map client names to invoices
                return invoicesData.map((invoice: any) => {
                  const client = clientsData?.find(c => c.id === invoice.client_id);
                  return {
                    ...invoice,
                    client_name: client?.name || 'Unknown Client',
                  };
                }) as Invoice[];
              }
            }

            // If no client IDs or no clients data, just return invoices
            return (invoicesData || []).map((invoice: any) => ({
              ...invoice,
              client_name: 'Unknown Client',
            })) as Invoice[];
          } else {
            // For other errors, just propagate
            throw error;
          }
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        toast.error("Failed to load invoices");
        throw err;
      }
    },
  });

  return {
    invoices: invoices || [],
    isLoading,
    error,
    refetch,
  };
};
