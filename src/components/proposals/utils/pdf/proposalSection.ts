
import { jsPDF } from "jspdf";
import { Proposal } from "../../types";
import { formatDate } from "../formatters";

export const addProposalDetailsSection = (
  doc: jsPDF,
  proposal: Proposal,
  startY: number,
  pageWidth: number
) => {
  // Proposal box styled on the right
  let rightColumn = pageWidth / 2;
  let rightYPosition = startY;
  doc.setFillColor(240, 249, 239);
  doc.setDrawColor(181, 211, 174);
  doc.roundedRect(rightColumn, rightYPosition, 80, 32, 3, 3, 'FD');

  rightYPosition += 7;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(93, 144, 73);
  doc.text("Proposal Details", rightColumn + 6, rightYPosition);

  doc.setTextColor(0,0,0);
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  rightYPosition += 7;
  doc.text(`Issue: ${formatDate(proposal.issue_date)}`, rightColumn + 6, rightYPosition);
  rightYPosition += 5;
  doc.text(`Valid: ${formatDate(proposal.valid_until)}`, rightColumn + 6, rightYPosition);
  rightYPosition += 5;
  doc.text(`Status: ${proposal.status || "Draft"}`, rightColumn + 6, rightYPosition);
  return startY;
};
