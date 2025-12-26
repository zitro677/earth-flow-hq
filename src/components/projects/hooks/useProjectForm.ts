
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
import { addProject, updateProject } from "./projectOperations";

// Define schema for form validation
export const projectFormSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  client: z.string().min(2, "Client name is required"),
  status: z.string(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.date(),
  dueDate: z.date(),
  budget: z.string().min(1, "Budget is required"),
  estimatedHours: z.string().min(1, "Estimated hours are required"),
  team: z.array(z.string()).optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const useProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialProject, setInitialProject] = useState<any>(null);
  const [loading, setLoading] = useState(id ? true : false);

  // Initialize form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      client: "",
      status: "Planning",
      description: "",
      startDate: new Date(),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      budget: "",
      estimatedHours: "",
      team: [],
    },
  });

  // Load project data if editing
  useEffect(() => {
    if (id) {
      setIsEditMode(true);

      const loadProject = () => {
        console.log("Loading project with ID:", id);
        
        // Check localStorage first (for user-created projects)
        const storedUserProjects = localStorage.getItem("landscape_projects");
        const userProjects = storedUserProjects ? JSON.parse(storedUserProjects) : [];
        
        // Check default projects
        let foundProject = null;
        
        try {
          // First check if we have it in user projects
          if (userProjects.length > 0) {
            foundProject = userProjects.find((p: any) => String(p.id) === String(id));
          }
          
          // If not found in user projects, check the projectsData
          if (!foundProject) {
            const projectsData = localStorage.getItem("projectsData");
            if (projectsData) {
              const projects = JSON.parse(projectsData);
              foundProject = projects.find((p: any) => String(p.id) === String(id));
            }
          }
          
          // Also check static project data
          if (!foundProject) {
            try {
              const { projects } = require("./useProjects");
              foundProject = projects.find((p: any) => String(p.id) === String(id));
            } catch (error) {
              console.error("Error loading static projects:", error);
            }
          }
          
          if (foundProject) {
            console.log("Project found for editing:", foundProject);
            setInitialProject(foundProject);
            
            // Format dates properly
            let startDate = new Date();
            let dueDate = new Date();
            
            try {
              startDate = foundProject.startDate ? new Date(foundProject.startDate) : new Date();
              dueDate = foundProject.dueDate ? new Date(foundProject.dueDate) : new Date(new Date().setMonth(new Date().getMonth() + 1));
            } catch (error) {
              console.error("Error parsing dates:", error);
            }
            
            // Clean budget value
            const cleanBudget = foundProject.budget 
              ? typeof foundProject.budget === 'string' 
                ? foundProject.budget.replace(/[$,]/g, '') 
                : foundProject.budget.toString()
              : "";
            
            // Set form values
            form.reset({
              name: foundProject.name || "",
              client: foundProject.client || "",
              status: foundProject.status || "Planning",
              description: foundProject.description || "",
              startDate: startDate,
              dueDate: dueDate,
              budget: cleanBudget,
              estimatedHours: foundProject.estimatedHours?.toString() || "",
              team: foundProject.team || [],
            });
          } else {
            console.error("Project not found for editing with ID:", id);
            toast.error("Project not found for editing");
            navigate("/projects");
          }
        } catch (error) {
          console.error("Error loading project for edit:", error);
          toast.error("Error loading project for editing");
        }
        
        setLoading(false);
      };
      
      loadProject();
    }
  }, [id, navigate, form]);

  // Handle form submission
  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Form submission data:", data);
      
      if (isEditMode && id) {
        // Format dates correctly for storage
        const formattedData = {
          ...data,
          startDate: format(new Date(data.startDate), "yyyy-MM-dd"),
          dueDate: format(new Date(data.dueDate), "yyyy-MM-dd"),
        };
        
        console.log("Updating project with ID:", id);
        console.log("Update data:", formattedData);
        
        const updated = updateProject(id, formattedData);
        
        if (updated) {
          console.log("Project updated successfully:", updated);
          toast.success("Project updated successfully");
          
          // Navigate back to project details after successful update
          setTimeout(() => {
            navigate(`/projects/${id}`);
          }, 500);
        } else {
          console.error("Failed to update project");
          toast.error("Failed to update project");
        }
      } else {
        // Create new project
        const formattedData = {
          ...data,
          startDate: format(new Date(data.startDate), "yyyy-MM-dd"),
          dueDate: format(new Date(data.dueDate), "yyyy-MM-dd"),
        };
        
        const newProject = addProject(formattedData);
        
        if (newProject) {
          console.log("Project created successfully:", newProject);
          toast.success("Project created successfully");
          
          setTimeout(() => {
            navigate("/projects");
          }, 500);
        } else {
          console.error("Failed to create project");
          toast.error("Failed to create project");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status options for the form
  const statusOptions = [
    { value: "Planning", label: "Planning" },
    { value: "In Progress", label: "In Progress" },
    { value: "On Hold", label: "On Hold" },
    { value: "Completed", label: "Completed" },
  ];

  return {
    form,
    isSubmitting,
    isEditMode,
    loading,
    statusOptions,
    initialProject,
    onSubmit,
    navigate
  };
};
