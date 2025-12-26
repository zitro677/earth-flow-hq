
import { Proposal } from "./types";
import { toast } from "sonner";
import ProposalPdfGenerator from "./ProposalPdfGenerator";

interface ProposalPrintServiceProps {
  proposal: Proposal;
}

const ProposalPrintService = ({ proposal }: ProposalPrintServiceProps) => {
  const printProposal = async () => {
    try {
      toast.info("Preparing proposal for printing...");
      
      // Use the PDF generator to create the PDF (now async)
      const pdfGenerator = ProposalPdfGenerator({ proposal });
      const doc = await pdfGenerator.generatePDF();
      
      if (!doc) {
        throw new Error("Failed to generate PDF for printing");
      }

      // Convert the PDF to a blob URL and open in a new window for printing
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Open the PDF in a new window
      const printWindow = window.open(pdfUrl, '_blank');
      
      if (!printWindow) {
        toast.error("Please enable pop-ups to print the proposal");
        return;
      }
      
      // Trigger print dialog once the PDF is loaded
      printWindow.addEventListener('load', () => {
        printWindow.print();
        // Clean up after printing
        setTimeout(() => {
          printWindow.close();
          URL.revokeObjectURL(pdfUrl);
        }, 100);
      });
      
      toast.success("Print dialog opened");
    } catch (err) {
      console.error("Error printing proposal:", err);
      toast.error("Failed to print proposal");
    }
  };

  return { printProposal };
};

export default ProposalPrintService;
