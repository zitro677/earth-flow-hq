
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
          <p className="text-muted-foreground">Cargando facturas...</p>
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
            {errorMessage || "Error al cargar las facturas. Inténtalo de nuevo."}
          </AlertDescription>
        </Alert>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-red-500">Hubo un problema al obtener los datos de facturas.</p>
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
          <p className="text-muted-foreground">No se encontraron facturas.</p>
        </motion.div>
      )}
    </div>
  );
};

export default InvoicesList;
