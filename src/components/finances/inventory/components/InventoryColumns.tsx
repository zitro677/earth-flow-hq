
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const inventoryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Item Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "unit_cost",
    header: "Unit Cost",
    cell: ({ row }) => {
      const value = row.original.unit_cost;
      // Check if value is a number before using toFixed
      const formattedValue = typeof value === 'number' 
        ? `$${value.toFixed(2)}` 
        : `$${value}`;
      return formattedValue;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "life_span",
    header: "Life Span",
    cell: ({ row }) => `${row.original.life_span} years`,
  },
  {
    accessorKey: "depreciation_rate",
    header: "Depreciation Rate",
    cell: ({ row }) => `${row.original.depreciation_rate}%`,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => row.original.onEdit?.(row.original)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => row.original.onDelete?.(row.original.id)}
            className="h-8 w-8 p-0 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
