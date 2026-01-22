
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

interface SummarySectionProps {
  subtotal: number;
  tax: number;
  total: number;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ subtotal, tax, total }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Resumen</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IVA (19%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
