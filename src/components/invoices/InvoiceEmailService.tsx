
import { Invoice } from "./types";
import { formatCurrency } from "./utils";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { addHeaderSection } from "../proposals/utils/pdf/headerSection";

interface InvoiceEmailServiceProps {
  invoice: Invoice;
}

const InvoiceEmailService = ({ invoice }: InvoiceEmailServiceProps) => {
  const createPdf = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      let yPosition = 20;
      yPosition = await addHeaderSection(doc, "INVOICE", yPosition, pageWidth);
      
      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoice.invoice_number}`, 20, yPosition);
      
      const statusText = `Status: ${invoice.status}`;
      doc.text(statusText, 190, yPosition, { align: "right" });
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.text("Client Information:", 20, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      doc.text(`To: ${invoice.client_name || "Client"}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Date: ${new Date(invoice.issue_date).toLocaleDateString()}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 20, yPosition);
      yPosition += 15;
      
      const headers = [["Description", "Quantity", "Unit Price", "Amount"]];
      let data = [];
      
      if (invoice.items && invoice.items.length > 0) {
        data = invoice.items.map(item => [
          item.description,
          item.quantity.toString(),
          formatCurrency(Number(item.unit_price)),
          formatCurrency(Number(item.quantity) * Number(item.unit_price))
        ]);
      } else {
        data = [["Services", "1", formatCurrency(Number(invoice.amount)), formatCurrency(Number(invoice.amount))]];
      }
      
      autoTable(doc, {
        startY: yPosition,
        head: headers,
        body: data,
        theme: 'grid',
        styles: { fontSize: 10 },
      });
      
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Subtotal: ${formatCurrency(Number(invoice.amount))}`, 190, finalY, { align: "right" });
      
      let currentY = finalY + 6;
      if (invoice.tax_rate && Number(invoice.tax_rate) > 0) {
        const taxAmount = Number(invoice.amount) * 0.07;
        doc.text(`Tax (7%): ${formatCurrency(taxAmount)}`, 190, currentY, { align: "right" });
        currentY += 6;
        doc.text(`Total: ${formatCurrency(Number(invoice.amount) + taxAmount)}`, 190, currentY, { align: "right" });
      } else {
        doc.text(`Total: ${formatCurrency(Number(invoice.amount))}`, 190, currentY, { align: "right" });
      }
      
      if (invoice.notes) {
        doc.text("Notes:", 20, currentY + 15);
        doc.text(invoice.notes || 'No additional notes', 20, currentY + 22);
      }
      
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("AutoseguroDJ S.A.S", 20, pageHeight - 20);
      doc.text("Teléfono: (Pendiente) | Email: info@autosegurodj.com", 20, pageHeight - 15);
      doc.text("Web: www.autosegurodj.com", 20, pageHeight - 10);
      doc.setTextColor(0, 0, 0);
      
      return doc;
    } catch (error) {
      console.error("Error creating PDF:", error);
      toast.error("Failed to create invoice PDF");
      return null;
    }
  };

  const sendEmail = async () => {
    try {
      const companyEmail = "info@autosegurodj.com";
      const subject = `Factura ${invoice.invoice_number} de AutoseguroDJ S.A.S`;
      const body = `Estimado/a ${invoice.client_name},

Gracias por elegir AutoseguroDJ S.A.S. Adjunto encontrará la factura ${invoice.invoice_number} por ${formatCurrency(Number(invoice.amount))}.

Fecha de vencimiento: ${new Date(invoice.due_date).toLocaleDateString()}

Si tiene alguna pregunta sobre esta factura, no dude en contactarnos.

Gracias por su preferencia.

Atentamente,
AutoseguroDJ S.A.S
Teléfono: (Pendiente)
Email: info@autosegurodj.com
Web: www.autosegurodj.com`;
      
      const doc = await createPdf();
      if (doc) {
        doc.save(`Invoice_${invoice.invoice_number}.pdf`);
      }
      
      toast.success(
        "PDF invoice has been downloaded. Opening email client...", 
        { duration: 5000 }
      );
      
      window.location.href = `mailto:${invoice.clients?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&from=${encodeURIComponent(companyEmail)}`;
    } catch (err) {
      console.error("Error in sendEmail:", err);
      toast.error("Failed to prepare email");
    }
  };

  return { sendEmail };
};

export default InvoiceEmailService;
