
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ProjectFormHeaderProps {
  isEditMode: boolean;
  navigateBack: () => void;
}

const ProjectFormHeader: React.FC<ProjectFormHeaderProps> = ({ 
  isEditMode, 
  navigateBack 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={navigateBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Project" : "Create New Project"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode 
              ? "Update your landscape project details below"
              : "Fill out the form below to create a new landscape project"}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectFormHeader;
