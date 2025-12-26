
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TaxExpenses } from '../hooks/useTaxCalculator';

interface TaxExpensesSectionProps {
  expenses: TaxExpenses;
  handleExpenseChange: (category: keyof TaxExpenses, value: string) => void;
}

export const TaxExpensesSection: React.FC<TaxExpensesSectionProps> = ({
  expenses,
  handleExpenseChange,
}) => {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle>Business Expenses & Deductions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(expenses).map(([category, value]) => (
            <div key={category}>
              <Label htmlFor={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)} ($)
              </Label>
              <Input
                id={category}
                type="number"
                min="0"
                value={value}
                onChange={(e) => handleExpenseChange(category as keyof TaxExpenses, e.target.value)}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
