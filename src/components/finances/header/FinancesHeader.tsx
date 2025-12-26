
import React from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FinancesHeaderProps {
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  yearFilter: string;
  setYearFilter: (value: string) => void;
}

const FinancesHeader: React.FC<FinancesHeaderProps> = ({
  timeFilter,
  setTimeFilter,
  yearFilter,
  setYearFilter,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Finances</h1>
        <p className="text-muted-foreground mt-1">
          Track income, expenses, and financial performance
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-4 md:mt-0 flex gap-2"
      >
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="quarter">Quarter</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    </div>
  );
};

export default FinancesHeader;
