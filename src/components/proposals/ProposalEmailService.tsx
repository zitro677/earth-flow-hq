
import { Proposal } from "./types";
import { toast } from "sonner";
import { formatCurrency, formatDate, parseProposalContent } from "./utils/formatters";
import ProposalPdfGenerator from "./ProposalPdfGenerator";

const ProposalEmailService = ({ proposal }: { proposal: Proposal }) => {
  const sendEmail = async () => {
    try {
      // Create email subject
      const subject = `Proposal: ${proposal.title || `Proposal #${proposal.id.substring(0, 8)}`}`;
      
      // Calculate pricing
      const subtotal = Number(proposal.amount || 0);
      const tax = subtotal * 0.07; // Corrected to 7%
      const total = subtotal + tax;
      
      // Build email body with key information first
      let body = `Dear ${proposal.client_name},\n\n`;
      body += `Please find our proposal for your review.\n\n`;
      
      // Key Information Section
      body += `CLIENT INFORMATION\n`;
      body += `----------------\n`;
      body += `Name: ${proposal.client_name}\n`;
      if (proposal.clients?.email) {
        body += `Email: ${proposal.clients.email}\n`;
      }
      if (proposal.clients?.address) {
        body += `Address: ${proposal.clients.address}\n`;
      }
      body += `\n`;
      
      // Proposal Details
      body += `PROPOSAL DETAILS\n`;
      body += `----------------\n`;
      body += `Issue Date: ${formatDate(proposal.issue_date)}\n`;
      body += `Valid Until: ${formatDate(proposal.valid_until)}\n`;
      body += `Status: ${proposal.status || "Draft"}\n\n`;
      
      // Pricing Summary
      body += `PRICING SUMMARY\n`;
      body += `---------------\n`;
      body += `Subtotal: ${formatCurrency(subtotal)}\n`;
      body += `Tax (7%): ${formatCurrency(tax)}\n`;
      body += `Total Amount: ${formatCurrency(total)}\n\n`;
      
      // Add content sections
      if (proposal.content) {
        const contentSections = parseProposalContent(proposal.content);
        
        // Add sections in order
        if (contentSections["Project Scope"]) {
          body += `PROJECT SCOPE\n`;
          body += `-------------\n`;
          body += `${contentSections["Project Scope"]}\n\n`;
        }
        
        if (contentSections["Project Timeline"]) {
          body += `PROJECT TIMELINE\n`;
          body += `----------------\n`;
          body += `${contentSections["Project Timeline"]}\n\n`;
        }
        
        if (contentSections["Items & Services"]) {
          body += `ITEMS & SERVICES\n`;
          body += `----------------\n`;
          body += `${contentSections["Items & Services"]}\n\n`;
        }
        
        if (contentSections["Terms & Notes"]) {
          body += `TERMS & NOTES\n`;
          body += `-------------\n`;
          body += `${contentSections["Terms & Notes"]}\n\n`;
        }
      }
      
      body += `Thank you for considering our services.\n\n`;
      body += `Best regards,\nYour Company`;
      
      // Create and download the PDF (now async)
      const pdfGenerator = ProposalPdfGenerator({ proposal });
      const doc = await pdfGenerator.generatePDF();
      
      // Guide the user
      toast.success(
        "PDF proposal has been downloaded. Please attach it to your email manually.", 
        { duration: 5000 }
      );
      
      // Open default email client
      window.location.href = `mailto:${proposal.clients?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } catch (err) {
      console.error("Error in sendEmail:", err);
      toast.error("Failed to prepare email");
    }
  };

  return { sendEmail };
};

export default ProposalEmailService;
