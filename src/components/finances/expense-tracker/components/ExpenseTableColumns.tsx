import { ColumnDef } from "@tanstack/react-table";
import type { Expense } from "../hooks/useExpenseTracker";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const expenseColumns: ColumnDef<Expense>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return `$${row.getValue<number>("amount").toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    accessorKey: "deductible",
    header: "Deductible",
    cell: ({ row }) => {
      return row.getValue<boolean>("deductible") ? "Yes" : "No";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expense = row.original;
      
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => expense.onEdit?.(expense)}
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
    },
  },
];
