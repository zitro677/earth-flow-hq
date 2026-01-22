
import React from "react";
import { motion } from "framer-motion";

interface FinancialStatsProps {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  profitMargin: string;
  yearFilter: string;
}

const FinancialStats: React.FC<FinancialStatsProps> = ({
  totalIncome,
  totalExpenses,
  netIncome,
  profitMargin,
  yearFilter,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {[
        { label: "Total Income", value: totalIncome, delay: 0.1 },
        { label: "Total Expenses", value: totalExpenses, delay: 0.2 },
        { label: "Net Income", value: netIncome, delay: 0.3 },
        { label: "Profit Margin", value: parseFloat(profitMargin), isPercent: true, delay: 0.4 }
      ].map(({ label, value, delay, isPercent }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay }}
          className="glass-card rounded-lg p-4"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{label}</h3>
          <div className="overflow-hidden">
            <p 
              className="text-xl xl:text-2xl font-bold truncate" 
              title={isPercent ? `${value.toFixed(1)}%` : formatCurrency(value)}
            >
              {isPercent ? `${value.toFixed(1)}%` : formatCurrency(value)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">For {yearFilter}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default FinancialStats;

