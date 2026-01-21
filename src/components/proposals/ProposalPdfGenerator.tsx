import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Proposal } from "./types";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  addHeaderSection,
  addClientInformationSection,
  addServiceSummarySection,
  addPricingSummarySection,
  addPaymentTermsSection,
  addContentSections,
  addFooterSection,
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
      const pageHeight = doc.internal.pageSize.height;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);

      // Calculate total for payment terms
      const amount = Number(proposal.amount || proposal.subtotal || 0);
      const tax = amount * 0.19;
      const total = amount + tax;

      // Header section with logo and company info
      yPosition = await addHeaderSection(doc, "PROPUESTA COMERCIAL", yPosition, pageWidth);

      // Client and dates section (two columns)
      yPosition = addClientInformationSection(doc, proposal, yPosition, margin, pageWidth);

      // Service summary section
      yPosition = addServiceSummarySection(doc, proposal, margin, contentWidth, yPosition);

      // Pricing section with items
      yPosition = addPricingSummarySection(
        doc,
        proposal,
        margin,
        yPosition,
        pageWidth,
        contentWidth
      );

      // Payment terms section (30%/70%)
      yPosition = addPaymentTermsSection(doc, total, margin, contentWidth, yPosition);

      // Notes and guarantees section
      yPosition = addContentSections(doc, proposal, margin, contentWidth, yPosition);

      // Footer with accept button
      // Check if we have enough space, if not just add minimal footer
      if (yPosition < pageHeight - 50) {
        addFooterSection(doc, margin, pageWidth, yPosition);
      }

      // Page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Generado: ${format(new Date(), 'dd/MM/yyyy')} | Página ${i} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 5,
          { align: "center" }
        );
      }
      doc.setTextColor(0, 0, 0);

      // Save the PDF
      const clientName = proposal.client_name || proposal.clients?.name || "cliente";
      const safeClientName = clientName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      doc.save(`Propuesta_${safeClientName}_${proposal.id.substring(0, 6)}.pdf`);
      toast.success("PDF generado exitosamente");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error al generar el PDF");
      return null;
    }
  };

  return { generatePDF };
};

export default ProposalPdfGenerator;
