
import { Invoice } from "./types";
import { formatCurrency } from "./utils";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { addHeaderSection } from "../proposals/utils/pdf/headerSection";

interface InvoicePdfGeneratorProps {
  invoice: Invoice;
}

const InvoicePdfGenerator = ({ invoice }: InvoicePdfGeneratorProps) => {
  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      let yPosition = 20;
      
      // Use the shared header section with the new logo (now async)
      yPosition = await addHeaderSection(doc, "FACTURA", yPosition, pageWidth);
      
      doc.setFontSize(12);
      doc.text(`Factura #: ${invoice.invoice_number}`, 20, yPosition);
      doc.text(`Estado: ${invoice.status}`, pageWidth - 20, yPosition, { align: "right" });
      yPosition += 10;
      
      doc.text("Facturar a:", 20, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      doc.text(`${invoice.client_name || "Cliente"}`, 20, yPosition);
      yPosition += 6;
      if (invoice.clients?.address) {
        doc.text(`${invoice.clients.address}`, 20, yPosition);
        yPosition += 6;
      }
      if (invoice.clients?.email) {
        doc.text(`${invoice.clients.email}`, 20, yPosition);
        yPosition += 6;
      }
      
      doc.setFontSize(10);
      doc.text(`Fecha de Emisión: ${new Date(invoice.issue_date).toLocaleDateString('es-CO')}`, pageWidth - 20, yPosition - 12, { align: "right" });
      doc.text(`Fecha de Vencimiento: ${new Date(invoice.due_date).toLocaleDateString('es-CO')}`, pageWidth - 20, yPosition - 6, { align: "right" });
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
      doc.text(`Subtotal: ${formatCurrency(Number(invoice.amount))}`, pageWidth - 20, finalY, { align: "right" });
      
      let currentY = finalY + 6;
      if (invoice.tax_rate && Number(invoice.tax_rate) > 0) {
        const taxAmount = Number(invoice.amount) * 0.19; // IVA 19%
        doc.text(`IVA (19%): ${formatCurrency(taxAmount)}`, pageWidth - 20, currentY, { align: "right" });
        currentY += 6;
        doc.text(`Total: ${formatCurrency(Number(invoice.amount) + taxAmount)}`, pageWidth - 20, currentY, { align: "right" });
      } else {
        doc.text(`Total: ${formatCurrency(Number(invoice.amount))}`, pageWidth - 20, currentY, { align: "right" });
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
      
      doc.save(`Factura_${invoice.invoice_number}.pdf`);
      
      toast.success("PDF de la factura descargado correctamente");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("No se pudo generar el PDF de la factura");
      return null;
    }
  };

  return { generatePDF };
};

export default InvoicePdfGenerator;
