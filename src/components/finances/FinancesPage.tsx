
import React, { useState } from "react";
import AnimatedPage from "../shared/AnimatedPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaxCalculator from "./TaxCalculator";
import ExpenseTracker from "./ExpenseTracker";
import FinancesHeader from "./header/FinancesHeader";
import FinancialStats from "./stats/FinancialStats";
import IncomeExpenseChart from "./charts/IncomeExpenseChart";
import ProjectIncomeChart from "./charts/ProjectIncomeChart";
import ExpenseBreakdownChart from "./charts/ExpenseBreakdownChart";
import { useFinancialData } from "./hooks/useFinancialData";
import { InventoryPage } from "./inventory/InventoryPage";

const FinancesPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<string>("year");
  const [yearFilter, setYearFilter] = useState<string>("2025");

  const { 
    monthlyIncomeData, 
    projectIncomeData, 
    expenseBreakdownData,
    totalIncome,
    totalExpenses,
    netIncome,
    profitMargin,
    isLoading 
  } = useFinancialData(yearFilter);

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="page-container">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading financial data...</div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-container">
        <FinancesHeader
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
        />

        <FinancialStats
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          netIncome={netIncome}
          profitMargin={profitMargin}
          yearFilter={yearFilter}
        />

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expense Tracking</TabsTrigger>
            <TabsTrigger value="taxes">Tax Calculator</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <IncomeExpenseChart data={monthlyIncomeData} yearFilter={yearFilter} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProjectIncomeChart data={projectIncomeData} />
              <ExpenseBreakdownChart data={expenseBreakdownData} />
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="pt-4">
            <ExpenseTracker />
          </TabsContent>

          <TabsContent value="taxes" className="pt-4">
            <TaxCalculator />
          </TabsContent>

          <TabsContent value="inventory" className="pt-4">
            <InventoryPage />
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default FinancesPage;
