
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Proposal } from "./types";
import { ArrowUpRight, Check, Clock, X } from "lucide-react";
import ProposalActions from "./ProposalActions";

interface ProposalCardProps {
  proposal: Proposal;
  index: number;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, index }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
      case "sent":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "draft":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Check className="h-3 w-3" />;
      case "pending":
      case "sent":
        return <Clock className="h-3 w-3" />;
      case "rejected":
        return <X className="h-3 w-3" />;
      default:
        return null;
    }
  };

  // Generate a shorter, more readable ID format
  const shortId = proposal.id.includes('-') 
    ? `PRO-${proposal.id.split('-')[0].slice(-4)}`
    : `PRO-${new Date().getFullYear()}-${index + 1}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden card-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{proposal.client_name}</h3>
                <Badge className={getStatusColor(proposal.status || "Draft")}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(proposal.status || "Draft")}
                    {proposal.status || "Draft"}
                  </span>
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                <span className="inline-flex items-center">
                  {shortId} • Created: {proposal.issue_date || new Date(proposal.created_at || "").toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                <span>Expires: {proposal.valid_until || "-"}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-right">
                <div className="font-semibold">
                  {proposal.amount ? `$${proposal.amount.toLocaleString()}` : "$0.00"}
                </div>
              </div>
              <ProposalActions proposal={proposal} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProposalCard;
