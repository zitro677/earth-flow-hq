import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCOP } from "../utils/colombianTaxConfig";
import type { AggregateTaxStats } from "../hooks/useColombianTaxCalculations";
import { 
  Receipt, 
  BadgePercent, 
  Building2, 
  Landmark, 
  Wallet,
  TrendingDown 
} from "lucide-react";

interface ExpenseStatsProps {
  totalExpenses: number;
  deductibleExpenses: number;
  potentialTaxSavings: number;
  totalMiles?: number;
  totalMileageDeduction?: number;
  taxStats?: AggregateTaxStats;
}

export const ExpenseStats: React.FC<ExpenseStatsProps> = ({
  taxStats,
}) => {
  if (!taxStats) {
    return null;
  }

  const stats = [
    {
      label: "Total Valor Bruto",
      value: formatCOP(taxStats.totalValorBruto),
      icon: Receipt,
      description: "Base gravable total",
    },
    {
      label: "IVA Descontable",
      value: formatCOP(taxStats.totalIvaDescontable),
      icon: BadgePercent,
      description: "IVA recuperable en declaración",
    },
    {
      label: "Crédito Renta",
      value: formatCOP(taxStats.totalCreditoRenta),
      icon: Landmark,
      description: "Anticipo impuesto de renta",
    },
    {
      label: "Crédito ICA",
      value: formatCOP(taxStats.totalCreditoIca),
      icon: Building2,
      description: "Retención ICA Bogotá",
    },
    {
      label: "Total Retenido",
      value: formatCOP(taxStats.totalRetenciones),
      icon: TrendingDown,
      description: "Rete-Fuente + IVA + ICA",
    },
    {
      label: "Neto Pagado",
      value: formatCOP(taxStats.totalNetoPagado),
      icon: Wallet,
      description: "Efectivo desembolsado",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-xs font-medium text-muted-foreground">{stat.label}</h3>
            </div>
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
