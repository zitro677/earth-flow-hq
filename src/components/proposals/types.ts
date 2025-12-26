
import { Database } from "@/integrations/supabase/types";

export type Proposal = Database["public"]["Tables"]["proposals"]["Row"] & {
  client_name?: string;
  clients?: {
    name?: string;
    email?: string;
    address?: string;
    phone?: string;
  };
  items?: ProposalItem[];
  // Add these fields to match what we're using in the code
  scope?: string;
  timeline?: string;
  notes?: string;
};

// Updated to match exactly what the database accepts
export type ProposalStatus = "Draft" | "Sent" | "Approved" | "Rejected";

export type ProposalFormData = {
  client: string;
  email: string;
  phone?: string;
  address: string;
  proposalDate: string;
  expirationDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  scope: string;
  timeline: string;
  notes: string;
  formattedContent?: string; // Added for better section handling
};

export type ProposalItem = {
  id: string;
  proposal_id: string;
  type: 'scope' | 'timeline' | 'item' | 'note';
  description: string;
  quantity?: number;
  unit_price?: number;
  created_at?: string;
  updated_at?: string;
};
