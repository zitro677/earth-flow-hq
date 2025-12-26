
import { PdfContext, checkPageBreak } from "./pdfContext";

export const generateMaterials = (context: PdfContext) => {
  const { doc, margin, yPosition: initialYPosition, extraData } = context;
  
  // Add materials section
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Materials:", margin, initialYPosition);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  let yPos = initialYPosition + 7;
  
  if (!extraData?.materials || extraData.materials.length === 0) {
    doc.text("No materials added to this project.", margin, yPos);
    context.yPosition = yPos + 10;
  } else {
    // Create a table for materials
    const materialData = extraData.materials.map((material: any) => [
      material.name || "",
      material.quantity || "",
      material.cost || "",
      material.status || ""
    ]);
    
    doc.autoTable({
      head: [['Material Name', 'Quantity', 'Cost', 'Status']],
      body: materialData,
      startY: yPos,
      margin: { left: margin },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [80, 80, 80] },
    });
    
    context.yPosition = doc.lastAutoTable.finalY + 10;
  }
  
  // Check if we need a new page for notes
  checkPageBreak(context);
};
