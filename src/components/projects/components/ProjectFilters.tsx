
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ProjectFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="on hold">On Hold</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">More Filters</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuCheckboxItem checked>
              Show Client Name
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>
              Show Progress
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>
              Show Due Date
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem>
              Upcoming Deadlines Only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              High Budget Projects
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dueDate">Due Date</SelectItem>
          <SelectItem value="progress">Progress</SelectItem>
          <SelectItem value="budget">Budget</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectFilters;
