import { ColumnDef } from "@tanstack/react-table";
import type { Expense } from "../hooks/useExpenseTracker";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { getCategoryLabel, getSubcategoryLabel } from "../data/expenseCategories";

export const expenseColumns: ColumnDef<Expense>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
  },
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => {
      const categoryId = row.getValue<string>("category");
      return getCategoryLabel(categoryId);
    },
  },
  {
    accessorKey: "subcategory",
    header: "Subcategoría",
    cell: ({ row }) => {
      const categoryId = row.original.category;
      const subcategoryId = row.getValue<string>("subcategory");
      return getSubcategoryLabel(categoryId, subcategoryId);
    },
  },
  {
    accessorKey: "vendor",
    header: "Proveedor",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => {
      return `$${row.getValue<number>("amount").toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    accessorKey: "deductible",
    header: "Deducible",
    cell: ({ row }) => {
      return row.getValue<boolean>("deductible") ? "Sí" : "No";
    },
  },
  {
    id: "actions",
    header: "Acciones",
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
