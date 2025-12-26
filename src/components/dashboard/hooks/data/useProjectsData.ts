
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useProjectsData = (lastUpdate: number) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          console.log("No authenticated user, clearing projects data");
          setProjects([]);
          setIsLoading(false);
          return;
        }

        console.log("Loading real projects data for user:", session.user.email);
        const { data: projectsData, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching projects:", error);
          setProjects([]);
        } else {
          console.log("Loaded projects from database:", projectsData?.length || 0);
          setProjects(projectsData || []);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [lastUpdate]);

  return { projects, isLoading };
};
