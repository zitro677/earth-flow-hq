import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateColombianTaxes, calculateAggregateTaxStats } from "./useColombianTaxCalculations";

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
  // Colombian tax fields
  valorBruto: number;
  iva: number;
  reteFuente: number;
  reteIva: number;
  reteIca: number;
  netoPagar: number;
  proveedorResponsableIva: boolean;
  tipoRetencion: string;
  // Handlers
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
  proveedorResponsableIva: boolean;
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
    proveedorResponsableIva: true,
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
          deductible: true,
          miles: expense.category === 'kilometraje' ? Math.round(parseFloat(expense.amount) / MILEAGE_RATE) : undefined,
          // Colombian tax fields
          valorBruto: parseFloat(expense.valor_bruto) || 0,
          iva: parseFloat(expense.iva) || 0,
          reteFuente: parseFloat(expense.rete_fuente) || 0,
          reteIva: parseFloat(expense.rete_iva) || 0,
          reteIca: parseFloat(expense.rete_ica) || 0,
          netoPagar: parseFloat(expense.neto_pagar) || 0,
          proveedorResponsableIva: expense.proveedor_responsable_iva ?? true,
          tipoRetencion: expense.tipo_retencion || 'servicios',
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

      // Calculate gross value (valor bruto)
      let valorBruto = 0;
      if (newExpense.category === "kilometraje" && newExpense.miles) {
        valorBruto = parseFloat(newExpense.miles) * MILEAGE_RATE;
      } else if (newExpense.amount) {
        valorBruto = parseFloat(newExpense.amount);
      }

      // Calculate Colombian taxes
      const taxCalc = calculateColombianTaxes(
        valorBruto,
        newExpense.subcategory,
        newExpense.proveedorResponsableIva
      );

      // If we're editing an existing expense
      if (currentExpenseId) {
        const { error } = await supabase
          .from('expenses')
          .update({
            expense_date: newExpense.date,
            category: newExpense.category,
            subcategory: newExpense.subcategory,
            amount: taxCalc.netoAPagar, // Store net amount as main amount
            vendor: newExpense.vendor,
            description: newExpense.description || '',
            valor_bruto: taxCalc.valorBruto,
            iva: taxCalc.iva,
            rete_fuente: taxCalc.reteFuente,
            rete_iva: taxCalc.reteIva,
            rete_ica: taxCalc.reteIca,
            neto_pagar: taxCalc.netoAPagar,
            proveedor_responsable_iva: newExpense.proveedorResponsableIva,
            tipo_retencion: taxCalc.tipoRetencion,
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
              amount: taxCalc.netoAPagar,
              vendor: newExpense.vendor,
              description: newExpense.description,
              deductible: newExpense.deductible,
              miles: newExpense.category === "kilometraje" ? parseFloat(newExpense.miles || "0") : undefined,
              valorBruto: taxCalc.valorBruto,
              iva: taxCalc.iva,
              reteFuente: taxCalc.reteFuente,
              reteIva: taxCalc.reteIva,
              reteIca: taxCalc.reteIca,
              netoPagar: taxCalc.netoAPagar,
              proveedorResponsableIva: newExpense.proveedorResponsableIva,
              tipoRetencion: taxCalc.tipoRetencion,
            };
          }
          return expense;
        });
        
        setExpenses(updatedExpenses);
        setCurrentExpenseId(null);
        toast.success("Gasto actualizado correctamente");
      } else {
        // Adding a new expense
        const { data, error } = await supabase
          .from('expenses')
          .insert({
            user_id: session.user.id,
            expense_date: newExpense.date,
            category: newExpense.category,
            subcategory: newExpense.subcategory,
            amount: taxCalc.netoAPagar,
            vendor: newExpense.vendor,
            description: newExpense.description || '',
            valor_bruto: taxCalc.valorBruto,
            iva: taxCalc.iva,
            rete_fuente: taxCalc.reteFuente,
            rete_iva: taxCalc.reteIva,
            rete_ica: taxCalc.reteIca,
            neto_pagar: taxCalc.netoAPagar,
            proveedor_responsable_iva: newExpense.proveedorResponsableIva,
            tipo_retencion: taxCalc.tipoRetencion,
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
          amount: taxCalc.netoAPagar,
          vendor: newExpense.vendor,
          description: newExpense.description,
          deductible: newExpense.deductible,
          miles: newExpense.category === "kilometraje" ? parseFloat(newExpense.miles || "0") : undefined,
          valorBruto: taxCalc.valorBruto,
          iva: taxCalc.iva,
          reteFuente: taxCalc.reteFuente,
          reteIva: taxCalc.reteIva,
          reteIca: taxCalc.reteIca,
          netoPagar: taxCalc.netoAPagar,
          proveedorResponsableIva: newExpense.proveedorResponsableIva,
          tipoRetencion: taxCalc.tipoRetencion,
        };

        setExpenses([expense, ...expenses]);
        toast.success("Gasto agregado correctamente");
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
        proveedorResponsableIva: true,
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
      amount: expense.valorBruto.toString(),
      vendor: expense.vendor,
      description: expense.description,
      deductible: expense.deductible,
      miles: expense.miles?.toString() || "",
      proveedorResponsableIva: expense.proveedorResponsableIva,
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
      toast.success("Gasto eliminado correctamente");
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

  // Calculate aggregate tax statistics
  const taxStats = calculateAggregateTaxStats(expenses);

  return {
    expenses: expensesWithHandlers,
    newExpense,
    setNewExpense,
    addExpense,
    isLoading,
    isEditMode: !!currentExpenseId,
    // Legacy stats (kept for compatibility)
    totalExpenses: taxStats.totalValorBruto,
    deductibleExpenses: taxStats.totalValorBruto,
    potentialTaxSavings: taxStats.totalValorBruto * 0.3,
    totalMiles: expenses.reduce((sum, expense) => sum + (expense.miles || 0), 0),
    totalMileageDeduction: expenses.reduce((sum, expense) => sum + (expense.miles || 0), 0) * MILEAGE_RATE,
    // New Colombian tax stats
    taxStats,
  };
};
