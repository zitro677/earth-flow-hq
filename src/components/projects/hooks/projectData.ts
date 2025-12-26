
import { supabase } from "@/integrations/supabase/client";

export const getAllProjects = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      console.log("No authenticated user for projects");
      return [];
    }

    console.log("Loading real projects data for user:", session.user.email);
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    console.log("Loaded projects from database:", projects?.length || 0);
    return projects || [];
  } catch (error) {
    console.error("Error in getAllProjects:", error);
    return [];
  }
};
