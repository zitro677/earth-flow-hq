
import { supabase } from "@/integrations/supabase/client";
import { Proposal } from "../../types";

export const getProposals = async (): Promise<Proposal[]> => {
  try {
    // Get the current session to access user ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No authenticated user session");
      return [];
    }

    // Try the standard query first
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          clients!client_id (
            name,
            email
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Process the data to add client_name to each proposal
      return data.map((proposal: any) => ({
        ...proposal,
        client_name: proposal.clients?.name || 'Unknown Client',
      })) as Proposal[];

    } catch (error: any) {
      // If the first query fails due to recursion, try a simpler approach
      if (error.message && error.message.includes('infinite recursion')) {
        console.error("Unexpected error fetching proposals:", error);
        console.log("Retrying proposals query, attempt: 1", "Error:", error);

        // Simplified approach without joins
        const { data: proposalsData, error: proposalsError } = await supabase
          .from('proposals')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (proposalsError) {
          throw proposalsError;
        }

        // If we got proposals data, get client data separately
        if (proposalsData && proposalsData.length > 0) {
          const clientIds = proposalsData
            .filter(p => p.client_id)
            .map(p => p.client_id);

          // Get client data if we have any client IDs
          if (clientIds.length > 0) {
            const { data: clientsData, error: clientsError } = await supabase
              .from('clients')
              .select('id, name')
              .in('id', clientIds);

            if (clientsError) {
              console.error("Error fetching client data:", clientsError);
            }

            // Map client names to proposals
            return proposalsData.map((proposal: any) => {
              const client = clientsData?.find(c => c.id === proposal.client_id);
              return {
                ...proposal,
                client_name: client?.name || 'Unknown Client',
              };
            }) as Proposal[];
          }

          // If no client IDs, just return the proposals
          return proposalsData.map((proposal: any) => ({
            ...proposal,
            client_name: 'Unknown Client',
          })) as Proposal[];
        }

        return [];
      } else {
        // For other errors, just propagate
        throw error;
      }
    }
  } catch (error) {
    console.error("Unexpected error fetching proposals:", error);
    return [];
  }
};
