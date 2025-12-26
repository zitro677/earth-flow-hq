import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import { Invoice } from "./types";
import { formatCurrency } from "./utils";

interface InvoiceViewDialogProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownloadPDF: () => void;
  onSendEmail: () => void;
}

const InvoiceViewDialog: React.FC<InvoiceViewDialogProps> = ({
  invoice,
  open,
  onOpenChange,
  onDownloadPDF,
  onSendEmail,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Invoice {invoice.invoice_number}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
              <p className="text-base">{invoice.client_name}</p>
              {invoice.clients?.address && (
                <p className="text-sm text-muted-foreground mt-1">
                  {invoice.clients.address}
                </p>
              )}
              {invoice.clients?.email && (
                <p className="text-sm text-muted-foreground">
                  {invoice.clients.email}
                </p>
              )}
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-muted-foreground">Invoice Details</h3>
              <p className="text-base">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {invoice.status}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Issue Date: {new Date(invoice.issue_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Due Date: {new Date(invoice.due_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Display invoice items if available */}
          {invoice.items && invoice.items.length > 0 ? (
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Items</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Quantity</th>
                    <th className="text-right py-2">Unit Price</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">{formatCurrency(Number(item.unit_price))}</td>
                      <td className="text-right py-2">
                        {formatCurrency(Number(item.quantity) * Number(item.unit_price))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Summary</h3>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Subtotal</span>
              <span>{formatCurrency(Number(invoice.amount))}</span>
            </div>
            {invoice.tax_rate && Number(invoice.tax_rate) > 0 && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>Tax (7%)</span>
                <span>{formatCurrency(Number(invoice.amount) * 0.07)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 font-bold">
              <span>Total</span>
              <span>
                {formatCurrency(
                  Number(invoice.amount) + (
                    invoice.tax_rate 
                      ? Number(invoice.amount) * (Number(invoice.tax_rate) / 100)
                      : 0
                  )
                )}
              </span>
            </div>
          </div>

          {invoice.notes && (
            <div>
              <h3 className="text-sm font-medium">Notes</h3>
              <p className="text-sm text-muted-foreground mt-1">{invoice.notes}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onDownloadPDF}>
              <Download className="h-4 w-4 mr-1" /> Download PDF
            </Button>
            <Button variant="outline" onClick={onSendEmail}>
              <Mail className="h-4 w-4 mr-1" /> Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewDialog;
