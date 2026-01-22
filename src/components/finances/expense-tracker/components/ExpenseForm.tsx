import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { calculateColombianTaxes } from "../hooks/useColombianTaxCalculations";
import { TaxCalculationPanel } from "./TaxCalculationPanel";

interface ExpenseFormProps {
  newExpense: NewExpense;
  onExpenseChange: (expense: NewExpense) => void;
  onSubmit: () => void;
  isEditMode?: boolean;
}

const MILEAGE_RATE = 0.67;

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

  // Calculate taxes in real-time
  const taxCalculation = useMemo(() => {
    let valorBruto = 0;
    if (newExpense.category === "kilometraje" && newExpense.miles) {
      valorBruto = parseFloat(newExpense.miles) * MILEAGE_RATE;
    } else if (newExpense.amount) {
      valorBruto = parseFloat(newExpense.amount);
    }
    
    return calculateColombianTaxes(
      valorBruto,
      newExpense.subcategory,
      newExpense.proveedorResponsableIva
    );
  }, [newExpense.amount, newExpense.miles, newExpense.category, newExpense.subcategory, newExpense.proveedorResponsableIva]);

  const handleCategoryChange = (categoryId: string) => {
    onExpenseChange({ 
      ...newExpense, 
      category: categoryId, 
      subcategory: "",
      miles: categoryId === "kilometraje" ? newExpense.miles : "",
    });
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    onExpenseChange({ ...newExpense, subcategory: subcategoryId });
  };

  const isKilometraje = newExpense.category === "kilometraje";

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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

        {/* Row 3: Subcategory */}
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
            {newExpense.subcategory && (
              <p className="text-xs text-muted-foreground mt-1">
                {subcategories.find(s => s.id === newExpense.subcategory)?.description}
              </p>
            )}
          </div>
        )}

        {/* Row 4: Amount/Miles + Vendor */}
        <div className="grid grid-cols-2 gap-4">
          {isKilometraje ? (
            <div>
              <Label htmlFor="miles">Kilómetros Recorridos</Label>
              <Input
                id="miles"
                type="number"
                min="0"
                value={newExpense.miles}
                onChange={(e) =>
                  onExpenseChange({ ...newExpense, miles: e.target.value })
                }
                placeholder="Ingrese kilómetros"
              />
              <span className="text-xs text-muted-foreground mt-1">
                Tarifa: $0.67 por km
              </span>
            </div>
          ) : (
            <div>
              <Label htmlFor="amount">Valor Bruto (sin IVA)</Label>
              <Input
                id="amount"
                type="number"
                step="1"
                min="0"
                value={newExpense.amount}
                onChange={(e) =>
                  onExpenseChange({ ...newExpense, amount: e.target.value })
                }
                placeholder="0"
              />
            </div>
          )}
          <div>
            <Label htmlFor="vendor">Proveedor</Label>
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

        {/* Row 6: Provider IVA responsibility */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="proveedorIva"
            checked={newExpense.proveedorResponsableIva}
            onCheckedChange={(checked) =>
              onExpenseChange({ ...newExpense, proveedorResponsableIva: checked === true })
            }
          />
          <Label htmlFor="proveedorIva" className="text-sm font-normal">
            Proveedor responsable de IVA (aplica Rete-IVA 50%)
          </Label>
        </div>

        {/* Row 7: Deductible checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="deductible"
            checked={newExpense.deductible}
            onCheckedChange={(checked) =>
              onExpenseChange({ ...newExpense, deductible: checked === true })
            }
          />
          <Label htmlFor="deductible" className="text-sm font-normal">
            Deducible de Impuestos
          </Label>
        </div>

        {/* Tax Calculation Panel */}
        {newExpense.subcategory && taxCalculation.valorBruto > 0 && (
          <TaxCalculationPanel taxCalculation={taxCalculation} />
        )}
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
