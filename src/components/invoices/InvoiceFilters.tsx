
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortOrder?: string;
  setSortOrder?: (value: string) => void;
  sortBy?: string;
  setSortBy?: (value: string) => void;
  direction?: string;
  setDirection?: (value: string) => void;
}

const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
  sortBy,
  setSortBy,
  direction,
  setDirection,
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="py-4 flex flex-wrap gap-4 items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Estado</label>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="paid">Pagada</SelectItem>
              <SelectItem value="overdue">Vencida</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {setSortOrder && (
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Orden</label>
            <Select
              value={sortOrder || "newest"}
              onValueChange={setSortOrder}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ordenar por fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más Recientes Primero</SelectItem>
                <SelectItem value="oldest">Más Antiguas Primero</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {setSortBy && (
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Ordenar Por</label>
            <Select
              value={sortBy || "date"}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Fecha</SelectItem>
                <SelectItem value="amount">Monto</SelectItem>
                <SelectItem value="client">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {setDirection && (
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <Select
              value={direction || "desc"}
              onValueChange={setDirection}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Dirección" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascendente</SelectItem>
                <SelectItem value="desc">Descendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceFilters;
