import React from "react";
import { TaxCalculationResult } from "../hooks/useColombianTaxCalculations";
import { formatCOP, getRetentionRateLabel, RETENTION_TYPE_LABELS } from "../utils/colombianTaxConfig";
import { Calculator, TrendingDown, TrendingUp, Wallet } from "lucide-react";

interface TaxCalculationPanelProps {
  taxCalculation: TaxCalculationResult;
  showProviderInfo?: boolean;
}

export const TaxCalculationPanel: React.FC<TaxCalculationPanelProps> = ({
  taxCalculation,
  showProviderInfo = true,
}) => {
  const {
    valorBruto,
    tipoRetencion,
    iva,
    valorTotal,
    reteFuente,
    reteIva,
    reteIca,
    totalRetenciones,
    netoAPagar,
  } = taxCalculation;

  if (valorBruto <= 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Calculator className="h-4 w-4" />
        Cálculos Tributarios Automáticos
      </div>
      
      {/* IVA Section */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            + IVA (19%):
          </span>
          <span className="font-medium">{formatCOP(iva)}</span>
        </div>
        <div className="flex justify-between text-sm border-b pb-2">
          <span className="text-muted-foreground">= Valor Total:</span>
          <span className="font-semibold">{formatCOP(valorTotal)}</span>
        </div>
      </div>

      {/* Retentions Section */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            − Rete-Fuente ({getRetentionRateLabel(tipoRetencion)}):
          </span>
          <span className="text-destructive font-medium">-{formatCOP(reteFuente)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">− Rete-IVA (50% IVA):</span>
          <span className="text-destructive font-medium">-{formatCOP(reteIva)}</span>
        </div>
        <div className="flex justify-between text-sm border-b pb-2">
          <span className="text-muted-foreground">− Rete-ICA (0.5%):</span>
          <span className="text-destructive font-medium">-{formatCOP(reteIca)}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Retenciones:</span>
          <span className="text-destructive font-medium">-{formatCOP(totalRetenciones)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold bg-primary/10 rounded px-2 py-1.5 mt-2">
          <span className="flex items-center gap-1">
            <Wallet className="h-4 w-4" />
            NETO A PAGAR:
          </span>
          <span className="text-primary">{formatCOP(netoAPagar)}</span>
        </div>
      </div>

      {/* Retention type info */}
      {showProviderInfo && (
        <p className="text-xs text-muted-foreground border-t pt-2">
          Tipo de retención aplicada: <span className="font-medium">{RETENTION_TYPE_LABELS[tipoRetencion]}</span>
        </p>
      )}
    </div>
  );
};
