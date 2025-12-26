
import React from "react";
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
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{isEditMode ? "Edit Expense" : "Add New Expense"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                onExpenseChange({ ...newExpense, date: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={newExpense.category}
              onValueChange={(value) =>
                onExpenseChange({ ...newExpense, category: value })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mileage">Mileage</SelectItem>
                <SelectItem value="Materials">Materials</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Fuel">Fuel</SelectItem>
                <SelectItem value="Labor">Labor</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {newExpense.category === "Mileage" ? (
            <div>
              <Label htmlFor="miles">Miles Driven</Label>
              <Input
                id="miles"
                type="number"
                min="0"
                value={newExpense.miles}
                onChange={(e) =>
                  onExpenseChange({ ...newExpense, miles: e.target.value })
                }
                placeholder="Enter miles driven"
              />
              <span className="text-xs text-muted-foreground mt-1">
                Rate: $0.67 per mile
              </span>
            </div>
          ) : (
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={newExpense.amount}
                onChange={(e) =>
                  onExpenseChange({ ...newExpense, amount: e.target.value })
                }
              />
            </div>
          )}
          <div>
            <Label htmlFor="vendor">Vendor/Location</Label>
            <Input
              id="vendor"
              value={newExpense.vendor}
              onChange={(e) =>
                onExpenseChange({ ...newExpense, vendor: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={newExpense.description}
            onChange={(e) =>
              onExpenseChange({ ...newExpense, description: e.target.value })
            }
          />
        </div>
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
          <Label htmlFor="deductible">Tax Deductible</Label>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={onSubmit}>
          {isEditMode ? "Update Expense" : "Save Expense"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
