
import React from "react";

interface ProjectDescriptionProps {
  description: string;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ description }) => {
  return (
    <p className="text-muted-foreground mb-4">
      {description}
    </p>
  );
};

export default ProjectDescription;
