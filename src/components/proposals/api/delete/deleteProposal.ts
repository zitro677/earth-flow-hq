
import { supabase } from "@/integrations/supabase/client";

export const deleteProposal = async (id: string): Promise<boolean> => {
  try {
    // Get the proposal to retrieve client_id
    const { data: proposalData, error: proposalError } = await supabase
      .from('proposals')
      .select('client_id')
      .eq('id', id)
      .single();

    if (proposalError) {
      console.error('Error fetching proposal for deletion:', proposalError);
      return false;
    }

    // Delete proposal_items associated with the proposal
    const { error: deleteItemsError } = await supabase
      .from('proposal_items')
      .delete()
      .eq('proposal_id', id);

    if (deleteItemsError) {
      console.error('Error deleting proposal items:', deleteItemsError);
      return false;
    }

    // Delete the proposal
    const { error: deleteProposalError } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);

    if (deleteProposalError) {
      console.error('Error deleting proposal:', deleteProposalError);
      return false;
    }

    // Delete the client (assuming no other proposals are linked to this client)
    const { error: deleteClientError } = await supabase
      .from('clients')
      .delete()
      .eq('id', proposalData.client_id);

    if (deleteClientError) {
      console.error('Error deleting client:', deleteClientError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProposal:', error);
    return false;
  }
};
