
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FinancialData {
  monthlyIncomeData: Array<{
    name: string;
    income: number;
    expenses: number;
  }>;
  projectIncomeData: Array<{
    name: string;
    value: number;
  }>;
  expenseBreakdownData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  profitMargin: string;
}

export const useFinancialData = (yearFilter: string) => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    monthlyIncomeData: [],
    projectIncomeData: [],
    expenseBreakdownData: [],
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    profitMargin: "0.0",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFinancialData = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          console.log("No authenticated user for financial data");
          setIsLoading(false);
          return;
        }

        console.log("Loading real financial data for user:", session.user.email);

        // Clear any synthetic data from localStorage for this specific user
        if (session.user.email === 'greenplanetlandscaping01@gmail.com') {
          console.log("Clearing all synthetic financial data for greenplanetlandscaping01@gmail.com");
          const keysToRemove = [
            'financial_data',
            'synthetic_financial_data',
            'demo_financial_data',
            'landscape_financial_data',
            'mock_financial_data'
          ];
          
          keysToRemove.forEach(key => {
            if (localStorage.getItem(key)) {
              console.log(`Removing synthetic financial data key: ${key}`);
              localStorage.removeItem(key);
            }
          });
        }

        const userId = session.user.id;
        const yearStart = `${yearFilter}-01-01`;
        const yearEnd = `${yearFilter}-12-31`;

        // Fetch invoices for income data
        const { data: invoices, error: invoicesError } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', userId)
          .gte('issue_date', yearStart)
          .lte('issue_date', yearEnd);

        if (invoicesError) {
          console.error("Error fetching invoices:", invoicesError);
        }

        // Fetch expenses
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', userId)
          .gte('date', yearStart)
          .lte('date', yearEnd);

        if (expensesError) {
          console.error("Error fetching expenses:", expensesError);
        }

        // Fetch projects for project income breakdown
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', userId);

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
        }

        console.log("Real financial data loaded:", {
          invoices: invoices?.length || 0,
          expenses: expenses?.length || 0,
          projects: projects?.length || 0
        });

        // Generate monthly income/expense data
        const monthlyData = generateMonthlyData(invoices || [], expenses || [], parseInt(yearFilter));
        
        // Generate project income data
        const projectIncomeData = generateProjectIncomeData(projects || [], invoices || []);
        
        // Generate expense breakdown data
        const expenseBreakdownData = generateExpenseBreakdownData(expenses || []);

        // Calculate totals
        const totalIncome = (invoices || [])
          .filter(inv => inv.status === 'Paid')
          .reduce((sum, inv) => sum + parseFloat(inv.amount.toString()), 0);
        
        const totalExpenses = (expenses || [])
          .reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0);

        const netIncome = totalIncome - totalExpenses;
        const profitMargin = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : "0.0";

        setFinancialData({
          monthlyIncomeData: monthlyData,
          projectIncomeData,
          expenseBreakdownData,
          totalIncome,
          totalExpenses,
          netIncome,
          profitMargin,
        });

      } catch (error) {
        console.error("Error loading financial data:", error);
        // Set empty data on error
        setFinancialData({
          monthlyIncomeData: [],
          projectIncomeData: [],
          expenseBreakdownData: [],
          totalIncome: 0,
          totalExpenses: 0,
          netIncome: 0,
          profitMargin: "0.0",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFinancialData();
  }, [yearFilter]);

  return { ...financialData, isLoading };
};

const generateMonthlyData = (invoices: any[], expenses: any[], year: number) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return months.map((month, index) => {
    const monthStart = new Date(year, index, 1);
    const monthEnd = new Date(year, index + 1, 0);

    const monthIncome = invoices
      .filter(inv => {
        if (!inv.issue_date) return false;
        const invoiceDate = new Date(inv.issue_date);
        return invoiceDate >= monthStart && 
               invoiceDate <= monthEnd && 
               inv.status === 'Paid';
      })
      .reduce((sum, inv) => sum + parseFloat(inv.amount.toString()), 0);

    const monthExpenses = expenses
      .filter(exp => {
        if (!exp.date) return false;
        const expenseDate = new Date(exp.date);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      })
      .reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0);

    return {
      name: month,
      income: monthIncome,
      expenses: monthExpenses,
    };
  });
};

const generateProjectIncomeData = (projects: any[], invoices: any[]) => {
  if (!projects.length && !invoices.length) return [];

  const projectIncomeMap = new Map();

  // Group invoices by project
  invoices
    .filter(inv => inv.project_id && inv.status === 'Paid')
    .forEach(inv => {
      const project = projects.find(p => p.id === inv.project_id);
      if (project) {
        const currentAmount = projectIncomeMap.get(project.name) || 0;
        projectIncomeMap.set(project.name, currentAmount + parseFloat(inv.amount.toString()));
      }
    });

  // Add projects without invoices but with budget (only if completed)
  projects.forEach(project => {
    if (!projectIncomeMap.has(project.name) && project.budget && project.status === 'Completed') {
      projectIncomeMap.set(project.name, parseFloat(project.budget.toString()));
    }
  });

  return Array.from(projectIncomeMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));
};

const generateExpenseBreakdownData = (expenses: any[]) => {
  if (!expenses.length) return [];

  const categoryColors = {
    'Materials': '#0ea5e9',
    'Equipment': '#f97316',
    'Labor': '#10b981',
    'Mileage': '#8b5cf6',
    'Utilities': '#f59e0b',
    'Insurance': '#ef4444',
    'Marketing': '#06b6d4',
    'Maintenance': '#84cc16',
    'Office': '#ec4899',
    'Other': '#64748b',
  };

  const categoryTotals = new Map();

  expenses.forEach(expense => {
    const category = expense.category || 'Other';
    const currentTotal = categoryTotals.get(category) || 0;
    categoryTotals.set(category, currentTotal + parseFloat(expense.amount.toString()));
  });

  return Array.from(categoryTotals.entries()).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name as keyof typeof categoryColors] || categoryColors.Other,
  }));
};
