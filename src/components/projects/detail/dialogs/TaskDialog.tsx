
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
          <DialogTitle>Agregar Nueva Tarea</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-name">Nombre de la Tarea</Label>
            <Input 
              id="task-name" 
              value={newTask.name} 
              onChange={e => setNewTask({...newTask, name: e.target.value})}
              placeholder="Ingresa el nombre de la tarea" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-status">Estado</Label>
            <Select 
              value={newTask.status} 
              onValueChange={value => setNewTask({...newTask, status: value})}
            >
              <SelectTrigger id="task-status">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sin Iniciar">Sin Iniciar</SelectItem>
                <SelectItem value="En Progreso">En Progreso</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
                <SelectItem value="En Espera">En Espera</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-due-date">Fecha de Vencimiento</Label>
            <Input 
              id="task-due-date" 
              type="date" 
              value={newTask.dueDate} 
              onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-assignee">Asignado a</Label>
            <Input 
              id="task-assignee" 
              value={newTask.assignee} 
              onChange={e => setNewTask({...newTask, assignee: e.target.value})}
              placeholder="Nombre del asignado" 
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleAddTask} disabled={!newTask.name}>Agregar Tarea</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
