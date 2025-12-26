
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaxIncomeSectionProps {
  income: number;
  setIncome: (value: number) => void;
  filingStatus: string;
  setFilingStatus: (value: string) => void;
  yearFilter: string;
  setYearFilter: (value: string) => void;
}

export const TaxIncomeSection: React.FC<TaxIncomeSectionProps> = ({
  income,
  setIncome,
  filingStatus,
  setFilingStatus,
  yearFilter,
  setYearFilter,
}) => {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle>Income & Filing Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="income">Annual Business Income ($)</Label>
          <Input
            id="income"
            type="number"
            min="0"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="filing-status">Filing Status</Label>
            <Select value={filingStatus} onValueChange={setFilingStatus}>
              <SelectTrigger id="filing-status" className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married-joint">Married Filing Jointly</SelectItem>
                <SelectItem value="married-separate">Married Filing Separately</SelectItem>
                <SelectItem value="head">Head of Household</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tax-year">Tax Year</Label>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
