
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Edit2 } from "lucide-react";

interface BudgetSectionProps {
  budgetUsed: number;
  totalBudget: number;
  onSaveBudget: (budgetUsed: number, totalBudget: number) => void;
}

const BudgetSection: React.FC<BudgetSectionProps> = ({
  budgetUsed,
  totalBudget,
  onSaveBudget
}) => {
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);
  const [budgetUsedValue, setBudgetUsedValue] = useState(budgetUsed);
  const [budgetValue, setBudgetValue] = useState(totalBudget);

  const saveBudget = () => {
    onSaveBudget(budgetUsedValue, budgetValue);
    setShowBudgetEdit(false);
  };

  return (
    <div className="flex items-start gap-2">
      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Presupuesto</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowBudgetEdit(!showBudgetEdit)}
            className="h-7 px-2"
          >
            {showBudgetEdit ? "Cancelar" : <Edit2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
        {showBudgetEdit ? (
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Presupuesto Usado</label>
                <Input
                  type="number"
                  value={budgetUsedValue}
                  onChange={(e) => setBudgetUsedValue(Number(e.target.value))}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Presupuesto Total</label>
                <Input
                  type="number"
                  value={budgetValue}
                  onChange={(e) => setBudgetValue(Number(e.target.value))}
                  className="h-8"
                />
              </div>
            </div>
            <Button size="sm" onClick={saveBudget} className="w-full">Guardar Presupuesto</Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {budgetUsed} de {totalBudget} usado
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetSection;
