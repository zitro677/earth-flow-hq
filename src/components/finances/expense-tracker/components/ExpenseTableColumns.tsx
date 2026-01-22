import { ColumnDef } from "@tanstack/react-table";
import type { Expense } from "../hooks/useExpenseTracker";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Info } from "lucide-react";
import { getCategoryLabel, getSubcategoryLabel } from "../data/expenseCategories";
import { formatCOP, RETENTION_TYPE_LABELS, type RetentionType } from "../utils/colombianTaxConfig";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    accessorKey: "valorBruto",
    header: "Valor Bruto",
    cell: ({ row }) => {
      const value = row.original.valorBruto || 0;
      return formatCOP(value);
    },
  },
  {
    accessorKey: "iva",
    header: "IVA",
    cell: ({ row }) => {
      const value = row.original.iva || 0;
      return formatCOP(value);
    },
  },
  {
    id: "retenciones",
    header: "Retenciones",
    cell: ({ row }) => {
      const expense = row.original;
      const totalRetenciones = (expense.reteFuente || 0) + (expense.reteIva || 0) + (expense.reteIca || 0);
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help text-destructive">
                <span>-{formatCOP(totalRetenciones)}</span>
                <Info className="h-3 w-3" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="w-64">
              <div className="space-y-1 text-xs">
                <p className="font-medium">Detalle de Retenciones:</p>
                <div className="flex justify-between">
                  <span>Rete-Fuente ({RETENTION_TYPE_LABELS[expense.tipoRetencion as RetentionType] || 'Servicios'}):</span>
                  <span>{formatCOP(expense.reteFuente || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rete-IVA (50%):</span>
                  <span>{formatCOP(expense.reteIva || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rete-ICA (0.5%):</span>
                  <span>{formatCOP(expense.reteIca || 0)}</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "netoPagar",
    header: "Neto Pagado",
    cell: ({ row }) => {
      const value = row.original.netoPagar || 0;
      return <span className="font-medium">{formatCOP(value)}</span>;
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
