
// This file re-exports all API functions for easy import in other files

// Fetch operations
export { getProposals } from './fetch/getProposals';
export { getProposalById } from './fetch/getProposalById';

// Create operations
export { createProposal } from './create/createProposal';

// Update operations
export { updateProposal } from './update/updateProposal';

// Delete operations
export { deleteProposal } from './delete/deleteProposal';

// Utility functions
export { calculateTotalAmount, formatProposalContent } from './create/proposalCreation';
