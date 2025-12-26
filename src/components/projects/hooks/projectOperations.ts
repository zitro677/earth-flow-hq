
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      toast.error("You must be logged in to create projects");
      return null;
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        user_id: session.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
      return null;
    }

    toast.success("Project created successfully");
    return data;
  } catch (error) {
    console.error("Error creating project:", error);
    toast.error("Failed to create project");
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
