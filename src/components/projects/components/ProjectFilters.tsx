
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
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Estados</SelectItem>
            <SelectItem value="completed">Completado</SelectItem>
            <SelectItem value="in progress">En Progreso</SelectItem>
            <SelectItem value="planning">Planificación</SelectItem>
            <SelectItem value="on hold">En Espera</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Más Filtros</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuCheckboxItem checked>
              Mostrar Nombre del Cliente
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>
              Mostrar Progreso
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>
              Mostrar Fecha de Entrega
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem>
              Solo Próximas Fechas de Entrega
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Proyectos de Alto Presupuesto
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dueDate">Fecha de Entrega</SelectItem>
          <SelectItem value="progress">Progreso</SelectItem>
          <SelectItem value="budget">Presupuesto</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectFilters;
