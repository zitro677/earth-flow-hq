
import { useMemo } from "react";

export const useRecentProjects = (projects: any[]) => {
  return useMemo(() => {
    console.log("Getting recent projects from real data:", projects?.length || 0);
    
    if (!projects || projects.length === 0) {
      return [];
    }

    // Sort by created_at and take the 5 most recent
    return projects
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(project => ({
        id: project.id,
        name: project.name,
        status: project.status,
        end_date: project.end_date,
        budget: project.budget
      }));
  }, [projects]);
};
