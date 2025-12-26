
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
          <DialogTitle>Add New Material</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="material-name">Material Name</Label>
            <Input 
              id="material-name" 
              value={newMaterial.name} 
              onChange={e => setNewMaterial({...newMaterial, name: e.target.value})}
              placeholder="Enter material name" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="material-quantity">Quantity</Label>
            <Input 
              id="material-quantity" 
              value={newMaterial.quantity} 
              onChange={e => setNewMaterial({...newMaterial, quantity: e.target.value})}
              placeholder="e.g., 5 units, 10 sq ft" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="material-cost">Cost</Label>
            <Input 
              id="material-cost" 
              value={newMaterial.cost} 
              onChange={e => setNewMaterial({...newMaterial, cost: e.target.value})}
              placeholder="e.g., $500" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="material-status">Status</Label>
            <Select 
              value={newMaterial.status} 
              onValueChange={value => setNewMaterial({...newMaterial, status: value})}
            >
              <SelectTrigger id="material-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending Delivery">Pending Delivery</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAddMaterial} disabled={!newMaterial.name}>Add Material</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDialog;
