
import { supabase } from "@/integrations/supabase/client";
import { ProposalStatus } from "../../types";

/**
 * Creates a proposal in the database
 */
export const createProposalRecord = async (proposalData: {
  client_id: string;
  title: string;
  issue_date: string;
  valid_until: string;
  amount: number;
  content: string | null;
  user_id: string;
}) => {
  const { data: proposal, error } = await supabase
    .from('proposals')
    .insert({
      client_id: proposalData.client_id,
      title: proposalData.title,
      issue_date: proposalData.issue_date,
      valid_until: proposalData.valid_until,
      amount: proposalData.amount,
      content: proposalData.content,
      status: 'Draft' as ProposalStatus,
      user_id: proposalData.user_id
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating proposal:', error);
    throw error;
  }

  if (!proposal) {
    console.error('Proposal not created');
    throw new Error('Proposal could not be created');
  }
  
  return proposal;
};

/**
 * Calculates the total amount from line items
 */
export const calculateTotalAmount = (items: { quantity: number, unitPrice: number }[]): number => {
  return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
};

/**
 * Formats content sections into a single content string
 */
export const formatProposalContent = (data: {
  scope: string;
  timeline?: string;
  items?: { description: string; quantity: number; unitPrice: number }[];
  notes?: string;
}): string => {
  let formattedContent = data.scope;
  
  if (data.timeline && data.timeline.trim()) {
    formattedContent += `\n\nTimeline: ${data.timeline}`;
  }
  
  if (data.items && data.items.length > 0) {
    formattedContent += "\n\nItems:";
    data.items.forEach(item => {
      formattedContent += `\n- ${item.description}: ${item.quantity} x $${item.unitPrice.toFixed(2)}`;
    });
  }
  
  if (data.notes && data.notes.trim()) {
    formattedContent += `\n\nNotes: ${data.notes}`;
  }
  
  return formattedContent;
};
