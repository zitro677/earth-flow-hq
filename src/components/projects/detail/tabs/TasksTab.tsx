
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface TasksTabProps {
  tasks: any[];
  getStatusColor: (status: string) => string;
  onAddTaskClick: () => void;
  projectId: string;
  saveExtraData: (data: any) => void;
  extraData: any;
}

const TasksTab: React.FC<TasksTabProps> = ({ 
  tasks, 
  getStatusColor, 
  onAddTaskClick, 
  projectId,
  saveExtraData,
  extraData
}) => {
  const { toast } = useToast();

  const handleStatusChange = (index: number, newStatus: string) => {
    console.log(`Updating task at index ${index} to status: ${newStatus}`);
    
    // Create a copy of tasks
    const updatedTasks = [...tasks];
    
    // Update the status of the task at the given index
    updatedTasks[index] = {
      ...updatedTasks[index],
      status: newStatus
    };
    
    console.log("Updated tasks array:", updatedTasks);
    
    // Create updated extraData
    const updatedExtraData = {
      ...extraData,
      tasks: updatedTasks
    };
    
    // Save to localStorage with detailed logging
    console.log("Saving updated extraData:", updatedExtraData);
    saveExtraData(updatedExtraData);
    
    // Show success toast
    toast({
      title: "Tarea Actualizada",
      description: `El estado de la tarea se actualizó a "${newStatus}".`,
    });
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle>Tareas del Proyecto</CardTitle>
        <Button size="sm" className="gap-1" onClick={onAddTaskClick}>
          <Plus className="h-4 w-4" />
          <span>Agregar Tarea</span>
        </Button>
      </CardHeader>
      <CardContent>
        {tasks && tasks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre de la Tarea</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Vencimiento</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead className="w-[140px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task: any, index: number) => (
                <TableRow key={task.id || index} className="hover-scale">
                  <TableCell>{task.name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={task.status}
                      onValueChange={(value) => handleStatusChange(index, value)}
                    >
                      <SelectTrigger className="h-8 w-[140px]">
                        <Edit2 className="h-3.5 w-3.5 mr-1" />
                        <span>Cambiar Estado</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sin Iniciar">Sin Iniciar</SelectItem>
                        <SelectItem value="En Progreso">En Progreso</SelectItem>
                        <SelectItem value="Completada">Completada</SelectItem>
                        <SelectItem value="En Espera">En Espera</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center py-4">No hay tareas agregadas aún</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksTab;
