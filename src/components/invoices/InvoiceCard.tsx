
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import InvoiceActions from "./InvoiceActions";
import { formatCurrency } from "./utils";
import { Invoice } from "./types";

interface InvoiceCardProps {
  invoice: Invoice;
  index: number;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, index }) => {
  const formattedAmount = formatCurrency(Number(invoice.amount));
  const formattedIssueDate = new Date(invoice.issue_date).toLocaleDateString();
  const formattedDueDate = new Date(invoice.due_date).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
      }}
    >
      <Card className="overflow-hidden hover-scale card-shadow">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
            <div className="flex flex-col mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{invoice.invoice_number}</h3>
                <StatusBadge status={invoice.status || "Pending"} />
              </div>
              <p className="text-muted-foreground mt-1">{invoice.client_name}</p>
              <div className="mt-2 flex flex-col sm:flex-row sm:gap-4 text-sm">
                <span>
                  <span className="text-muted-foreground">Issued:</span>{" "}
                  {formattedIssueDate}
                </span>
                <span>
                  <span className="text-muted-foreground">Due:</span>{" "}
                  {formattedDueDate}
                </span>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-2">
              <span className="text-xl font-bold">{formattedAmount}</span>
              <InvoiceActions invoice={invoice} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoiceCard;
