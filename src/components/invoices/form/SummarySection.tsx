
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface SummarySectionProps {
  subtotal: number;
  tax: number;
  total: number;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  subtotal,
  tax,
  total,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (7%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SummarySection;
