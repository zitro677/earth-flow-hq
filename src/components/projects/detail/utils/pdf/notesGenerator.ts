
import { PdfContext, checkPageBreak } from "./pdfContext";

export const generateNotes = (context: PdfContext) => {
  const { doc, margin, yPosition: initialYPosition, extraData } = context;
  
  // Add notes section
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Notes:", margin, initialYPosition);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  let yPos = initialYPosition + 7;
  
  if (!extraData?.notes || extraData.notes.length === 0) {
    doc.text("No notes added to this project.", margin, yPos);
    context.yPosition = yPos + 10;
  } else {
    // Create a table for notes
    const noteData = extraData.notes.map((note: any) => [
      note.date || "",
      note.author || "",
      note.content || ""
    ]);
    
    doc.autoTable({
      head: [['Date', 'Author', 'Content']],
      body: noteData,
      startY: yPos,
      margin: { left: margin },
      styles: { fontSize: 10, cellWidth: 'auto' },
      columnStyles: { 2: { cellWidth: 100 } },
      headStyles: { fillColor: [80, 80, 80] },
    });
    
    context.yPosition = doc.lastAutoTable.finalY + 10;
  }
};
