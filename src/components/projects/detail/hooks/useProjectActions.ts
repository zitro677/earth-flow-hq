
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { updateProject } from "../../hooks/projectOperations";
import ProjectPdfGenerator from "../utils/ProjectPdfGenerator";

export const useProjectActions = (projectId: string, projectName: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEditProject = () => {
    // Navigate to the edit project form with the project id
    console.log(`Navigating to edit project: ${projectId}`);
    navigate(`/projects/edit/${projectId}`);
  };

  const handleShareProject = () => {
    toast({
      title: "Compartir Proyecto",
      description: "Enlace del proyecto copiado al portapapeles.",
    });
    
    navigator.clipboard.writeText(`${window.location.origin}/projects/${projectId}`).catch(() => {
      toast({
        title: "Error de Portapapeles",
        description: "No se pudo copiar el enlace al portapapeles.",
        variant: "destructive"
      });
    });
  };

  const handleExportProject = (project: any, extraData: any, teamMembers: any[]) => {
    toast({
      title: "Exportar Proyecto",
      description: "Generando PDF del proyecto...",
    });
    
    try {
      if (!project || !project.id) {
        toast({
          title: "Error al Exportar",
          description: "Los datos del proyecto son inválidos.",
          variant: "destructive"
        });
        return;
      }
      
      const pdfGenerator = ProjectPdfGenerator({ project, extraData, teamMembers });
      const success = pdfGenerator.generatePDF();
      
      if (success) {
        toast({
          title: "Exportación Completa",
          description: "Se descargó el PDF del proyecto.",
        });
      } else {
        toast({
          title: "Error al Exportar",
          description: "No se pudo generar el PDF del proyecto.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in handleExportProject:", error);
      toast({
        title: "Error al Exportar",
        description: "Ocurrió un error inesperado durante la generación del PDF.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateProgress = async (newProgress: number) => {
    if (newProgress < 0 || newProgress > 100) {
      toast({
        title: "Valor de Progreso Inválido",
        description: "El progreso debe estar entre 0 y 100.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const result = await updateProject(projectId, { progress: newProgress });
      
      if (result) {
        toast({
          title: "Proyecto Actualizado",
          description: `Progreso actualizado a ${newProgress}%.`,
        });
        return true;
      } else {
        toast({
          title: "Error al Actualizar",
          description: "No se pudo actualizar el progreso del proyecto.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error updating project progress:", error);
      toast({
        title: "Error al Actualizar",
        description: "Ocurrió un error al actualizar el progreso.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    handleEditProject,
    handleShareProject,
    handleExportProject,
    handleUpdateProgress
  };
};
