
import { supabase } from "@/integrations/supabase/client";
import { Proposal } from "../../types";

export const getProposalById = async (id: string): Promise<Proposal | null> => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        clients!client_id (
          name,
          email,
          address,
          phone
        ),
        items: proposal_items (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching proposal:", error);
      return null;
    }

    // Enhance the proposal with client details directly in the proposal object
    const proposalWithClientName = {
      ...data,
      client_name: data.clients?.name || 'Unknown Client', // Default to 'Unknown Client' if no name
    };

    return proposalWithClientName as Proposal;
  } catch (error) {
    console.error("Unexpected error fetching proposal:", error);
    return null;
  }
};
