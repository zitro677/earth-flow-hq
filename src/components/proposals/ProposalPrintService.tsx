
import { Proposal } from "./types";
import { toast } from "sonner";
import ProposalPdfGenerator from "./ProposalPdfGenerator";

interface ProposalPrintServiceProps {
  proposal: Proposal;
}

const ProposalPrintService = ({ proposal }: ProposalPrintServiceProps) => {
  const printProposal = async () => {
    try {
      toast.info("Preparando la propuesta para imprimir...");
      
      const pdfGenerator = ProposalPdfGenerator({ proposal });
      const doc = await pdfGenerator.generatePDF();
      
      if (!doc) {
        throw new Error("Failed to generate PDF for printing");
      }

      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const printWindow = window.open(pdfUrl, '_blank');
      
      if (!printWindow) {
        toast.error("Habilita las ventanas emergentes para imprimir la propuesta");
        return;
      }
      
      printWindow.addEventListener('load', () => {
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
          URL.revokeObjectURL(pdfUrl);
        }, 100);
      });
      
      toast.success("Diálogo de impresión abierto");
    } catch (err) {
      console.error("Error printing proposal:", err);
      toast.error("No se pudo imprimir la propuesta");
    }
  };

  return { printProposal };
};

export default ProposalPrintService;
