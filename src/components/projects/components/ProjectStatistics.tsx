
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProjectStatisticsProps {
  projects: any[];
  getStatusColor: (status: string) => string;
}

const ProjectStatistics: React.FC<ProjectStatisticsProps> = ({
  projects,
  getStatusColor,
}) => {
  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;
  const inProgressProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;
  const planningProjects = projects.filter(
    (project) => project.status === "Planning"
  ).length;
  const onHoldProjects = projects.filter(
    (project) => project.status === "On Hold"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass-card rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Completed
          </h3>
          <Badge className={getStatusColor("Completed")}>
            {completedProjects}
          </Badge>
        </div>
        <Progress 
          value={(completedProjects / projects.length) * 100} 
          className="h-1 mt-2" 
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass-card rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            In Progress
          </h3>
          <Badge className={getStatusColor("In Progress")}>
            {inProgressProjects}
          </Badge>
        </div>
        <Progress 
          value={(inProgressProjects / projects.length) * 100} 
          className="h-1 mt-2" 
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="glass-card rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Planning
          </h3>
          <Badge className={getStatusColor("Planning")}>
            {planningProjects}
          </Badge>
        </div>
        <Progress 
          value={(planningProjects / projects.length) * 100} 
          className="h-1 mt-2" 
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="glass-card rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            On Hold
          </h3>
          <Badge className={getStatusColor("On Hold")}>
            {onHoldProjects}
          </Badge>
        </div>
        <Progress 
          value={(onHoldProjects / projects.length) * 100} 
          className="h-1 mt-2" 
        />
      </motion.div>
    </div>
  );
};

export default ProjectStatistics;
