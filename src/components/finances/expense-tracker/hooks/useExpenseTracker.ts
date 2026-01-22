
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Expense {
  id: string;
  date: string;
  category: string;
  subcategory: string;
  amount: number;
  vendor: string;
  description: string;
  deductible: boolean;
  miles?: number;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export interface NewExpense {
  date: string;
  category: string;
  subcategory: string;
  amount: string;
  vendor: string;
  description: string;
  deductible: boolean;
  miles?: string;
}

const MILEAGE_RATE = 0.67;

export const useExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentExpenseId, setCurrentExpenseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newExpense, setNewExpense] = useState<NewExpense>({
    date: format(new Date(), "yyyy-MM-dd"),
    category: "",
    subcategory: "",
    amount: "",
    vendor: "",
    description: "",
    deductible: true,
    miles: "",
  });

  // Load expenses from Supabase
  useEffect(() => {
    const loadExpenses = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          setIsLoading(false);
          return;
        }

        const { data: expensesData, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', session.user.id)
          .order('expense_date', { ascending: false });

        if (error) {
          console.error("Error fetching expenses:", error);
          toast.error("Failed to load expenses");
          return;
        }

        // Transform database expenses to match our interface
        const transformedExpenses = (expensesData || []).map((expense: any) => ({
          id: expense.id,
          date: expense.expense_date,
          category: expense.category,
          subcategory: expense.subcategory || '',
          amount: parseFloat(expense.amount),
          vendor: expense.vendor || 'Unknown Vendor',
          description: expense.description || '',
          deductible: true, // Default to true, could be added to database schema
          miles: expense.category === 'kilometraje' ? Math.round(parseFloat(expense.amount) / MILEAGE_RATE) : undefined,
        }));

        setExpenses(transformedExpenses);
      } catch (error) {
        console.error("Error loading expenses:", error);
        toast.error("Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const addExpense = async () => {
    if (!newExpense.vendor) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error("You must be logged in to add expenses");
        return;
      }

      let finalAmount = 0;
      if (newExpense.category === "Mileage" && newExpense.miles) {
        finalAmount = parseFloat(newExpense.miles) * MILEAGE_RATE;
      } else if (newExpense.amount) {
        finalAmount = parseFloat(newExpense.amount);
      }

      // If we're editing an existing expense
      if (currentExpenseId) {
        const { error } = await supabase
          .from('expenses')
          .update({
            expense_date: newExpense.date,
            category: newExpense.category,
            subcategory: newExpense.subcategory,
            amount: finalAmount,
            vendor: newExpense.vendor,
            description: newExpense.description || '',
          })
          .eq('id', currentExpenseId);

        if (error) {
          console.error("Error updating expense:", error);
          toast.error("Failed to update expense");
          return;
        }

        const updatedExpenses = expenses.map(expense => {
          if (expense.id === currentExpenseId) {
            return {
              ...expense,
              date: newExpense.date,
              category: newExpense.category,
              subcategory: newExpense.subcategory,
              amount: finalAmount,
              vendor: newExpense.vendor,
              description: newExpense.description,
              deductible: newExpense.deductible,
              miles: newExpense.category === "kilometraje" ? parseFloat(newExpense.miles || "0") : undefined,
            };
          }
          return expense;
        });
        
        setExpenses(updatedExpenses);
        setCurrentExpenseId(null);
        toast.success("Expense updated successfully");
      } else {
        // Adding a new expense
        const { data, error } = await supabase
          .from('expenses')
          .insert({
            user_id: session.user.id,
            expense_date: newExpense.date,
            category: newExpense.category,
            subcategory: newExpense.subcategory,
            amount: finalAmount,
            vendor: newExpense.vendor,
            description: newExpense.description || '',
          })
          .select()
          .single();

        if (error) {
          console.error("Error adding expense:", error);
          toast.error("Failed to add expense");
          return;
        }

        const expense: Expense = {
          id: data.id,
          date: newExpense.date,
          category: newExpense.category,
          subcategory: newExpense.subcategory,
          amount: finalAmount,
          vendor: newExpense.vendor,
          description: newExpense.description,
          deductible: newExpense.deductible,
          miles: newExpense.category === "kilometraje" ? parseFloat(newExpense.miles || "0") : undefined,
        };

        setExpenses([expense, ...expenses]);
        toast.success("Expense added successfully");
      }

      // Reset form
      setNewExpense({
        date: format(new Date(), "yyyy-MM-dd"),
        category: "",
        subcategory: "",
        amount: "",
        vendor: "",
        description: "",
        deductible: true,
        miles: "",
      });
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Failed to save expense");
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setCurrentExpenseId(expense.id);
    setNewExpense({
      date: expense.date,
      category: expense.category,
      subcategory: expense.subcategory,
      amount: expense.amount.toString(),
      vendor: expense.vendor,
      description: expense.description,
      deductible: expense.deductible,
      miles: expense.miles?.toString() || "",
    });
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting expense:", error);
        toast.error("Failed to delete expense");
        return;
      }

      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      setExpenses(updatedExpenses);
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  // Add handlers to each expense object
  const expensesWithHandlers = expenses.map(expense => ({
    ...expense,
    onEdit: handleEditExpense,
    onDelete: handleDeleteExpense,
  }));

  return {
    expenses: expensesWithHandlers,
    newExpense,
    setNewExpense,
    addExpense,
    isLoading,
    totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    deductibleExpenses: expenses
      .filter((expense) => expense.deductible)
      .reduce((sum, expense) => sum + expense.amount, 0),
    potentialTaxSavings: expenses
      .filter((expense) => expense.deductible)
      .reduce((sum, expense) => sum + expense.amount, 0) * 0.3,
    totalMiles: expenses.reduce((sum, expense) => sum + (expense.miles || 0), 0),
    totalMileageDeduction: expenses.reduce((sum, expense) => sum + (expense.miles || 0), 0) * MILEAGE_RATE,
  };
};
