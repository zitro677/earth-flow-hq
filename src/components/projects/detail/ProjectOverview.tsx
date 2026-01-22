
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useProjectActions } from "./hooks/useProjectActions";
import { updateProject } from "../hooks/projectOperations";

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

  const handleSaveBudget = async (budgetUsed: number, totalBudget: number) => {
    // Update project budget in Supabase
    const result = await updateProject(project.id, { 
      budget: totalBudget,
      actual_cost: budgetUsed 
    });
    
    if (result) {
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
