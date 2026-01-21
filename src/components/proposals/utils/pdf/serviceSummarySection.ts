import { jsPDF } from "jspdf";
import { Proposal } from "../../types";
import { parseProposalContent } from "../formatters";

// Brand colors
const BRAND_GREEN = { r: 21, g: 128, b: 61 }; // #15803d

export const addServiceSummarySection = (
  doc: jsPDF,
  proposal: Proposal,
  margin: number,
  contentWidth: number,
  startY: number
) => {
  let yPosition = startY;
  
  // Section title
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.text("RESUMEN DE SERVICIO", margin, yPosition);
  
  yPosition += 6;
  
  // Table header
  doc.setFillColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.rect(margin, yPosition, contentWidth, 7, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Concepto", margin + 3, yPosition + 5);
  doc.text("Detalle", margin + 45, yPosition + 5);
  
  yPosition += 7;
  
  // Parse content to get scope and timeline
  const sections = parseProposalContent(proposal.content);
  const scope = proposal.scope || sections["Alcance del Servicio"] || "Servicio de blindaje vehicular";
  const timeline = proposal.timeline || sections["Tiempo de Entrega"] || "2 semanas desde recepción";
  
  // Table rows
  const rows = [
    { concept: "Servicio", detail: scope.length > 60 ? scope.substring(0, 60) + "..." : scope },
    { concept: "Material", detail: "Laminado de seguridad certificado" },
    { concept: "Tiempo", detail: timeline.length > 50 ? timeline.substring(0, 50) + "..." : timeline }
  ];
  
  doc.setTextColor(40, 40, 40);
  doc.setFont(undefined, "normal");
  
  rows.forEach((row, index) => {
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPosition, contentWidth, 7, 'F');
    }
    
    // Draw cell borders
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(margin, yPosition + 7, margin + contentWidth, yPosition + 7);
    
    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.text(row.concept, margin + 3, yPosition + 5);
    doc.setFont(undefined, "normal");
    doc.text(row.detail, margin + 45, yPosition + 5);
    
    yPosition += 7;
  });
  
  // Border around table
  doc.setDrawColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.setLineWidth(0.3);
  doc.rect(margin, startY + 6, contentWidth, yPosition - startY - 6);
  
  return yPosition + 6;
};
