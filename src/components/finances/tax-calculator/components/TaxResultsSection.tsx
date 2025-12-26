
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TaxResults } from '../hooks/useTaxCalculator';

interface TaxResultsSectionProps {
  taxResults: TaxResults;
}

export const TaxResultsSection: React.FC<TaxResultsSectionProps> = ({ taxResults }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(value);
  };

  const taxBreakdown = [
    {
      name: "Tax Paid",
      value: taxResults.estimatedTax,
      color: "#f43f5e",
    },
    {
      name: "After-Tax Income",
      value: taxResults.totalIncome - taxResults.estimatedTax,
      color: "#10b981",
    },
  ];

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle>Tax Calculation Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { label: "Total Income", value: taxResults.totalIncome },
          { label: "Total Deductions", value: taxResults.totalDeductions, className: "text-green-600 dark:text-green-400" },
          { label: "Taxable Income", value: taxResults.taxableIncome },
          { label: "Estimated Tax", value: taxResults.estimatedTax, className: "text-red-600 dark:text-red-400" },
          { label: "Effective Tax Rate", value: taxResults.effectiveTaxRate, isPercent: true },
          { label: "After-Tax Income", value: taxResults.totalIncome - taxResults.estimatedTax, isBold: true }
        ].map(({ label, value, className, isPercent, isBold }) => (
          <div key={label}>
            <Label className="text-muted-foreground">{label}</Label>
            <p 
              className={`text-xl ${className || ''} ${isBold ? 'font-bold' : 'font-semibold'} truncate`} 
              title={isPercent ? `${value.toFixed(1)}%` : formatCurrency(value)}
            >
              {isPercent ? `${value.toFixed(1)}%` : formatCurrency(value)}
            </p>
          </div>
        ))}
        
        <Separator />

        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taxBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {taxBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => {
                  // Ensure value is treated as a number
                  const numValue = typeof value === 'number' ? value : parseFloat(value);
                  return [formatCurrency(numValue), undefined];
                }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "8px",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
