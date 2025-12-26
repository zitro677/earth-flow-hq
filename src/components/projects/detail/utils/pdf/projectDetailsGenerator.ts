
import { format } from "date-fns";
import { PdfContext } from "./pdfContext";

export const generateProjectDetails = (context: PdfContext) => {
  const { doc, margin, contentWidth, yPosition: initialYPosition, project } = context;
  
  // Add project details section
  doc.setFillColor(240, 240, 240);
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, initialYPosition, contentWidth, 40, 'FD');
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  let yPos = initialYPosition + 10;
  doc.text("Project Details:", margin + 5, yPos);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  yPos += 7;
  doc.text(`ID: ${project.id}`, margin + 5, yPos);
  doc.text(`Client: ${project.client || 'N/A'}`, margin + 80, yPos);
  
  yPos += 6;
  doc.text(`Status: ${project.status || 'N/A'}`, margin + 5, yPos);
  doc.text(`Progress: ${project.progress || 0}%`, margin + 80, yPos);
  
  yPos += 6;
  doc.text(`Start Date: ${project.startDate ? format(new Date(project.startDate), 'MM/dd/yyyy') : 'N/A'}`, margin + 5, yPos);
  doc.text(`Due Date: ${project.dueDate ? format(new Date(project.dueDate), 'MM/dd/yyyy') : 'N/A'}`, margin + 80, yPos);
  
  // Update yPosition
  context.yPosition = initialYPosition + 40 + 15;
};
