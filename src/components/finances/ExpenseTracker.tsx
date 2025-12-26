
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DataTable } from "../ui/data-table";
import { DialogTrigger, Dialog } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileDown, Pencil, Trash2 } from "lucide-react";
import { ExpenseStats } from "./expense-tracker/components/ExpenseStats";
import { ExpenseForm } from "./expense-tracker/components/ExpenseForm";
import { expenseColumns } from "./expense-tracker/components/ExpenseTableColumns";
import { useExpenseTracker } from "./expense-tracker/hooks/useExpenseTracker";
import { exportToCSV } from "./expense-tracker/utils/exportUtils";
import { toast } from "sonner";

const ExpenseTracker: React.FC = () => {
  const {
    expenses,
    newExpense,
    setNewExpense,
    addExpense,
    totalExpenses,
    deductibleExpenses,
    potentialTaxSavings,
    totalMiles,
    totalMileageDeduction,
  } = useExpenseTracker();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleExport = () => {
    try {
      exportToCSV(expenses);
      toast.success("Expenses exported successfully");
    } catch (error) {
      toast.error("Failed to export expenses");
    }
  };

  const handleOpenEditDialog = () => {
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  // Update expense columns with the dialog opener function
  const columnsWithActions = React.useMemo(() => {
    return expenseColumns.map(column => {
      if (column.id === "actions") {
        return {
          ...column,
          cell: ({ row }: any) => {
            const expense = row.original;
            
            return (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    expense.onEdit?.(expense);
                    handleOpenEditDialog();
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => expense.onDelete?.(expense.id)}
                  className="h-8 w-8 p-0 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          }
        };
      }
      return column;
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <ExpenseStats
        totalExpenses={totalExpenses}
        deductibleExpenses={deductibleExpenses}
        potentialTaxSavings={potentialTaxSavings}
        totalMiles={totalMiles}
        totalMileageDeduction={totalMileageDeduction}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Expense Records</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleExport}
          >
            <FileDown className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>

          <Button 
            className="flex items-center gap-1"
            onClick={handleOpenAddDialog}
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </Button>
        </div>
      </div>

      <Card className="card-shadow">
        <CardContent className="p-6">
          <DataTable
            columns={columnsWithActions}
            data={expenses}
            searchColumns={["vendor", "category", "description"]}
            searchPlaceholder="Search expenses by vendor, category or description..."
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <ExpenseForm
          newExpense={newExpense}
          onExpenseChange={setNewExpense}
          onSubmit={() => {
            addExpense();
            setIsDialogOpen(false);
          }}
          isEditMode={isEditMode}
        />
      </Dialog>
    </motion.div>
  );
};

export default ExpenseTracker;
