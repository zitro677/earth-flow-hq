
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ExpenseStatsProps {
  totalExpenses: number;
  deductibleExpenses: number;
  potentialTaxSavings: number;
  totalMiles?: number;
  totalMileageDeduction?: number;
}

export const ExpenseStats: React.FC<ExpenseStatsProps> = ({
  totalExpenses,
  deductibleExpenses,
  potentialTaxSavings,
  totalMiles = 0,
  totalMileageDeduction = 0,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
      <Card className="card-shadow">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
          <p className="text-2xl font-bold mt-2">
            ${totalExpenses.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Deductible Expenses</h3>
          <p className="text-2xl font-bold mt-2">
            ${deductibleExpenses.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Potential Tax Savings</h3>
          <p className="text-2xl font-bold mt-2">
            ${potentialTaxSavings.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Based on 30% tax rate</p>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Miles</h3>
          <p className="text-2xl font-bold mt-2">
            {totalMiles.toLocaleString()} mi
          </p>
          <p className="text-xs text-muted-foreground mt-1">At $0.67 per mile</p>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Mileage Deduction</h3>
          <p className="text-2xl font-bold mt-2">
            ${totalMileageDeduction.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
