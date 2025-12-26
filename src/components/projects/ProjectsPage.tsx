
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataTable } from "../ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import AnimatedPage from "../shared/AnimatedPage";
import ProjectStatistics from "./components/ProjectStatistics";
import ProjectFilters from "./components/ProjectFilters";
import { useProjects } from "./hooks/useProjects";
import { getProjectColumns } from "./components/projectColumns";

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    getStatusColor,
    sortedProjects,
  } = useProjects();

  const columns = getProjectColumns(getStatusColor, (id) => navigate(`/projects/${id}`));

  return (
    <AnimatedPage>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Proyectos</h1>
            <p className="text-muted-foreground mt-1">
              Administra y da seguimiento a todos tus proyectos de paisajismo
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 md:mt-0"
          >
            <Button
              onClick={() => navigate("/projects/new")}
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" /> Nuevo Proyecto
            </Button>
          </motion.div>
        </div>

        <ProjectStatistics
          projects={projects}
          getStatusColor={getStatusColor}
        />

        <ProjectFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <Card className="card-shadow">
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={sortedProjects}
              searchColumn="name"
              searchPlaceholder="Buscar proyectos..."
            />
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default ProjectsPage;
