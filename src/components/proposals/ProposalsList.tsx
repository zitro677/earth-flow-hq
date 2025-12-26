
import React from "react";
import { motion } from "framer-motion";
import ProposalCard from "./ProposalCard";
import { Proposal } from "./types";

interface ProposalsListProps {
  proposals: Proposal[];
  isLoading: boolean;
  isError: boolean;
  filteredAndSortedProposals: Proposal[];
}

const ProposalsList: React.FC<ProposalsListProps> = ({
  filteredAndSortedProposals,
  isLoading,
  isError
}) => {
  // Log the number of proposals to debug
  console.log(`Rendering ProposalsList with ${filteredAndSortedProposals.length} proposals`);
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading proposals...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading proposals. Please try again.</p>
      </div>
    );
  }

  if (filteredAndSortedProposals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-muted-foreground">No proposals found.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAndSortedProposals.map((proposal, index) => (
        <ProposalCard 
          key={proposal.id} 
          proposal={proposal}
          index={index} 
        />
      ))}
    </div>
  );
};

export default ProposalsList;
