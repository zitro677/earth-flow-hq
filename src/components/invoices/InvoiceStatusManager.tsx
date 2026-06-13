
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
      toast.success(`Factura ${invoice.invoice_number} marcada como pagada`);
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("Error al actualizar el estado de la factura");
    }
  };

  const deleteInvoiceHandler = async () => {
    if (window.confirm("¿Estás seguro de eliminar esta factura?")) {
      try {
        await deleteInvoice.mutateAsync(invoice.id);
        toast.success(`Factura ${invoice.invoice_number} eliminada`);
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast.error("Error al eliminar la factura");
      }
    }
  };

  return { markAsPaid, deleteInvoiceHandler };
};

export default InvoiceStatusManager;
