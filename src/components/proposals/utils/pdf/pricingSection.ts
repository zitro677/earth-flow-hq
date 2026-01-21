import { jsPDF } from "jspdf";
import { formatCurrency } from "../formatters";
import { Proposal } from "../../types";

// Brand colors
const BRAND_GREEN = { r: 21, g: 128, b: 61 }; // #15803d

export const addPricingSummarySection = (
  doc: jsPDF,
  proposal: Proposal,
  margin: number,
  yPosition: number,
  pageWidth: number,
  contentWidth: number
) => {
  const amount = Number(proposal.amount || proposal.subtotal || 0);
  const subtotal = amount;
  const tax = subtotal * 0.19; // IVA 19%
  const total = subtotal + tax;

  // Section title
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.text("PROPUESTA ECONOMICA", margin, yPosition);
  
  yPosition += 6;
  
  // Table header
  doc.setFillColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.rect(margin, yPosition, contentWidth, 7, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Item", margin + 3, yPosition + 5);
  doc.text("Valor", pageWidth - margin - 3, yPosition + 5, { align: "right" });
  
  yPosition += 7;
  
  // Items from proposal
  const items = proposal.items || [];
  doc.setTextColor(40, 40, 40);
  
  if (items.length > 0) {
    items.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPosition, contentWidth, 7, 'F');
      }
      
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(margin, yPosition + 7, margin + contentWidth, yPosition + 7);
      
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      const desc = item.description.length > 50 ? item.description.substring(0, 50) + "..." : item.description;
      doc.text(desc, margin + 3, yPosition + 5);
      const itemTotal = (item.quantity || 1) * (item.unit_price || 0);
      doc.text(formatCurrency(itemTotal), pageWidth - margin - 3, yPosition + 5, { align: "right" });
      
      yPosition += 7;
    });
  } else {
    // Default row if no items
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, yPosition, contentWidth, 7, 'F');
    doc.setFontSize(8);
    doc.text("Servicio de blindaje vehicular", margin + 3, yPosition + 5);
    doc.text(formatCurrency(subtotal), pageWidth - margin - 3, yPosition + 5, { align: "right" });
    yPosition += 7;
  }
  
  // Separator line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin + contentWidth * 0.5, yPosition, margin + contentWidth, yPosition);
  
  yPosition += 2;
  
  // Subtotal
  doc.setFontSize(8);
  doc.setFont(undefined, "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Subtotal:", margin + contentWidth * 0.6, yPosition + 5);
  doc.text(formatCurrency(subtotal), pageWidth - margin - 3, yPosition + 5, { align: "right" });
  yPosition += 6;
  
  // IVA
  doc.text("IVA (19%):", margin + contentWidth * 0.6, yPosition + 5);
  doc.text(formatCurrency(tax), pageWidth - margin - 3, yPosition + 5, { align: "right" });
  yPosition += 6;
  
  // Total highlight
  doc.setFillColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.rect(margin + contentWidth * 0.5, yPosition, contentWidth * 0.5, 9, 'F');
  
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL:", margin + contentWidth * 0.55, yPosition + 6);
  doc.text(formatCurrency(total), pageWidth - margin - 3, yPosition + 6, { align: "right" });
  
  // Border around table
  doc.setDrawColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.setLineWidth(0.3);
  
  doc.setTextColor(0, 0, 0);

  return yPosition + 14;
};
