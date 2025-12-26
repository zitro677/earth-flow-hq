
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Proposal } from "./types";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  addHeaderSection,
  addClientInformationSection,
  addProposalDetailsSection,
  addPricingSummarySection,
  addContentSections,
} from "./utils/pdfSections";

interface ProposalPdfGeneratorProps {
  proposal: Proposal;
}

const ProposalPdfGenerator = ({ proposal }: ProposalPdfGeneratorProps) => {
  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Updated: More professional header style (now async)
      yPosition = await addHeaderSection(doc, "PROPOSAL", yPosition, pageWidth);

      // Key Information row: client info and proposal info, now styled
      const clientBoxY = yPosition;
      const proposalBoxY = yPosition;
      // Side-by-side boxes for client (left) and proposal (right)
      addClientInformationSection(doc, proposal, clientBoxY, margin);
      addProposalDetailsSection(doc, proposal, proposalBoxY, pageWidth);

      // Drop position after both info boxes for pricing/summary
      // Increase spacing to account for additional client info (phone & address)
      yPosition += 50; // Increased from 47 to give more space for the client info

      // Updated: improved pricing summary section
      yPosition = addPricingSummarySection(
        doc,
        Number(proposal.amount || 0),
        margin,
        yPosition,
        pageWidth,
        contentWidth
      );

      // Add content sections if available
      if (proposal.content) {
        yPosition = addContentSections(doc, proposal.content, margin, contentWidth, yPosition);
      }

      // Footer with page numbers and generated date
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(160, 160, 160);
        doc.text(
          `Generated on ${format(new Date(), 'MMM dd, yyyy')}   —   Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }
      doc.setTextColor(0, 0, 0);

      // Save the PDF
      doc.save(`Proposal_${proposal.id.substring(0, 8)}.pdf`);
      toast.success("PDF generated successfully");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
      return null;
    }
  };

  return { generatePDF };
};

export default ProposalPdfGenerator;
