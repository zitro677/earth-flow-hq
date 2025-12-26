
import { PdfContext } from "./pdfContext";

export const generateBudgetAndHours = (context: PdfContext) => {
  const { doc, margin, contentWidth, yPosition: initialYPosition, project, extraData } = context;
  
  // Add budget section
  doc.setFillColor(240, 240, 240);
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, initialYPosition, contentWidth / 2 - 5, 40, 'FD');
  doc.rect(margin + contentWidth / 2 + 5, initialYPosition, contentWidth / 2 - 5, 40, 'FD');
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  let yPos = initialYPosition + 10;
  doc.text("Budget:", margin + 5, yPos);
  doc.text("Hours:", margin + contentWidth / 2 + 10, yPos);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  yPos += 7;
  doc.text(`Total Budget: $${project.budget || 0}`, margin + 5, yPos);
  doc.text(`Estimated Hours: ${extraData?.estimatedHours || 0}`, margin + contentWidth / 2 + 10, yPos);
  
  yPos += 6;
  doc.text(`Budget Used: $${extraData?.totalCost || 0}`, margin + 5, yPos);
  doc.text(`Hours Logged: ${extraData?.hoursLogged || 0}`, margin + contentWidth / 2 + 10, yPos);
  
  // Update yPosition
  context.yPosition = initialYPosition + 40 + 20;
};
