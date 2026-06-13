
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
      yPosition = await addHeaderSection(doc, "FACTURA", yPosition, pageWidth);
      
      doc.setFontSize(12);
      doc.text(`Factura #: ${invoice.invoice_number}`, 20, yPosition);
      
      const statusText = `Estado: ${invoice.status}`;
      doc.text(statusText, 190, yPosition, { align: "right" });
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.text("Información del Cliente:", 20, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      doc.text(`Para: ${invoice.client_name || "Cliente"}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Fecha: ${new Date(invoice.issue_date).toLocaleDateString('es-CO')}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Fecha de Vencimiento: ${new Date(invoice.due_date).toLocaleDateString('es-CO')}`, 20, yPosition);
      yPosition += 15;
      
      const headers = [["Descripción", "Cantidad", "Precio Unitario", "Importe"]];
      let data = [];
      
      if (invoice.items && invoice.items.length > 0) {
        data = invoice.items.map(item => [
          item.description,
          item.quantity.toString(),
          formatCurrency(Number(item.unit_price)),
          formatCurrency(Number(item.quantity) * Number(item.unit_price))
        ]);
      } else {
        data = [["Servicios", "1", formatCurrency(Number(invoice.amount)), formatCurrency(Number(invoice.amount))]];
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
        const taxAmount = Number(invoice.amount) * 0.19; // IVA 19%
        doc.text(`IVA (19%): ${formatCurrency(taxAmount)}`, 190, currentY, { align: "right" });
        currentY += 6;
        doc.text(`Total: ${formatCurrency(Number(invoice.amount) + taxAmount)}`, 190, currentY, { align: "right" });
      } else {
        doc.text(`Total: ${formatCurrency(Number(invoice.amount))}`, 190, currentY, { align: "right" });
      }
      
      if (invoice.notes) {
        doc.text("Notas:", 20, currentY + 15);
        doc.text(invoice.notes || 'Sin notas adicionales', 20, currentY + 22);
      }
      
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("AutoseguroDJ S.A.S", 20, pageHeight - 20);
      doc.text("Teléfono: +57 304 257 61 04 | Email: gerencia@autosegurodj.com", 20, pageHeight - 15);
      doc.text("Web: www.autosegurodj.com", 20, pageHeight - 10);
      doc.setTextColor(0, 0, 0);
      
      return doc;
    } catch (error) {
      console.error("Error creating PDF:", error);
      toast.error("No se pudo crear el PDF de la factura");
      return null;
    }
  };

  const sendEmail = async () => {
    try {
      const companyEmail = "gerencia@autosegurodj.com";
      const subject = `Factura ${invoice.invoice_number} de AutoseguroDJ S.A.S`;
      const body = `Estimado/a ${invoice.client_name},

Gracias por elegir AutoseguroDJ S.A.S. Adjunto encontrará la factura ${invoice.invoice_number} por ${formatCurrency(Number(invoice.amount))}.

Fecha de vencimiento: ${new Date(invoice.due_date).toLocaleDateString('es-CO')}

Si tiene alguna pregunta sobre esta factura, no dude en contactarnos.

Gracias por su preferencia.

Atentamente,
AutoseguroDJ S.A.S
Teléfono: +57 304 257 61 04
Email: gerencia@autosegurodj.com
Web: www.autosegurodj.com`;
      
      const doc = await createPdf();
      if (doc) {
        doc.save(`Factura_${invoice.invoice_number}.pdf`);
      }
      
      toast.success(
        "Se descargó el PDF de la factura. Abriendo cliente de correo...", 
        { duration: 5000 }
      );
      
      window.location.href = `mailto:${invoice.clients?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&from=${encodeURIComponent(companyEmail)}`;
    } catch (err) {
      console.error("Error in sendEmail:", err);
      toast.error("No se pudo preparar el correo");
    }
  };

  return { sendEmail };
};

export default InvoiceEmailService;
