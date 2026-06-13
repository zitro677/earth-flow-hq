import { Invoice } from "./types";
import { formatCurrency } from "./utils";
import { toast } from "sonner";
import { escapeHtml, escapeHtmlWithLineBreaks } from "@/lib/sanitize";
interface InvoicePrintServiceProps {
  invoice: Invoice;
}

const InvoicePrintService = ({ invoice }: InvoicePrintServiceProps) => {
  const printInvoice = () => {
    // Create a printable version of the invoice
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Ventana emergente bloqueada. Permite las ventanas emergentes en este sitio.");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Factura ${invoice.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            .company-header { margin-bottom: 20px; text-align: center; }
            .company-name { font-size: 22px; font-weight: bold; margin-bottom: 5px; }
            .company-info { font-size: 14px; color: #555; margin-bottom: 3px; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; text-align: center; margin-top: 20px; }
            .invoice-number { font-size: 16px; color: #666; }
            .invoice-meta { margin-bottom: 30px; }
            .invoice-meta div { margin-bottom: 5px; }
            .amount { font-size: 18px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; border-bottom: 1px solid #ddd; padding: 10px 5px; }
            td { padding: 10px 5px; border-bottom: 1px solid #eee; }
            .text-right { text-align: right; }
            .total-row { font-weight: bold; }
            .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 14px; }
            .status-paid { background: #d1fae5; color: #047857; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-overdue { background: #fee2e2; color: #b91c1c; }
            @media print { body { margin: 0.5cm; } .no-print { display: none; } }
            .page-break { page-break-before: always; }
            .entity-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .entity-info > div { width: 48%; }
            .invoice-footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="company-header">
            <div class="company-name">AutoseguroDJ S.A.S</div>
            <div class="company-info">Teléfono: +57 304 257 61 04</div>
            <div class="company-info">Email: gerencia@autosegurodj.com</div>
            <div class="company-info">Web: www.autosegurodj.com</div>
          </div>
          
          <div class="invoice-title">FACTURA</div>
          
          <div class="invoice-header">
            <div>
              <div class="invoice-number">#${escapeHtml(invoice.invoice_number)}</div>
            </div>
            <div>
              <div class="status status-${escapeHtml(invoice.status?.toLowerCase())}">${escapeHtml(invoice.status)}</div>
            </div>
          </div>
          
          <div class="entity-info">
            <div>
              <strong>De:</strong>
              <div>AutoseguroDJ S.A.S</div>
              <div>Teléfono: +57 304 257 61 04</div>
              <div>Email: gerencia@autosegurodj.com</div>
            </div>
            <div>
              <strong>Para:</strong>
              <div>${escapeHtml(invoice.client_name)}</div>
              ${invoice.clients?.address ? `<div>${escapeHtml(invoice.clients.address)}</div>` : ''}
              ${invoice.clients?.email ? `<div>${escapeHtml(invoice.clients.email)}</div>` : ''}
            </div>
          </div>
          
          <div class="invoice-meta">
            <div><strong>Fecha de Emisión:</strong> ${new Date(invoice.issue_date).toLocaleDateString('es-CO')}</div>
            <div><strong>Fecha de Vencimiento:</strong> ${new Date(invoice.due_date).toLocaleDateString('es-CO')}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th style="text-align: right;">Importe</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items && invoice.items.length > 0 ? 
                invoice.items.map(item => `
                  <tr>
                    <td>${escapeHtml(item.description)}</td>
                    <td>${escapeHtml(String(item.quantity))}</td>
                    <td>${formatCurrency(Number(item.unit_price))}</td>
                    <td class="text-right">${formatCurrency(Number(item.quantity) * Number(item.unit_price))}</td>
                  </tr>
                `).join('') 
                : 
                `<tr>
                  <td>Servicios</td>
                  <td>1</td>
                  <td>${formatCurrency(Number(invoice.amount))}</td>
                  <td class="text-right">${formatCurrency(Number(invoice.amount))}</td>
                </tr>`
              }
              ${invoice.tax_rate && Number(invoice.tax_rate) > 0 ? `
              <tr>
                <td colspan="3" class="text-right">Subtotal</td>
                <td class="text-right">${formatCurrency(Number(invoice.amount))}</td>
              </tr>
              <tr>
                <td colspan="3" class="text-right">IVA (${escapeHtml(String(invoice.tax_rate))}%)</td>
                <td class="text-right">${formatCurrency(Number(invoice.amount) * (Number(invoice.tax_rate) / 100))}</td>
              </tr>` : ''}
              <tr class="total-row">
                <td colspan="3" class="text-right"><strong>Total</strong></td>
                <td class="text-right"><strong>${formatCurrency(
                  Number(invoice.amount) + (
                    invoice.tax_rate 
                      ? Number(invoice.amount) * (Number(invoice.tax_rate) / 100)
                      : 0
                  )
                )}</strong></td>
              </tr>
            </tbody>
          </table>
          
          ${invoice.notes ? `
          <div style="margin-top: 40px;">
            <div><strong>Notas:</strong></div>
            <div>${escapeHtmlWithLineBreaks(invoice.notes)}</div>
          </div>` : ''}
          
          <div class="invoice-footer">
            AutoseguroDJ S.A.S<br>
            Teléfono: +57 304 257 61 04 | Email: gerencia@autosegurodj.com<br>
            Web: www.autosegurodj.com<br>
            ¡Gracias por su preferencia!
          </div>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    toast.success("Factura enviada a la impresora");
  };

  return { printInvoice };
};

export default InvoicePrintService;
