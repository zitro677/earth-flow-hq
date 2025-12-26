
import { useUpdateInvoiceStatus, useDeleteInvoice } from "./useInvoices";
import { Invoice } from "./types";
import { toast } from "sonner";

interface InvoiceStatusManagerProps {
  invoice: Invoice;
}

const InvoiceStatusManager = ({ invoice }: InvoiceStatusManagerProps) => {
  const updateInvoiceStatus = useUpdateInvoiceStatus();
  const deleteInvoice = useDeleteInvoice();

  const markAsPaid = async () => {
    try {
      await updateInvoiceStatus.mutateAsync({ id: invoice.id, status: "Paid" });
      toast.success(`Invoice ${invoice.invoice_number} marked as paid`);
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("Failed to update invoice status");
    }
  };

  const deleteInvoiceHandler = async () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice.mutateAsync(invoice.id);
        toast.success(`Invoice ${invoice.invoice_number} deleted`);
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast.error("Failed to delete invoice");
      }
    }
  };

  return { markAsPaid, deleteInvoiceHandler };
};

export default InvoiceStatusManager;
