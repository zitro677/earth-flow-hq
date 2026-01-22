
import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateProject } from "../../hooks/projectOperations";

interface StatusSelectorProps {
  projectId: string;
  currentStatus: string;
  getStatusColor: (status: string) => string;
  onStatusChange?: (newStatus: string) => void;
}

const statusOptions = [
  { value: "Planning", label: "Planning" },
  { value: "In Progress", label: "In Progress" },
  { value: "On Hold", label: "On Hold" },
  { value: "Completed", label: "Completed" },
];

const StatusSelector: React.FC<StatusSelectorProps> = ({
  projectId,
  currentStatus,
  getStatusColor,
  onStatusChange,
}) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = (newStatus: string) => {
    // Don't do anything if status hasn't changed
    if (newStatus === status) {
      setOpen(false);
      return;
    }

    // Update the local state first for immediate UI feedback
    setStatus(newStatus);
    
    // Close the dropdown
    setOpen(false);
    
    // Try to update the project status in localStorage
    try {
      updateProject(projectId, { status: newStatus });
      
      // Notify the user
      toast.success(`Project status updated to ${newStatus}`);
      
      // Call the callback if provided
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
      
      // We don't revert the UI state because that might cause flickering
      // The next time the component loads, it will show the correct status from storage
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex items-center justify-between w-[200px]"
        >
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(status)}>
              {status}
            </Badge>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar estado..." />
          <CommandList>
            <CommandEmpty>Estado no encontrado.</CommandEmpty>
            <CommandGroup>
              {statusOptions.map((statusOption) => (
                <CommandItem
                  key={statusOption.value}
                  value={statusOption.value}
                  onSelect={() => handleStatusChange(statusOption.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      status === statusOption.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <Badge className={getStatusColor(statusOption.value)}>
                    {statusOption.label}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StatusSelector;
