
import { jsPDF } from "jspdf";
import { parseProposalContent } from "../formatters";

export const addContentSections = (
  doc: jsPDF,
  content: string,
  margin: number,
  contentWidth: number,
  startY: number
) => {
  let yPosition = startY;
  const sectionBg = [255, 255, 248];
  const sections = parseProposalContent(content);

  Object.entries(sections).forEach(([title, content]) => {
    // New page?
    if (yPosition > doc.internal.pageSize.height - 60) {
      doc.addPage();
      yPosition = 20;
    }

    // Section header highlight
    doc.setFillColor(sectionBg[0], sectionBg[1], sectionBg[2]);
    doc.roundedRect(margin, yPosition, contentWidth, 11, 3, 3, "F");
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(93, 144, 73);
    doc.text(title, margin + 4, yPosition + 8);

    yPosition += 15;

    doc.setTextColor(80,80,80);
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    const textToDisplay = content && content.trim() ? content : `No ${title.toLowerCase()} provided`;
    const lines = doc.splitTextToSize(textToDisplay, contentWidth);
    doc.text(lines, margin + 1, yPosition);
    yPosition += lines.length * 5 + 10;
    doc.setTextColor(0,0,0);
  });

  // Footer
  if (yPosition > doc.internal.pageSize.height - 30) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(9);
  doc.setTextColor(145, 175, 140);
  doc.text("Green Landscape Irrigation", margin, yPosition);
  yPosition += 4;
  doc.text("Phone: (727) 484-5516 | Email: greenplanetlandscaping01@gmail.com", margin, yPosition);
  yPosition += 4;
  doc.text("Web: www.greenlandscapeirrigation.com", margin, yPosition);

  doc.setTextColor(0,0,0);
  return yPosition;
};
