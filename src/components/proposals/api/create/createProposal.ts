
import { Proposal, ProposalFormData } from "../../types";
import { getAuthenticatedUserId } from "../utils/sessionUtils";
import { findClientByEmail, updateClient, createClient, getClientById } from "./clientOperations";
import { addProposalLineItems, addProposalContentSections } from "./proposalItemOperations";
import { createProposalRecord, calculateTotalAmount, formatProposalContent } from "./proposalCreation";

/**
 * Creates a new proposal with all associated data (client, items, etc.)
 */
export const createProposal = async (proposalData: ProposalFormData): Promise<Proposal | null> => {
  try {
    // Get the authenticated user ID
    const userId = await getAuthenticatedUserId();
    console.log('Creating proposal for user:', userId);
    console.log('Proposal data:', proposalData);
    
    // Find or create client
    let client = await findClientByEmail(proposalData.email, userId);
    
    if (client) {
      // Update existing client
      client = await updateClient(client.id, {
        name: proposalData.client,
        email: proposalData.email,
        phone: proposalData.phone,
        address: proposalData.address
      }, userId);
    } else {
      // Create new client
      client = await createClient({
        name: proposalData.client,
        email: proposalData.email,
        phone: proposalData.phone,
        address: proposalData.address
      }, userId);
    }

    if (!client) {
      throw new Error('Client could not be created or retrieved');
    }
    
    console.log('Client created/updated:', client);

    // Calculate total amount from items
    const totalAmount = calculateTotalAmount(proposalData.items);

    // Format content for better organization
    const formattedContent = proposalData.formattedContent || 
      formatProposalContent({
        scope: proposalData.scope,
        timeline: proposalData.timeline,
        items: proposalData.items,
        notes: proposalData.notes
      });

    // Create the proposal record
    const proposal = await createProposalRecord({
      client_id: client.id,
      title: `Proposal for ${proposalData.client}`,
      issue_date: proposalData.proposalDate,
      valid_until: proposalData.expirationDate,
      amount: totalAmount,
      content: formattedContent,
      user_id: userId
    });
    
    console.log('Proposal created:', proposal);

    // Fetch client details separately to avoid relationship conflicts
    let clientDetails;
    try {
      clientDetails = await getClientById(client.id);
    } catch (error) {
      console.error('Error fetching client details:', error);
      // Continue despite client fetch errors, as the main proposal is created
      clientDetails = {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address
      };
    }

    // Add proposal items
    try {
      await addProposalLineItems(proposal.id, proposalData.items);
    } catch (error) {
      console.error('Error adding proposal items:', error);
      // Continue despite item errors, as the main proposal is created
    }

    // Add scope, timeline, and notes as separate items
    try {
      await addProposalContentSections(proposal.id, {
        scope: proposalData.scope,
        timeline: proposalData.timeline,
        notes: proposalData.notes
      });
    } catch (error) {
      console.error('Error adding additional proposal items:', error);
      // Continue despite additional item errors
    }

    // Return the created proposal with client details manually attached
    return {
      ...proposal,
      client_name: client.name,
      clients: clientDetails ? {
        name: clientDetails.name,
        email: clientDetails.email,
        phone: clientDetails.phone,
        address: clientDetails.address
      } : {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address
      }
    };
  } catch (error) {
    console.error('Error in createProposal:', error);
    throw error; // Re-throw the error so it can be properly handled by the mutation
  }
};
