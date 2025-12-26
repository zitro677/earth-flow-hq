
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { format } from "date-fns";
import { generatePdfHeader } from "./pdf/headerGenerator";
import { generateProjectDetails } from "./pdf/projectDetailsGenerator";
import { generateBudgetAndHours } from "./pdf/budgetHoursGenerator";
import { generateDescription } from "./pdf/descriptionGenerator";
import { generateTeamMembers } from "./pdf/teamMembersGenerator";
import { generateTasks } from "./pdf/tasksGenerator";
import { generateMaterials } from "./pdf/materialsGenerator";
import { generateNotes } from "./pdf/notesGenerator";
import { addFooter } from "./pdf/footerGenerator";
import { PdfContext } from "./pdf/pdfContext";

interface ProjectPdfGeneratorProps {
  project: any;
  extraData: any;
  teamMembers: any[];
}

// Add type definition for jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

const ProjectPdfGenerator = ({ project, extraData, teamMembers }: ProjectPdfGeneratorProps) => {
  const generatePDF = () => {
    console.group('PDF Generation Process');
    console.log('Input Project:', project);
    console.log('Extra Data:', extraData);
    console.log('Team Members:', teamMembers);

    try {
      // Validate input data
      if (!project) {
        console.error('No project data provided');
        return false;
      }

      // Initialize PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      
      // Create context object to share across generators
      const context: PdfContext = {
        doc,
        pageWidth,
        margin,
        contentWidth: pageWidth - (margin * 2),
        yPosition: 20,
        project,
        extraData: extraData || {},
        teamMembers: teamMembers || []
      };
      
      console.log('PDF Context Created:', context);

      // Generate PDF sections with error handling
      try {
        generatePdfHeader(context);
        generateProjectDetails(context);
        generateBudgetAndHours(context);
        generateDescription(context);
        generateTeamMembers(context);
        generateTasks(context);
        generateMaterials(context);
        generateNotes(context);
        
        // Add footer to all pages
        addFooter(context);
      } catch (generationError) {
        console.error('Error during PDF section generation:', generationError);
        return false;
      }
      
      // Save the PDF
      try {
        const filename = `Project_${project.id || 'Unknown'}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
        doc.save(filename);
        console.log('PDF generated successfully:', filename);
        console.groupEnd();
        return true;
      } catch (saveError) {
        console.error('Error saving PDF:', saveError);
        return false;
      }
    } catch (error) {
      console.error('Unexpected error in PDF generation:', error);
      console.groupEnd();
      return false;
    }
  };

  return { generatePDF };
};

export default ProjectPdfGenerator;
