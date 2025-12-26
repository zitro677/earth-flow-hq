
import { PdfContext, checkPageBreak } from "./pdfContext";

export const generateTasks = (context: PdfContext) => {
  const { doc, margin, yPosition: initialYPosition, extraData } = context;
  
  // Add tasks section
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Tasks:", margin, initialYPosition);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  let yPos = initialYPosition + 7;
  
  if (!extraData?.tasks || extraData.tasks.length === 0) {
    doc.text("No tasks added to this project.", margin, yPos);
    context.yPosition = yPos + 10;
  } else {
    // Create a table for tasks
    const taskData = extraData.tasks.map((task: any) => [
      task.name || "",
      task.status || "",
      task.dueDate || "",
      task.assignee || ""
    ]);
    
    doc.autoTable({
      head: [['Task Name', 'Status', 'Due Date', 'Assignee']],
      body: taskData,
      startY: yPos,
      margin: { left: margin },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [80, 80, 80] },
    });
    
    context.yPosition = doc.lastAutoTable.finalY + 10;
  }
  
  // Check if we need a new page for materials
  checkPageBreak(context);
};
