
import { jsPDF } from "jspdf";
import { Proposal } from "../../types";

export const addClientInformationSection = (
  doc: jsPDF, 
  proposal: Proposal, 
  startY: number,
  margin: number
) => {
  // Client info in a colored box
  let yPosition = startY;
  doc.setFillColor(232, 237, 228);
  doc.setDrawColor(181, 211, 174);
  doc.roundedRect(margin, yPosition, 80, 42, 3, 3, 'FD');

  yPosition += 7;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(93, 144, 73);
  doc.text("Client Information", margin + 6, yPosition);

  doc.setTextColor(0,0,0);
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  yPosition += 6;
  doc.text(`${proposal.client_name || "Client"}`, margin + 6, yPosition);
  yPosition += 5;
  
  // Add email if available
  if (proposal.clients?.email) {
    doc.text(`${proposal.clients.email}`, margin + 6, yPosition);
    yPosition += 5;
  }
  
  // Add phone if available - removed emoji
  if (proposal.clients?.phone) {
    doc.text(`Phone: ${proposal.clients.phone}`, margin + 6, yPosition);
    yPosition += 5;
  }
  
  // Add address if available - removed emoji
  if (proposal.clients?.address) {
    doc.text(`Address: ${proposal.clients.address}`, margin + 6, yPosition);
  }
  
  return startY;
};
