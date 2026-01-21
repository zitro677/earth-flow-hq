
import { jsPDF } from "jspdf";
import { formatCurrency } from "../formatters";

export const addPricingSummarySection = (
  doc: jsPDF,
  amount: number,
  margin: number,
  yPosition: number,
  pageWidth: number,
  contentWidth: number
) => {
  const subtotal = amount;
  const tax = subtotal * 0.19; // IVA 19%
  const total = subtotal + tax;

  // === Removed: Outer box with highlight ===
  // doc.setDrawColor(...); doc.setFillColor(...); doc.roundedRect(...);

  // Title
  yPosition += 8;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(80, 80, 80);  // Neutral dark gray
  doc.text("Pricing Summary", margin + 6, yPosition);

  doc.setTextColor(0,0,0);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);

  // Subtotal and tax - left/right
  yPosition += 9;
  doc.text("Subtotal:", margin + 8, yPosition);
  doc.text(formatCurrency(subtotal), pageWidth - margin - 8, yPosition, { align: "right" });

  yPosition += 7;
  doc.text("IVA (19%):", margin + 8, yPosition);
  doc.text(formatCurrency(tax), pageWidth - margin - 8, yPosition, { align: "right" });

  // Decorative line separator with more emphasis
  yPosition += 6;
  doc.setLineWidth(0.5);
  doc.setDrawColor(93, 144, 73);
  doc.line(margin + 5, yPosition, pageWidth - margin - 5, yPosition);

  // === Removed: Box/border around total ===
  yPosition += 10;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(47, 86, 37);

  doc.text("Total Amount:", margin + 8, yPosition);
  doc.text(formatCurrency(total), pageWidth - margin - 8, yPosition, { align: "right" });

  doc.setTextColor(0, 0, 0);

  return yPosition + 18;
};
