
import { format } from "date-fns";
import { PdfContext } from "./pdfContext";

export const addFooter = (context: PdfContext) => {
  const { doc, pageWidth } = context;
  
  // Add footer with generation info
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated on ${format(new Date(), 'MMM dd, yyyy')} - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
};
