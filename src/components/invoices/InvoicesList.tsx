
import React from "react";
import { motion } from "framer-motion";
import InvoiceCard from "./InvoiceCard";
import { Invoice } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface InvoicesListProps {
  invoices: Invoice[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  filteredAndSortedInvoices?: Invoice[];
}

const InvoicesList: React.FC<InvoicesListProps> = ({ 
  invoices, 
  isLoading,
  isError,
  errorMessage,
  filteredAndSortedInvoices
}) => {
  // Use the filteredAndSortedInvoices if provided, otherwise use the raw invoices
  const displayInvoices = filteredAndSortedInvoices || invoices;
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">Loading invoices...</p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage || "Error loading invoices. Please try again."}
          </AlertDescription>
        </Alert>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-red-500">There was a problem retrieving invoice data.</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {displayInvoices.map((invoice, index) => (
        <InvoiceCard key={invoice.id} invoice={invoice} index={index} />
      ))}

      {displayInvoices.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No invoices found.</p>
        </motion.div>
      )}
    </div>
  );
};

export default InvoicesList;
