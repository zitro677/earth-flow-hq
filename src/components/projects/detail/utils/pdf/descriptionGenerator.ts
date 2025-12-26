
import { PdfContext } from "./pdfContext";

export const generateDescription = (context: PdfContext) => {
  const { doc, margin, contentWidth, yPosition: initialYPosition, project, extraData } = context;
  
  // Add project description
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Description:", margin, initialYPosition);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  const descriptionText = extraData?.description || project.description || "No description available.";
  const descriptionLines = doc.splitTextToSize(descriptionText, contentWidth);
  doc.text(descriptionLines, margin, initialYPosition + 7);
  
  // Update yPosition
  context.yPosition = initialYPosition + 7 + (descriptionLines.length * 5) + 10;
};
