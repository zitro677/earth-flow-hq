
import React from "react";
import { Users } from "lucide-react";

interface TeamInfoSectionProps {
  teamSize: number;
}

const TeamInfoSection: React.FC<TeamInfoSectionProps> = ({ teamSize }) => {
  return (
    <div className="flex items-start gap-2">
      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div>
        <h3 className="font-medium">Team</h3>
        <p className="text-sm text-muted-foreground">
          {teamSize} team members assigned
        </p>
      </div>
    </div>
  );
};

export default TeamInfoSection;
