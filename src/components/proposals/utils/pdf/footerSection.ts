import { jsPDF } from "jspdf";

// Brand colors
const BRAND_GREEN = { r: 21, g: 128, b: 61 }; // #15803d

export const addFooterSection = (
  doc: jsPDF,
  margin: number,
  pageWidth: number,
  startY: number
) => {
  let yPosition = startY;
  const contentWidth = pageWidth - margin * 2;
  
  // "Aceptar Propuesta" button
  const buttonWidth = 80;
  const buttonX = (pageWidth - buttonWidth) / 2;
  
  doc.setFillColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.roundedRect(buttonX, yPosition, buttonWidth, 12, 3, 3, 'F');
  
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("ACEPTAR PROPUESTA", pageWidth / 2, yPosition + 8, { align: "center" });
  
  yPosition += 18;
  
  // Footer line
  doc.setDrawColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.setLineWidth(0.3);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  
  yPosition += 5;
  
  // Company info footer
  doc.setFont(undefined, "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text("AutoseguroDJ S.A.S | Blindaje y Seguridad Vehicular", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 4;
  doc.text("Tel: +57 304 257 61 04 | gerencia@autosegurodj.com | www.autosegurodj.com", pageWidth / 2, yPosition, { align: "center" });
  
  doc.setTextColor(0, 0, 0);
  return yPosition;
};
