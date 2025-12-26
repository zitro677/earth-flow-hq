
// This file re-exports all invoice-related hooks from the hooks directory
// to maintain backward compatibility while having a more maintainable structure

export { useInvoicesList as useInvoices } from './hooks/useInvoicesList';
export { useInvoice } from './hooks/useSingleInvoice';
export {
  useCreateInvoice,
  useUpdateInvoice,
  useUpdateInvoiceStatus,
  useDeleteInvoice
} from './hooks/useInvoiceMutations';
