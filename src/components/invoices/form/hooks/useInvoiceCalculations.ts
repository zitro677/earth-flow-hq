
import { InvoiceItemType } from "../formSchema";

export const useInvoiceCalculations = (items: InvoiceItemType[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );
  
  const taxRate = 0.19; // IVA 19%
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return { subtotal, tax, total, taxRate };
};
