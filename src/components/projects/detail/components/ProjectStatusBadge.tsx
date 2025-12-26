
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ProjectStatusBadgeProps {
  status: string;
  getStatusColor: (status: string) => string;
  className?: string;
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ 
  status, 
  getStatusColor,
  className = "",
}) => {
  return (
    <Badge className={`${getStatusColor(status)} ${className}`}>
      {status}
    </Badge>
  );
};

export default ProjectStatusBadge;
