
import React from "react";
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
import { Button } from "@/components/ui/button";

interface ProposalFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const ProposalFilters: React.FC<ProposalFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div className="flex gap-2">
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Estados</SelectItem>
            <SelectItem value="approved">Aprobada</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="rejected">Rechazada</SelectItem>
            <SelectItem value="draft">Borrador</SelectItem>
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
              Mostrar Fecha de Vencimiento
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>
              Mostrar Monto
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem>
              Solo Este Mes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Solo Este Año
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Más Recientes Primero</SelectItem>
          <SelectItem value="oldest">Más Antiguas Primero</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProposalFilters;
