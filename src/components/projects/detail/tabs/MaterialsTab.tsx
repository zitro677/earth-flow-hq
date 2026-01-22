
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface MaterialsTabProps {
  materials: any[];
  getStatusColor: (status: string) => string;
  onAddMaterialClick: () => void;
  projectId: string;
  saveExtraData: (data: any) => void;
  extraData: any;
}

const MaterialsTab: React.FC<MaterialsTabProps> = ({ 
  materials, 
  getStatusColor, 
  onAddMaterialClick,
  projectId,
  saveExtraData,
  extraData
}) => {
  const { toast } = useToast();

  const handleStatusChange = (index: number, newStatus: string) => {
    console.log(`Updating material at index ${index} to status: ${newStatus}`);
    
    // Create a copy of materials
    const updatedMaterials = [...materials];
    
    // Update the status of the material at the given index
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      status: newStatus
    };
    
    console.log("Updated materials array:", updatedMaterials);
    
    // Create updated extraData
    const updatedExtraData = {
      ...extraData,
      materials: updatedMaterials
    };
    
    console.log("Saving updated extraData:", updatedExtraData);
    
    // Save to localStorage
    saveExtraData(updatedExtraData);
    
    // Show success toast
    toast({
      title: "Material Actualizado",
      description: `El estado del material se actualizó a "${newStatus}".`,
    });
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle>Materiales</CardTitle>
        <Button size="sm" className="gap-1" onClick={onAddMaterialClick}>
          <Plus className="h-4 w-4" />
          <span>Agregar Material</span>
        </Button>
      </CardHeader>
      <CardContent>
        {materials && materials.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[160px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material: any, index: number) => (
                <TableRow key={material.id || index} className="hover-scale">
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.quantity}</TableCell>
                  <TableCell>{material.cost}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(material.status)}>
                      {material.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={material.status}
                      onValueChange={(value) => handleStatusChange(index, value)}
                    >
                      <SelectTrigger className="h-8 w-[160px]">
                        <Edit2 className="h-3.5 w-3.5 mr-1" />
                        <span>Cambiar Estado</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente de Entrega">Pendiente de Entrega</SelectItem>
                        <SelectItem value="Entregado">Entregado</SelectItem>
                        <SelectItem value="En Espera">En Espera</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center py-4">No hay materiales agregados aún</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialsTab;
