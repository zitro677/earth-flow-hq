
import React from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface TimelineSectionProps {
  startDate: string;
  dueDate: string;
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ 
  startDate, 
  dueDate 
}) => {
  return (
    <div className="flex items-start gap-2">
      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div>
        <h3 className="font-medium">Cronograma</h3>
        <p className="text-sm text-muted-foreground">
          {startDate && format(new Date(startDate), 'dd-MM-yyyy')} a {dueDate && format(new Date(dueDate), 'dd-MM-yyyy')}
        </p>
      </div>
    </div>
  );
};

export default TimelineSection;
