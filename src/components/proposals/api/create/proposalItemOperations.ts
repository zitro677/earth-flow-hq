
import { supabase } from "@/integrations/supabase/client";

type ProposalItemBase = {
  proposal_id: string;
  description: string;
};

type ProposalLineItem = ProposalItemBase & {
  quantity: number;
  unit_price: number;
  type: 'item';
};

type ProposalContentItem = ProposalItemBase & {
  type: 'scope' | 'timeline' | 'note';
};

/**
 * Adds line items to a proposal
 */
export const addProposalLineItems = async (proposalId: string, items: {
  description: string;
  quantity: number;
  unitPrice: number;
}[]) => {
  if (items.length === 0) return;
  
  const proposalItemsData = items.map(item => ({
    proposal_id: proposalId,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    type: 'item' as const
  }));

  const { error } = await supabase
    .from('proposal_items')
    .insert(proposalItemsData);

  if (error) {
    console.error('Error adding proposal items:', error);
    throw error;
  }
};

/**
 * Adds content sections to a proposal (scope, timeline, notes)
 */
export const addProposalContentSections = async (proposalId: string, sections: {
  scope?: string;
  timeline?: string;
  notes?: string;
}) => {
  const items: ProposalContentItem[] = [];
  
  if (sections.scope) {
    items.push({
      proposal_id: proposalId,
      description: sections.scope,
      type: 'scope'
    });
  }

  if (sections.timeline) {
    items.push({
      proposal_id: proposalId,
      description: sections.timeline,
      type: 'timeline'
    });
  }

  if (sections.notes) {
    items.push({
      proposal_id: proposalId,
      description: sections.notes,
      type: 'note'
    });
  }
  
  if (items.length === 0) return;
  
  const { error } = await supabase
    .from('proposal_items')
    .insert(items);

  if (error) {
    console.error('Error adding proposal content sections:', error);
    throw error;
  }
};
