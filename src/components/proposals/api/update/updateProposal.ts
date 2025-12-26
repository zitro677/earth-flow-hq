
import { supabase } from "@/integrations/supabase/client";
import { Proposal, ProposalFormData } from "../../types";
import { getAuthenticatedUserId } from "../utils/sessionUtils";
import { updateClient, getClientById } from "../create/clientOperations";
import { calculateTotalAmount, formatProposalContent } from "../create/proposalCreation";
import { addProposalLineItems, addProposalContentSections } from "../create/proposalItemOperations";

export const updateProposal = async ({ id, data }: { id: string, data: ProposalFormData }): Promise<Proposal | null> => {
  try {
    // Get the authenticated user ID
    const userId = await getAuthenticatedUserId();
    
    // First, get the current proposal to access the client_id
    const { data: currentProposal, error: fetchError } = await supabase
      .from('proposals')
      .select('client_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching current proposal:', fetchError);
      throw fetchError;
    }

    // Update client information
    const client = await updateClient(currentProposal.client_id, {
      name: data.client,
      email: data.email,
      phone: data.phone,
      address: data.address
    }, userId);

    // Calculate total amount from items
    const totalAmount = calculateTotalAmount(data.items);

    // Format content for better organization
    const formattedContent = data.formattedContent || 
      formatProposalContent({
        scope: data.scope,
        timeline: data.timeline,
        items: data.items,
        notes: data.notes
      });

    // Update the proposal
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .update({
        title: `Proposal for ${data.client}`,
        issue_date: data.proposalDate,
        valid_until: data.expirationDate,
        amount: totalAmount,
        content: formattedContent,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (proposalError) {
      console.error('Error updating proposal:', proposalError);
      throw proposalError;
    }

    // Delete all existing items for this proposal
    const { error: deleteError } = await supabase
      .from('proposal_items')
      .delete()
      .eq('proposal_id', id);

    if (deleteError) {
      console.error('Error deleting existing items:', deleteError);
      throw deleteError;
    }

    // Add new line items
    await addProposalLineItems(id, data.items);

    // Add content sections
    await addProposalContentSections(id, {
      scope: data.scope,
      timeline: data.timeline,
      notes: data.notes
    });

    // Return the updated proposal with client info
    return {
      ...proposal,
      client_name: client.name,
      clients: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address
      }
    };
  } catch (error) {
    console.error('Error in updateProposal:', error);
    throw error;
  }
};
