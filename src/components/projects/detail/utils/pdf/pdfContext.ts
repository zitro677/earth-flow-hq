
import { jsPDF } from "jspdf";

export interface PdfContext {
  doc: jsPDF;
  pageWidth: number;
  margin: number;
  contentWidth: number;
  yPosition: number;
  project: any;
  extraData: any;
  teamMembers: any[];
}

export const checkPageBreak = (context: PdfContext, neededHeight: number = 100) => {
  // If we're too close to the bottom of the page, add a new page
  if (context.yPosition > context.doc.internal.pageSize.height - neededHeight) {
    context.doc.addPage();
    context.yPosition = 20;
    return true;
  }
  return false;
};
