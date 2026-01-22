
import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NewExpense } from "../hooks/useExpenseTracker";
import { EXPENSE_CATEGORIES, getSubcategoriesByCategoryId } from "../data/expenseCategories";

interface ExpenseFormProps {
  newExpense: NewExpense;
  onExpenseChange: (expense: NewExpense) => void;
  onSubmit: () => void;
  isEditMode?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  newExpense,
  onExpenseChange,
  onSubmit,
  isEditMode = false,
}) => {
  const subcategories = useMemo(() => {
    if (!newExpense.category) return [];
    return getSubcategoriesByCategoryId(newExpense.category);
  }, [newExpense.category]);

  const handleCategoryChange = (categoryId: string) => {
    // Reset subcategory when category changes
    onExpenseChange({ 
      ...newExpense, 
      category: categoryId, 
      subcategory: "",
      // Reset miles if not kilometraje category
      miles: categoryId === "kilometraje" ? newExpense.miles : "",
    });
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    onExpenseChange({ ...newExpense, subcategory: subcategoryId });
  };

  const isKilometraje = newExpense.category === "kilometraje";

  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>{isEditMode ? "Editar Gasto" : "Agregar Nuevo Gasto"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {/* Row 1: Date */}
        <div>
          <Label htmlFor="date">Fecha</Label>
          <Input
            id="date"
            type="date"
            value={newExpense.date}
            onChange={(e) =>
              onExpenseChange({ ...newExpense, date: e.target.value })
            }
          />
        </div>

        {/* Row 2: Category */}
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={newExpense.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Row 3: Subcategory (only shown when category is selected) */}
        {newExpense.category && subcategories.length > 0 && (
          <div>
            <Label htmlFor="subcategory">Subcategoría</Label>
            <Select
              value={newExpense.subcategory}
              onValueChange={handleSubcategoryChange}
            >
              <SelectTrigger id="subcategory">
                <SelectValue placeholder="Seleccionar subcategoría" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Show description hint for selected subcategory */}
            {newExpense.subcategory && (
              <p className="text-xs text-muted-foreground mt-1">
                {subcategories.find(s => s.id === newExpense.subcategory)?.description}
              </p>
            )}
          </div>
        )}

        {/* Row 4: Amount or Miles + Vendor */}
        <div className="grid grid-cols-2 gap-4">
          {isKilometraje ? (
            <div>
              <Label htmlFor="miles">Millas Recorridas</Label>
              <Input
                id="miles"
                type="number"
                min="0"
                value={newExpense.miles}
                onChange={(e) =>
                  onExpenseChange({ ...newExpense, miles: e.target.value })
                }
                placeholder="Ingrese millas"
              />
              <span className="text-xs text-muted-foreground mt-1">
                Tarifa: $0.67 por milla
              </span>
            </div>
          ) : (
            <div>
              <Label htmlFor="amount">Monto ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={newExpense.amount}
                onChange={(e) =>
                  onExpenseChange({ ...newExpense, amount: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
          )}
          <div>
            <Label htmlFor="vendor">Proveedor/Ubicación</Label>
            <Input
              id="vendor"
              value={newExpense.vendor}
              onChange={(e) =>
                onExpenseChange({ ...newExpense, vendor: e.target.value })
              }
              placeholder="Nombre del proveedor"
            />
          </div>
        </div>

        {/* Row 5: Description */}
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Input
            id="description"
            value={newExpense.description}
            onChange={(e) =>
              onExpenseChange({ ...newExpense, description: e.target.value })
            }
            placeholder="Descripción del gasto"
          />
        </div>

        {/* Row 6: Deductible checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="deductible"
            checked={newExpense.deductible}
            onChange={(e) =>
              onExpenseChange({ ...newExpense, deductible: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="deductible">Deducible de Impuestos</Label>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button 
          onClick={onSubmit}
          disabled={!newExpense.category || !newExpense.subcategory || !newExpense.vendor}
        >
          {isEditMode ? "Actualizar Gasto" : "Guardar Gasto"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
