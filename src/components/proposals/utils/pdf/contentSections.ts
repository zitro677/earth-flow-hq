import { jsPDF } from "jspdf";
import { parseProposalContent } from "../formatters";
import { Proposal } from "../../types";

// Brand colors
const BRAND_GREEN = { r: 21, g: 128, b: 61 }; // #15803d

export const addContentSections = (
  doc: jsPDF,
  proposal: Proposal,
  margin: number,
  contentWidth: number,
  startY: number
) => {
  let yPosition = startY;
  
  // Get notes from proposal
  const sections = parseProposalContent(proposal.content);
  const notes = proposal.notes || sections["Términos y Notas"] || "";
  
  // Section title
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.text("NOTAS Y GARANTIAS", margin, yPosition);
  
  yPosition += 6;
  
  // Notes box
  doc.setFillColor(250, 252, 250);
  doc.setDrawColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.setLineWidth(0.3);
  
  // Default guarantees
  const defaultNotes = [
    "Incluye garantía por 1 año en material y mano de obra",
    "Homologación ante el Ministerio de Transporte (si aplica)",
    "Entrega en punto de servicio o a domicilio (por acordar)"
  ];
  
  // Calculate box height based on content
  const allNotes = notes ? notes.split('\n').filter(n => n.trim()) : defaultNotes;
  const boxHeight = Math.max(24, allNotes.length * 7 + 10);
  
  doc.roundedRect(margin, yPosition, contentWidth, boxHeight, 2, 2, 'FD');
  
  doc.setTextColor(40, 40, 40);
  doc.setFont(undefined, "normal");
  doc.setFontSize(8);
  
  yPosition += 6;
  
  allNotes.forEach((note) => {
    // Checkmark circle
    doc.setFillColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
    doc.circle(margin + 5, yPosition - 1, 1.5, 'F');
    
    // Checkmark symbol
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.text("✓", margin + 4, yPosition);
    
    // Note text
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(8);
    const noteText = note.length > 80 ? note.substring(0, 80) + "..." : note;
    doc.text(noteText, margin + 12, yPosition);
    
    yPosition += 6;
  });

  return yPosition + 4;
};
