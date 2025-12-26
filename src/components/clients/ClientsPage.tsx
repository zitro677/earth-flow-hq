import React from "react";
import { useNavigate } from "react-router-dom";
import { useClientsList } from "./hooks/useClientsList";
import { useClientMutations } from "./hooks/useClientMutations";
import AnimatedPage from "../shared/AnimatedPage";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clients, isLoading, error, refetch } = useClientsList();
  const { deleteClient } = useClientMutations();

  // Log debug information
  React.useEffect(() => {
    console.log("ClientsPage - Auth state:", user ? "Authenticated" : "Not authenticated");
    console.log("ClientsPage - isLoading:", isLoading);
    console.log("ClientsPage - clients count:", clients?.length || 0);
    console.log("ClientsPage - error:", error);
    
    if (error) {
      toast.error("Error al cargar los datos de clientes");
      console.error("Error loading clients:", error);
    }

    // Attempt to refetch if we have a user but no clients data
    if (user && !isLoading && !clients && !error) {
      console.log("ClientsPage - Attempting to refetch clients data");
      refetch();
    }
  }, [user, clients, isLoading, error, refetch]);

  return (
    <AnimatedPage>
      <div className="page-container">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">Administra tus clientes</p>
          </div>
          <Button onClick={() => navigate("/clients/new")} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" /> Agregar Nuevo Cliente
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="shadow-sm border-red-200 bg-red-50">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2 text-red-600">Error al cargar clientes</h3>
                <p className="text-muted-foreground mb-4">
                  Hubo un problema al recuperar los datos de clientes
                </p>
                <Button onClick={() => refetch()} className="flex items-center gap-1">
                  Intentar de Nuevo
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : clients && clients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <Card key={client.id} className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle>{client.name}</CardTitle>
                  <CardDescription>{client.email}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  {client.address && (
                    <p className="whitespace-pre-wrap">{client.address}</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Acciones
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem onClick={() => navigate(`/clients/edit/${client.id}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteClient(client.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-dashed border-2 border-gray-200">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Aún no hay clientes</h3>
                <p className="text-muted-foreground mb-4">
                  Agrega tu primer cliente para comenzar con la facturación
                </p>
                <Button onClick={() => navigate("/clients/new")} className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> Agregar Nuevo Cliente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AnimatedPage>
  );
};

export default ClientsPage;
