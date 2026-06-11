
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getWorkspaceUserId } from "@/lib/workspace";

export const updateProject = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
      return null;
    }

    toast.success("Project updated successfully");
    return data;
  } catch (error) {
    console.error("Error updating project:", error);
    toast.error("Failed to update project");
    return null;
  }
};

export const addProject = async (projectData: any) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      toast.error("Debes iniciar sesión para crear proyectos");
      return null;
    }

    // Map form fields to database columns
    const dbData = {
      name: projectData.name,
      description: projectData.description,
      status: projectData.status,
      budget: projectData.budget ? parseFloat(projectData.budget) : null,
      start_date: projectData.startDate,
      end_date: projectData.dueDate,
      user_id: getWorkspaceUserId(session.user.id),
      // client_id would need to be a UUID from clients table, not a string name
      // For now we'll leave it null - user should select from existing clients
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      toast.error("Error al crear el proyecto");
      return null;
    }

    toast.success("Proyecto creado exitosamente");
    return data;
  } catch (error) {
    console.error("Error creating project:", error);
    toast.error("Error al crear el proyecto");
    return null;
  }
};

export const deleteProject = async (id: string) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
      return false;
    }

    toast.success("Project deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    toast.error("Failed to delete project");
    return false;
  }
};
