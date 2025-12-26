
import { PdfContext, checkPageBreak } from "./pdfContext";

export const generateTeamMembers = (context: PdfContext) => {
  const { doc, margin, yPosition: initialYPosition, teamMembers } = context;
  
  // Add team members section
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Team Members:", margin, initialYPosition);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  let yPos = initialYPosition + 7;
  
  if (!teamMembers || teamMembers.length === 0) {
    doc.text("No team members assigned to this project.", margin, yPos);
    context.yPosition = yPos + 10;
  } else {
    // Create a table for team members
    const teamMemberData = teamMembers.map((member: any) => [
      member.name || "",
      member.role || ""
    ]);
    
    doc.autoTable({
      head: [['Name', 'Role']],
      body: teamMemberData,
      startY: yPos,
      margin: { left: margin },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [80, 80, 80] },
    });
    
    context.yPosition = doc.lastAutoTable.finalY + 10;
  }
  
  // Check if we need a new page for tasks
  checkPageBreak(context);
};
