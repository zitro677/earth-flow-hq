
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Eye, MoreHorizontal, CheckCircle, Edit, Printer, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Proposal } from "./types";
import { toast } from "sonner";
import ProposalViewDialog from "./ProposalViewDialog";
import ProposalPdfGenerator from "./ProposalPdfGenerator";
import ProposalEmailService from "./ProposalEmailService";
import ProposalStatusManager from "./ProposalStatusManager";
import ProposalPrintService from "./ProposalPrintService";

interface ProposalActionsProps {
  proposal: Proposal;
}

const ProposalActions: React.FC<ProposalActionsProps> = ({ proposal }) => {
  const navigate = useNavigate();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // Use our service components
  const pdfGenerator = ProposalPdfGenerator({ proposal });
  const emailService = ProposalEmailService({ proposal });
  const statusManager = ProposalStatusManager({ proposal });
  const printService = ProposalPrintService({ proposal });

  const handleViewProposal = () => {
    try {
      console.log("Viewing proposal:", proposal);
      setViewDialogOpen(true);
    } catch (error) {
      console.error("Error opening preview dialog:", error);
      toast.error("Error al abrir la vista previa");
    }
  };

  const handleDownloadPDF = () => {
    try {
      pdfGenerator.generatePDF();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error al generar PDF");
    }
  };

  const handlePrintProposal = () => {
    try {
      printService.printProposal();
    } catch (error) {
      console.error("Error printing proposal:", error);
      toast.error("Error al imprimir la propuesta");
    }
  };

  const handleSendEmail = () => {
    try {
      emailService.sendEmail();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error al enviar el correo");
    }
  };

  const handleEditProposal = () => {
    try {
      // Navigate to the edit proposal page with the proposal ID
      navigate(`/proposals/edit/${proposal.id}`);
    } catch (error) {
      console.error("Error navigating to edit page:", error);
      toast.error("Error al navegar a la edición");
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={handleViewProposal}>
          <Eye className="h-4 w-4 mr-1" /> Ver
        </Button>
        <Button size="sm" variant="outline" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-1" /> PDF
        </Button>
        <Button size="sm" variant="outline" onClick={handleSendEmail}>
          <Mail className="h-4 w-4 mr-1" /> Correo
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {proposal.status !== "Approved" && (
              <DropdownMenuItem onClick={statusManager.markAsApproved}>
                <CheckCircle className="h-4 w-4 mr-2" /> Marcar como Aprobada
              </DropdownMenuItem>
            )}
            {proposal.status !== "Rejected" && (
              <DropdownMenuItem onClick={statusManager.markAsRejected}>
                <X className="h-4 w-4 mr-2" /> Marcar como Rechazada
              </DropdownMenuItem>
            )}
            {proposal.status !== "Sent" && (
              <DropdownMenuItem onClick={statusManager.markAsSent}>
                <Mail className="h-4 w-4 mr-2" /> Marcar como Enviada
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handlePrintProposal}>
              <Printer className="h-4 w-4 mr-2" /> Imprimir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditProposal}>
              <Edit className="h-4 w-4 mr-2" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-500"
              onClick={statusManager.deleteProposalHandler}
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProposalViewDialog
        proposal={proposal}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onDownloadPDF={handleDownloadPDF}
        onSendEmail={handleSendEmail}
      />
    </>
  );
};

export default ProposalActions;
