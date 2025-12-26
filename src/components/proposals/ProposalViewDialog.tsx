
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
          <DialogTitle>Proposal {proposal?.id?.substring(0, 8) || "Preview"}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <DialogDescription className="sr-only">
          View proposal details
        </DialogDescription>

        <div className="space-y-6 py-4">
          {/* Header Information */}
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-xl font-bold">{proposal?.title || "Proposal"}</h2>
              <p className="text-muted-foreground">
                {formatDate(proposal?.issue_date)}
              </p>
            </div>
            <div className="mt-2 md:mt-0 md:text-right">
              <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {proposal?.status || "Draft"}
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="p-4 border rounded-md bg-muted/20">
            <h3 className="text-sm font-medium mb-2">Client Information</h3>
            <p>{proposal?.client_name || "No client specified"}</p>
            <p>{proposal?.clients?.email || ""}</p>
            <p>{proposal?.clients?.address || ""}</p>
          </div>

          {/* Project Scope */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <h3 className="text-sm font-medium">Project Scope</h3>
            </div>
            <div className="p-4 border rounded-md whitespace-pre-wrap">
              {sections["Project Scope"] || "No scope defined"}
            </div>
          </div>

          {/* Project Timeline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <h3 className="text-sm font-medium">Project Timeline</h3>
            </div>
            <div className="p-4 border rounded-md whitespace-pre-wrap">
              {sections["Project Timeline"] || "No timeline specified"}
            </div>
          </div>

          {/* Items & Services */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <h3 className="text-sm font-medium">Items & Services</h3>
            </div>
            <div className="p-4 border rounded-md whitespace-pre-wrap">
              {sections["Items & Services"] || "No items specified"}
            </div>
          </div>

          {/* Terms & Notes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <h3 className="text-sm font-medium">Terms & Notes</h3>
            </div>
            <div className="p-4 border rounded-md whitespace-pre-wrap">
              {sections["Terms & Notes"] || "No terms or notes specified"}
            </div>
          </div>

          {/* Amount */}
          <div className="flex justify-between font-medium text-lg">
            <span>Total Amount:</span>
            <span>{formatCurrency(Number(proposal?.amount || 0))}</span>
          </div>

          {/* Valid Until */}
          <div className="text-sm text-muted-foreground">
            Valid until: {formatDate(proposal?.valid_until)}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onSendEmail}>
            <Mail className="h-4 w-4 mr-2" /> Email
          </Button>
          <Button onClick={onDownloadPDF}>
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalViewDialog;
