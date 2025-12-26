
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  client_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("dueDate");

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
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

      setProjects(prev => [data, ...prev]);
      toast.success("Project created successfully");
      return data;
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
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

      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      toast.success("Project updated successfully");
      return data;
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
      return null;
    }
  };

  const deleteProject = async (id: string) => {
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

      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success("Project deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
      return false;
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      "Completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Planning": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "On Hold": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
    };
    return colorMap[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  // Filter and sort projects
  const sortedProjects = useMemo(() => {
    let filtered = projects;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = projects.filter(project => 
        project.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "dueDate":
          const dateA = a.end_date ? new Date(a.end_date).getTime() : 0;
          const dateB = b.end_date ? new Date(b.end_date).getTime() : 0;
          return dateB - dateA;
        case "progress":
          // Since we don't have progress in DB, sort by status priority
          const statusPriority = { "In Progress": 3, "Planning": 2, "On Hold": 1, "Completed": 0 };
          return (statusPriority[b.status as keyof typeof statusPriority] || 0) - 
                 (statusPriority[a.status as keyof typeof statusPriority] || 0);
        case "budget":
          return (b.budget || 0) - (a.budget || 0);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return sorted;
  }, [projects, statusFilter, sortOrder]);

  return {
    projects,
    isLoading,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    getStatusColor,
    sortedProjects,
    createProject,
    updateProject,
    deleteProject,
    refetch: loadProjects,
  };
};
