
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Share, Download, Edit } from "lucide-react";

interface ProjectActionsProps {
  onShare: () => void;
  onExport: () => void;
  onEdit: () => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
  onShare,
  onExport,
  onEdit,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mt-4 md:mt-0 flex flex-wrap gap-2"
    >
      <Button variant="outline" size="sm" className="gap-1" onClick={onShare}>
        <Share className="h-4 w-4" />
        <span>Share</span>
      </Button>
      <Button variant="outline" size="sm" className="gap-1" onClick={onExport}>
        <Download className="h-4 w-4" />
        <span>Export</span>
      </Button>
      <Button size="sm" className="gap-1" onClick={onEdit}>
        <Edit className="h-4 w-4" />
        <span>Edit Project</span>
      </Button>
    </motion.div>
  );
};

export default ProjectActions;
