import { jsPDF } from "jspdf";
import { formatCurrency } from "../formatters";

// Brand colors
const BRAND_GREEN = { r: 21, g: 128, b: 61 }; // #15803d

export const addPaymentTermsSection = (
  doc: jsPDF,
  total: number,
  margin: number,
  contentWidth: number,
  startY: number
) => {
  let yPosition = startY;
  
  const initialPayment = total * 0.30;
  const finalPayment = total * 0.70;
  
  // Section title
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.text("CONDICIONES DE PAGO", margin, yPosition);
  
  yPosition += 7;
  
  // Payment terms box
  doc.setFillColor(250, 252, 250);
  doc.setDrawColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, contentWidth, 20, 2, 2, 'FD');
  
  doc.setTextColor(40, 40, 40);
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  
  // Bullet points
  yPosition += 7;
  doc.setFillColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.circle(margin + 5, yPosition - 1, 1.2, 'F');
  doc.text(`30% al iniciar: ${formatCurrency(initialPayment)}`, margin + 10, yPosition);
  
  yPosition += 7;
  doc.circle(margin + 5, yPosition - 1, 1.2, 'F');
  doc.text(`70% al finalizar: ${formatCurrency(finalPayment)}`, margin + 10, yPosition);
  
  return yPosition + 12;
};
