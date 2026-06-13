
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Mail, X, FileText, CalendarDays, List, File } from "lucide-react";
import { Proposal } from "./types";
import { formatDate, formatCurrency, parseProposalContent } from "./utils/formatters";

interface ProposalViewDialogProps {
  proposal: Proposal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownloadPDF: () => void;
  onSendEmail: () => void;
}

const ProposalViewDialog: React.FC<ProposalViewDialogProps> = ({
  proposal,
  open,
  onOpenChange,
  onDownloadPDF,
  onSendEmail,
}) => {
  const [sections, setSections] = useState<Record<string, string>>({
    "Project Scope": "",
    "Project Timeline": "",
    "Items & Services": "",
    "Terms & Notes": ""
  });
  
  // Update sections whenever proposal changes
  useEffect(() => {
    if (proposal?.content) {
      try {
        const parsedSections = parseProposalContent(proposal.content);
        setSections(parsedSections);
      } catch (error) {
        console.error("Error parsing proposal content:", error);
        setSections({
          "Project Scope": "Error parsing content",
          "Project Timeline": "",
          "Items & Services": "",
          "Terms & Notes": ""
        });
      }
    }
  }, [proposal?.content]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Propuesta {proposal?.id?.substring(0, 8) || "Vista Previa"}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Ver detalles de la propuesta
        </DialogDescription>

        <div className="space-y-6 py-4">
          {/* Header Information */}
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-xl font-bold">{proposal?.title || "Propuesta"}</h2>
              <p className="text-muted-foreground">
                {formatDate(proposal?.issue_date)}
              </p>
            </div>
            <div className="mt-2 md:mt-0 md:text-right">
              <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {proposal?.status || "Borrador"}
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="p-4 border rounded-md bg-muted/20">
            <h3 className="text-sm font-medium mb-2">Información del Cliente</h3>
            <p>{proposal?.client_name || "Cliente no especificado"}</p>
            <p>{proposal?.clients?.email || ""}</p>
            <p>{proposal?.clients?.address || ""}</p>
          </div>

          {/* Project Scope */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <h3 className="text-sm font-medium">Alcance del Proyecto</h3>
            </div>
            <div className="p-4 border rounded-md whitespace-pre-wrap">
              {sections["Project Scope"] || "Sin alcance definido"}
            </div>
          </div>

          {/* Project Timeline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <h3 className="text-sm font-medium">Cronograma del Proyecto</h3>
            </div>
            <div className="p-4 border rounded-md whitespace-pre-wrap">
              {sections["Project Timeline"] || "Sin cronograma definido"}
            </div>
          </div>

          {/* Items & Services */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <h3 className="text-sm font-medium">Ítems y Servicios</h3>
            </div>
            <div className="p-4 border rounded-md whitespace-pre-wrap">
              {sections["Items & Services"] || "Sin ítems definidos"}
            </div>
          </div>

          {/* Terms & Notes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <h3 className="text-sm font-medium">Términos y Notas</h3>
            </div>
            <div className="p-4 border rounded-md whitespace-pre-wrap">
              {sections["Terms & Notes"] || "Sin términos o notas"}
            </div>
          </div>

          {/* Amount */}
          <div className="flex justify-between font-medium text-lg">
            <span>Monto Total:</span>
            <span>{formatCurrency(Number(proposal?.amount || 0))}</span>
          </div>

          {/* Valid Until */}
          <div className="text-sm text-muted-foreground">
            Válido hasta: {formatDate(proposal?.valid_until)}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onSendEmail}>
            <Mail className="h-4 w-4 mr-2" /> Correo
          </Button>
          <Button onClick={onDownloadPDF}>
            <Download className="h-4 w-4 mr-2" /> Descargar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalViewDialog;
