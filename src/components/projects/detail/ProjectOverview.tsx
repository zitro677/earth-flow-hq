
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useProjectActions } from "./hooks/useProjectActions";

// Import our new components
import TimelineSection from "./components/TimelineSection";
import HoursSection from "./components/HoursSection";
import BudgetSection from "./components/BudgetSection";
import TeamInfoSection from "./components/TeamInfoSection";
import ProgressSection from "./components/ProgressSection";
import ProjectDescription from "./components/ProjectDescription";

interface ProjectOverviewProps {
  project: any;
  extraData: any;
  teamSize: number;
  saveExtraData: (data: any) => void;
  onProjectUpdate?: () => void; // Optional callback for project updates
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  extraData,
  teamSize,
  saveExtraData,
  onProjectUpdate
}) => {
  const { handleUpdateProgress } = useProjectActions(project.id, project.name);

  const handleSaveHours = (hoursLogged: number, estimatedHours: number) => {
    const updatedExtraData = {
      ...extraData,
      hoursLogged: hoursLogged,
      estimatedHours: estimatedHours
    };
    saveExtraData(updatedExtraData);
  };

  const handleSaveBudget = (budgetUsed: number, totalBudget: number) => {
    // Update project budget
    const updatedProject = {
      ...project,
      budget: totalBudget
    };
    
    // Save to localStorage
    const projectsJson = localStorage.getItem("landscape_projects");
    if (projectsJson) {
      const projects = JSON.parse(projectsJson);
      const projectIndex = projects.findIndex((p: any) => p.id === project.id);
      if (projectIndex !== -1) {
        projects[projectIndex] = {
          ...projects[projectIndex],
          budget: totalBudget
        };
        localStorage.setItem("landscape_projects", JSON.stringify(projects));
      }
    }
    
    // Update extra data
    const updatedExtraData = {
      ...extraData,
      totalCost: budgetUsed
    };
    saveExtraData(updatedExtraData);
    
    // Notify parent component of update if callback exists
    if (onProjectUpdate) {
      onProjectUpdate();
    }
  };

  const handleProgressUpdate = async (newProgress: number) => {
    console.log("Handling progress update in ProjectOverview:", newProgress);
    const success = await handleUpdateProgress(newProgress);
    
    // If progress was updated successfully and callback exists
    if (success && onProjectUpdate) {
      console.log("Progress updated successfully, calling onProjectUpdate");
      onProjectUpdate();
    }
    
    return success;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="col-span-full lg:col-span-2"
    >
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>
            Client: {project.client}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectDescription description={extraData.description} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mt-6">
            <TimelineSection 
              startDate={project.startDate} 
              dueDate={project.dueDate} 
            />

            <HoursSection 
              hoursLogged={extraData.hoursLogged || 0} 
              estimatedHours={extraData.estimatedHours || 0}
              onSaveHours={handleSaveHours}
            />

            <BudgetSection 
              budgetUsed={extraData.totalCost || 0} 
              totalBudget={project.budget || 0}
              onSaveBudget={handleSaveBudget}
            />

            <TeamInfoSection teamSize={teamSize} />
          </div>

          <ProgressSection 
            progress={project.progress || 0} 
            onUpdateProgress={handleProgressUpdate} 
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectOverview;
