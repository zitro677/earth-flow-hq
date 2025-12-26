
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const getProjectColumns = (getStatusColor: (status: string) => string, onViewDetails: (id: string) => void) => [
  {
    accessorKey: "name",
    header: "Project Name",
  },
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      return <Badge className={getStatusColor(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
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
    header: "Due Date",
    cell: ({ row }: any) => {
      const dueDate = row.getValue("dueDate");
      // Format the date consistently for display
      return <span>{dueDate}</span>;
    },
  },
  {
    accessorKey: "budget",
    header: "Budget",
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }: any) => {
      const projectId = row.getValue("id");
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(projectId)}
        >
          View Details
        </Button>
      );
    },
  },
];
