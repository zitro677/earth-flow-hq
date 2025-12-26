
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface IncomeExpenseChartProps {
  data: Array<{
    name: string;
    income: number;
    expenses: number;
  }>;
  yearFilter: string;
}

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data, yearFilter }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Income vs. Expenses ({yearFilter})</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "8px",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
              />
              <Legend />
              <Bar
                dataKey="income"
                fill="#0ea5e9"
                name="Income"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                fill="#f97316"
                name="Expenses"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IncomeExpenseChart;
