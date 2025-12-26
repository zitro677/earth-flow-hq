
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface TaxExpenses {
  materials: number;
  equipment: number;
  labor: number;
  mileage: number;
  utilities: number;
  insurance: number;
  marketing: number;
  maintenance: number;
  office: number;
  other: number;
}

export interface TaxResults {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  estimatedTax: number;
  effectiveTaxRate: number;
}

export const useTaxCalculator = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState<TaxExpenses>({
    materials: 0,
    equipment: 0,
    labor: 0,
    mileage: 0,
    utilities: 0,
    insurance: 0,
    marketing: 0,
    maintenance: 0,
    office: 0,
    other: 0,
  });
  const [taxRate, setTaxRate] = useState(25);
  const [filingStatus, setFilingStatus] = useState("single");
  const [taxResults, setTaxResults] = useState<TaxResults>({
    totalIncome: 0,
    totalDeductions: 0,
    taxableIncome: 0,
    estimatedTax: 0,
    effectiveTaxRate: 0,
  });
  const [yearFilter, setYearFilter] = useState<string>("2025");

  // Load real financial data
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const userId = session.user.id;
        const yearStart = `${yearFilter}-01-01`;
        const yearEnd = `${yearFilter}-12-31`;

        // Fetch real income from paid invoices
        const { data: invoices } = await supabase
          .from('invoices')
          .select('amount')
          .eq('user_id', userId)
          .eq('status', 'Paid')
          .gte('issue_date', yearStart)
          .lte('issue_date', yearEnd);

        const totalIncome = (invoices || []).reduce((sum, inv) => sum + parseFloat(inv.amount.toString()), 0);
        setIncome(totalIncome);

        // Fetch real expenses by category
        const { data: expenseData } = await supabase
          .from('expenses')
          .select('category, amount')
          .eq('user_id', userId)
          .gte('date', yearStart)
          .lte('date', yearEnd);

        // Group expenses by category
        const categoryTotals: TaxExpenses = {
          materials: 0,
          equipment: 0,
          labor: 0,
          mileage: 0,
          utilities: 0,
          insurance: 0,
          marketing: 0,
          maintenance: 0,
          office: 0,
          other: 0,
        };

        (expenseData || []).forEach(expense => {
          const category = expense.category?.toLowerCase();
          const amount = parseFloat(expense.amount?.toString() || '0');
          
          switch (category) {
            case 'materials':
              categoryTotals.materials += amount;
              break;
            case 'equipment':
              categoryTotals.equipment += amount;
              break;
            case 'labor':
              categoryTotals.labor += amount;
              break;
            case 'mileage':
              categoryTotals.mileage += amount;
              break;
            case 'utilities':
              categoryTotals.utilities += amount;
              break;
            case 'insurance':
              categoryTotals.insurance += amount;
              break;
            case 'marketing':
              categoryTotals.marketing += amount;
              break;
            case 'maintenance':
              categoryTotals.maintenance += amount;
              break;
            case 'office':
              categoryTotals.office += amount;
              break;
            default:
              categoryTotals.other += amount;
              break;
          }
        });

        setExpenses(categoryTotals);

      } catch (error) {
        console.error("Error loading real financial data for tax calculator:", error);
      }
    };

    loadRealData();
  }, [yearFilter]);

  useEffect(() => {
    const totalExpenses = Object.values(expenses).reduce(
      (sum, expense) => sum + expense,
      0
    );
    const taxableIncome = Math.max(0, income - totalExpenses);
    const estimatedTax = (taxableIncome * taxRate) / 100;
    const effectiveTaxRate = income > 0 ? (estimatedTax / income) * 100 : 0;

    setTaxResults({
      totalIncome: income,
      totalDeductions: totalExpenses,
      taxableIncome,
      estimatedTax,
      effectiveTaxRate,
    });
  }, [income, expenses, taxRate, filingStatus, yearFilter]);

  const handleExpenseChange = (category: keyof TaxExpenses, value: string) => {
    setExpenses({
      ...expenses,
      [category]: parseFloat(value) || 0,
    });
  };

  return {
    income,
    setIncome,
    expenses,
    handleExpenseChange,
    taxRate,
    setTaxRate,
    filingStatus,
    setFilingStatus,
    taxResults,
    yearFilter,
    setYearFilter,
  };
};
