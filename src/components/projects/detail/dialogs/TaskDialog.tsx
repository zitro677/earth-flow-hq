
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTask: {
    name: string;
    status: string;
    dueDate: string;
    assignee: string;
  };
  setNewTask: React.Dispatch<React.SetStateAction<{
    name: string;
    status: string;
    dueDate: string;
    assignee: string;
  }>>;
  handleAddTask: () => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onOpenChange,
  newTask,
  setNewTask,
  handleAddTask
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-name">Task Name</Label>
            <Input 
              id="task-name" 
              value={newTask.name} 
              onChange={e => setNewTask({...newTask, name: e.target.value})}
              placeholder="Enter task name" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-status">Status</Label>
            <Select 
              value={newTask.status} 
              onValueChange={value => setNewTask({...newTask, status: value})}
            >
              <SelectTrigger id="task-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-due-date">Due Date</Label>
            <Input 
              id="task-due-date" 
              type="date" 
              value={newTask.dueDate} 
              onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-assignee">Assignee</Label>
            <Input 
              id="task-assignee" 
              value={newTask.assignee} 
              onChange={e => setNewTask({...newTask, assignee: e.target.value})}
              placeholder="Assignee name" 
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAddTask} disabled={!newTask.name}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
