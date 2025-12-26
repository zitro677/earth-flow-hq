
import React from "react";
import { motion } from "framer-motion";
import { Proposal } from "./types";

interface ProposalStatsProps {
  proposals: Proposal[];
}

const ProposalStats: React.FC<ProposalStatsProps> = ({ proposals }) => {
  const formatAmount = (amount: number | null | undefined) => {
    return amount ? Number(amount) : 0;
  };

  const totalAmount = proposals.reduce(
    (sum, proposal) => sum + formatAmount(proposal.amount),
    0
  );

  const pendingAmount = proposals
    .filter((proposal) => proposal.status === "Pending")
    .reduce(
      (sum, proposal) => sum + formatAmount(proposal.amount),
      0
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-primary/10 rounded-lg p-6"
      >
        <h3 className="text-sm font-medium text-primary">Monto Total</h3>
        <p className="text-3xl font-bold mt-2">${totalAmount.toLocaleString('es-ES')}</p>
        <p className="text-sm text-muted-foreground mt-1">
          De {proposals.length} propuestas
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-purple-500/10 rounded-lg p-6"
      >
        <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">
          Monto Pendiente
        </h3>
        <p className="text-3xl font-bold mt-2">${pendingAmount.toLocaleString('es-ES')}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {proposals.filter((proposal) => proposal.status === "Pending").length} propuestas pendientes
        </p>
      </motion.div>
    </div>
  );
};

export default ProposalStats;
