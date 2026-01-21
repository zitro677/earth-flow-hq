import { jsPDF } from "jspdf";
import { Proposal } from "../../types";
import { formatDate } from "../formatters";

// Brand colors
const BRAND_GREEN = { r: 21, g: 128, b: 61 }; // #15803d

export const addClientInformationSection = (
  doc: jsPDF, 
  proposal: Proposal, 
  startY: number,
  margin: number,
  pageWidth: number
) => {
  let yPosition = startY;
  const boxWidth = (pageWidth - margin * 2 - 10) / 2;
  
  // Client info box (left)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPosition, boxWidth, 36, 2, 2, 'FD');

  let clientY = yPosition + 7;
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.text("CLIENTE", margin + 5, clientY);

  doc.setTextColor(40, 40, 40);
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  clientY += 7;
  doc.text(`Nombre: ${proposal.client_name || proposal.clients?.name || "Cliente"}`, margin + 5, clientY);
  
  if (proposal.clients?.email) {
    clientY += 5;
    doc.text(`Email: ${proposal.clients.email}`, margin + 5, clientY);
  }
  
  if (proposal.clients?.phone) {
    clientY += 5;
    doc.text(`Tel: ${proposal.clients.phone}`, margin + 5, clientY);
  }
  
  if (proposal.clients?.address) {
    clientY += 5;
    const address = proposal.clients.address.length > 35 
      ? proposal.clients.address.substring(0, 35) + "..." 
      : proposal.clients.address;
    doc.text(`Dir: ${address}`, margin + 5, clientY);
  }
  
  // Dates box (right)
  const rightX = margin + boxWidth + 10;
  doc.roundedRect(rightX, yPosition, boxWidth, 36, 2, 2, 'FD');

  let dateY = yPosition + 7;
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.text("FECHAS", rightX + 5, dateY);

  doc.setTextColor(40, 40, 40);
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  dateY += 7;
  doc.text(`Emisión: ${formatDate(proposal.issue_date)}`, rightX + 5, dateY);
  dateY += 6;
  doc.text(`Validez: ${formatDate(proposal.valid_until)}`, rightX + 5, dateY);
  dateY += 6;
  
  // Status badge
  const status = proposal.status || "Borrador";
  doc.setFont(undefined, 'bold');
  doc.setFillColor(BRAND_GREEN.r, BRAND_GREEN.g, BRAND_GREEN.b);
  doc.roundedRect(rightX + 5, dateY - 3, 30, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text(status.toUpperCase(), rightX + 20, dateY + 2, { align: "center" });
  
  doc.setTextColor(0, 0, 0);
  return yPosition + 42;
};
