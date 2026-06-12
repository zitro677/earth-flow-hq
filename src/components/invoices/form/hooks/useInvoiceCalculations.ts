
import { InvoiceItemType } from "../formSchema";

export const useInvoiceCalculations = (
  items: InvoiceItemType[],
  category: "aliaddo" | "efectivo" = "aliaddo"
) => {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );

  const taxRate = category === "efectivo" ? 0 : 0.19;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return { subtotal, tax, total, taxRate, formatCurrency };
};
