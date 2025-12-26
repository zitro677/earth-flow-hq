
import { PdfContext } from "./pdfContext";

export const generatePdfHeader = (context: PdfContext) => {
  const { doc, pageWidth, yPosition: initialYPosition, project } = context;
  
  // Add header with project name
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(`PROJECT: ${project.name}`, pageWidth / 2, initialYPosition, { align: "center" });
  
  // Update yPosition
  context.yPosition = initialYPosition + 15;
};
