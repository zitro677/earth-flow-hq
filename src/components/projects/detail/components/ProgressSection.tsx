
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { CirclePercent } from "lucide-react";

interface ProgressSectionProps {
  progress: number;
  onUpdateProgress: (newProgress: number) => Promise<boolean>;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ 
  progress, 
  onUpdateProgress 
}) => {
  const [showProgressEdit, setShowProgressEdit] = useState(false);
  const [progressValue, setProgressValue] = useState(progress);
  const [isUpdating, setIsUpdating] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(progress);
  
  // Update local state when the prop changes
  useEffect(() => {
    setProgressValue(progress);
    setDisplayProgress(progress);
    console.log("Progress prop updated:", progress);
  }, [progress]);

  const saveProgress = async () => {
    setIsUpdating(true);
    
    try {
      console.log("Saving progress:", progressValue);
      const success = await onUpdateProgress(progressValue);
      
      if (success) {
        console.log("Progress saved successfully");
        // Update the display progress right away for immediate feedback
        setDisplayProgress(progressValue);
        setShowProgressEdit(false);
      } else {
        console.error("Failed to save progress");
        // Reset to original value if update failed
        setProgressValue(progress);
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      setProgressValue(progress);
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelEdit = () => {
    setProgressValue(progress);
    setShowProgressEdit(false);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium flex items-center gap-2">
          <CirclePercent className="h-5 w-5 text-primary" />
          Progress
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowProgressEdit(!showProgressEdit)}
          disabled={isUpdating}
        >
          {showProgressEdit ? "Cancel" : "Edit Progress"}
        </Button>
      </div>
      
      {showProgressEdit ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Slider
              value={[progressValue]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setProgressValue(value[0])}
              className="flex-1"
              disabled={isUpdating}
            />
            <span className="text-sm font-medium min-w-10 text-right">
              {progressValue}%
            </span>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={saveProgress} 
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Progress"}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={cancelEdit}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <Progress value={displayProgress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {displayProgress}% Complete
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressSection;
