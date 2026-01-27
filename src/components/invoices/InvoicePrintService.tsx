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
      toast.error("Pop-up blocked. Please allow pop-ups for this site.");
      return;
    }
    
    // Create invoice HTML content with print-optimized styling and company information
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice ${invoice.invoice_number}</title>
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
            
            /* Print-specific styles */
            @media print {
              body { margin: 0.5cm; }
              .no-print { display: none; }
            }
            
            /* Page break styles */
            .page-break { page-break-before: always; }
            
            /* Company details and client info in two columns */
            .entity-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .entity-info > div { width: 48%; }
            
            /* Footer */
            .invoice-footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="company-header">
            <div class="company-name">Green Landscape Irrigation</div>
            <div class="company-info">Phone: (727) 484-5516</div>
            <div class="company-info">Email: greenplanetlandscaping01@gmail.com</div>
            <div class="company-info">Web: www.greenlandscapeirrigation.com</div>
          </div>
          
          <div class="invoice-title">INVOICE</div>
          
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
              <strong>From:</strong>
              <div>Green Landscape Irrigation</div>
              <div>Phone: (727) 484-5516</div>
              <div>Email: greenplanetlandscaping01@gmail.com</div>
            </div>
            <div>
              <strong>To:</strong>
              <div>${escapeHtml(invoice.client_name)}</div>
              ${invoice.clients?.address ? `<div>${escapeHtml(invoice.clients.address)}</div>` : ''}
              ${invoice.clients?.email ? `<div>${escapeHtml(invoice.clients.email)}</div>` : ''}
            </div>
          </div>
          
          <div class="invoice-meta">
            <div><strong>Issue Date:</strong> ${new Date(invoice.issue_date).toLocaleDateString()}</div>
            <div><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th style="text-align: right;">Amount</th>
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
                  <td>Services</td>
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
                <td colspan="3" class="text-right">Tax (${escapeHtml(String(invoice.tax_rate))}%)</td>
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
            <div><strong>Notes:</strong></div>
            <div>${escapeHtmlWithLineBreaks(invoice.notes)}</div>
          </div>` : ''}
          
          <div class="invoice-footer">
            Green Landscape Irrigation<br>
            Phone: (727) 484-5516 | Email: greenplanetlandscaping01@gmail.com<br>
            Web: www.greenlandscapeirrigation.com<br>
            Thank you for your business!
          </div>
          
          <script>
            // Auto-trigger print dialog when loaded
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    toast.success("Invoice sent to printer");
  };

  return { printInvoice };
};

export default InvoicePrintService;
