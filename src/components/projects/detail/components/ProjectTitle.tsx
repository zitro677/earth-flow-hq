
import React from "react";
import { motion } from "framer-motion";
import StatusSelector from "./StatusSelector";

interface ProjectTitleProps {
  projectId: string;
  projectName: string;
  projectStatus: string;
  getStatusColor: (status: string) => string;
  className?: string;
  onStatusChange?: (newStatus: string) => void;
}

const ProjectTitle: React.FC<ProjectTitleProps> = ({
  projectId,
  projectName,
  projectStatus,
  getStatusColor,
  className = "",
  onStatusChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <h1 className="text-3xl font-bold">{projectName}</h1>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-muted-foreground">Proyecto {projectId.slice(0, 8)}</p>
        <StatusSelector 
          projectId={projectId}
          currentStatus={projectStatus} 
          getStatusColor={getStatusColor}
          onStatusChange={onStatusChange}
        />
      </div>
    </motion.div>
  );
};

export default ProjectTitle;
