
import React from "react";
import { motion } from "framer-motion";
import { Invoice } from "./types";

interface InvoiceStatsProps {
  invoices: Invoice[];
}

const InvoiceStats: React.FC<InvoiceStatsProps> = ({ invoices }) => {
  // Make sure invoices is an array and handle undefined/null
  const invoicesArray = Array.isArray(invoices) ? invoices : [];
  
  // Calculate total and pending amounts
  const totalAmount = invoicesArray.reduce((sum, invoice) => sum + (Number(invoice.amount) || 0), 0);
  const invoicesCount = invoicesArray.length;
  
  const pendingInvoices = invoicesArray.filter(invoice => 
    invoice.status === "Pending" || invoice.status === "pending"
  );
  const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + (Number(invoice.amount) || 0), 0);
  const pendingCount = pendingInvoices.length;

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
          De {invoicesCount} facturas
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-yellow-500/10 rounded-lg p-6"
      >
        <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
          Monto Pendiente
        </h3>
        <p className="text-3xl font-bold mt-2">${pendingAmount.toLocaleString('es-ES')}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {pendingCount} facturas sin pagar
        </p>
      </motion.div>
    </div>
  );
};

export default InvoiceStats;
