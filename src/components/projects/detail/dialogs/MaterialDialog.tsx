
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newMaterial: {
    name: string;
    quantity: string;
    cost: string;
    status: string;
  };
  setNewMaterial: React.Dispatch<React.SetStateAction<{
    name: string;
    quantity: string;
    cost: string;
    status: string;
  }>>;
  handleAddMaterial: () => void;
}

const MaterialDialog: React.FC<MaterialDialogProps> = ({
  open,
  onOpenChange,
  newMaterial,
  setNewMaterial,
  handleAddMaterial
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Material</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="material-name">Nombre del Material</Label>
            <Input 
              id="material-name" 
              value={newMaterial.name} 
              onChange={e => setNewMaterial({...newMaterial, name: e.target.value})}
              placeholder="Ingresa el nombre del material" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="material-quantity">Cantidad</Label>
            <Input 
              id="material-quantity" 
              value={newMaterial.quantity} 
              onChange={e => setNewMaterial({...newMaterial, quantity: e.target.value})}
              placeholder="Ej: 5 unidades, 10 m²" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="material-cost">Costo</Label>
            <Input 
              id="material-cost" 
              value={newMaterial.cost} 
              onChange={e => setNewMaterial({...newMaterial, cost: e.target.value})}
              placeholder="Ej: $500.000" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="material-status">Estado</Label>
            <Select 
              value={newMaterial.status} 
              onValueChange={value => setNewMaterial({...newMaterial, status: value})}
            >
              <SelectTrigger id="material-status">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente de Entrega">Pendiente de Entrega</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="En Espera">En Espera</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleAddMaterial} disabled={!newMaterial.name}>Agregar Material</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDialog;
