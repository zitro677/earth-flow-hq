
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const getProjectColumns = (getStatusColor: (status: string) => string, onViewDetails: (id: string) => void) => [
  {
    accessorKey: "name",
    header: "Nombre del Proyecto",
  },
  {
    accessorKey: "client",
    header: "Cliente",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      return <Badge className={getStatusColor(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "progress",
    header: "Progreso",
    cell: ({ row }: any) => {
      const progress = row.getValue("progress");
      return (
        <div className="w-full max-w-[100px]">
          <Progress value={progress} className="h-2" />
          <span className="text-xs text-muted-foreground">{progress}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Fecha de Entrega",
    cell: ({ row }: any) => {
      const dueDate = row.getValue("dueDate");
      // Format the date consistently for display
      return <span>{dueDate}</span>;
    },
  },
  {
    accessorKey: "budget",
    header: "Presupuesto",
  },
  {
    accessorKey: "id",
    header: "Acciones",
    cell: ({ row }: any) => {
      const projectId = row.getValue("id");
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(projectId)}
        >
          Ver Detalles
        </Button>
      );
    },
  },
];
