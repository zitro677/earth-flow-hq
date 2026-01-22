import {
  IVA_RATE,
  RETE_IVA_RATE,
  ICA_BOGOTA_RATE,
  getRetentionType,
  getRetentionRate,
  type RetentionType,
} from "../utils/colombianTaxConfig";

export interface TaxCalculationResult {
  // Input
  valorBruto: number;
  tipoRetencion: RetentionType;
  
  // IVA calculations
  iva: number;
  valorTotal: number;
  
  // Retention calculations
  reteFuente: number;
  reteIva: number;
  reteIca: number;
  totalRetenciones: number;
  
  // Net to pay
  netoAPagar: number;
  
  // Tax benefits
  costoDeducible: number;
  ivaDescontable: number;
  creditoRenta: number;
  creditoIca: number;
}

/**
 * Calculate Colombian taxes for an expense
 * @param valorBruto - Gross value before IVA
 * @param subcategoryId - Expense subcategory ID
 * @param proveedorResponsableIva - Whether supplier is responsible for IVA (default: true)
 * @returns Tax calculation result with all values
 */
export function calculateColombianTaxes(
  valorBruto: number,
  subcategoryId: string,
  proveedorResponsableIva: boolean = true
): TaxCalculationResult {
  // Ensure valid input
  const grossValue = Math.max(0, valorBruto || 0);
  
  // 1. Detect retention type
  const tipoRetencion = getRetentionType(subcategoryId);
  const retentionRate = getRetentionRate(tipoRetencion);
  
  // 2. Calculate IVA
  const iva = grossValue * IVA_RATE;
  const valorTotal = grossValue + iva;
  
  // 3. Calculate retentions
  const reteFuente = grossValue * retentionRate;
  const reteIva = proveedorResponsableIva ? iva * RETE_IVA_RATE : 0;
  const reteIca = grossValue * ICA_BOGOTA_RATE;
  const totalRetenciones = reteFuente + reteIva + reteIca;
  
  // 4. Calculate net to pay
  const netoAPagar = valorTotal - totalRetenciones;
  
  // 5. Calculate tax benefits
  const costoDeducible = grossValue; // 100% deductible
  const ivaDescontable = iva - reteIva; // IVA minus retained IVA
  const creditoRenta = reteFuente; // Advance tax credit
  const creditoIca = reteIca; // ICA credit
  
  return {
    valorBruto: grossValue,
    tipoRetencion,
    iva,
    valorTotal,
    reteFuente,
    reteIva,
    reteIca,
    totalRetenciones,
    netoAPagar,
    costoDeducible,
    ivaDescontable,
    creditoRenta,
    creditoIca,
  };
}

/**
 * Calculate aggregate tax statistics from a list of expenses
 */
export interface AggregateTaxStats {
  totalValorBruto: number;
  totalIva: number;
  totalReteFuente: number;
  totalReteIva: number;
  totalReteIca: number;
  totalRetenciones: number;
  totalNetoPagado: number;
  totalIvaDescontable: number;
  totalCreditoRenta: number;
  totalCreditoIca: number;
}

export function calculateAggregateTaxStats(expenses: Array<{
  valorBruto?: number;
  iva?: number;
  reteFuente?: number;
  reteIva?: number;
  reteIca?: number;
  netoPagar?: number;
}>): AggregateTaxStats {
  const stats = expenses.reduce(
    (acc, expense) => {
      const valorBruto = expense.valorBruto || 0;
      const iva = expense.iva || 0;
      const reteFuente = expense.reteFuente || 0;
      const reteIva = expense.reteIva || 0;
      const reteIca = expense.reteIca || 0;
      const netoPagar = expense.netoPagar || 0;
      
      return {
        totalValorBruto: acc.totalValorBruto + valorBruto,
        totalIva: acc.totalIva + iva,
        totalReteFuente: acc.totalReteFuente + reteFuente,
        totalReteIva: acc.totalReteIva + reteIva,
        totalReteIca: acc.totalReteIca + reteIca,
        totalRetenciones: acc.totalRetenciones + reteFuente + reteIva + reteIca,
        totalNetoPagado: acc.totalNetoPagado + netoPagar,
        totalIvaDescontable: acc.totalIvaDescontable + (iva - reteIva),
        totalCreditoRenta: acc.totalCreditoRenta + reteFuente,
        totalCreditoIca: acc.totalCreditoIca + reteIca,
      };
    },
    {
      totalValorBruto: 0,
      totalIva: 0,
      totalReteFuente: 0,
      totalReteIva: 0,
      totalReteIca: 0,
      totalRetenciones: 0,
      totalNetoPagado: 0,
      totalIvaDescontable: 0,
      totalCreditoRenta: 0,
      totalCreditoIca: 0,
    }
  );
  
  return stats;
}
