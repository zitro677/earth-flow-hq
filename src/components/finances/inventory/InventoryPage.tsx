
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { InventoryForm } from "./components/InventoryForm";
import { useInventory } from "./hooks/useInventory";
import { inventoryColumns } from "./components/InventoryColumns";

export const InventoryPage = () => {
  const {
    inventory,
    isDialogOpen,
    setIsDialogOpen,
    selectedItem,
    handleAddItem,
    handleEditItem,
    handleDeleteItem
  } = useInventory();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Inventory Management</h2>
          <p className="text-muted-foreground">
            Manage your equipment, tools, and machinery
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={inventoryColumns}
            data={inventory}
            searchColumns={["name", "category"]}
            searchPlaceholder="Search by name or category..."
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <InventoryForm
          selectedItem={selectedItem}
          onSubmit={(data) => {
            if (selectedItem) {
              handleEditItem(data);
            } else {
              handleAddItem(data);
            }
            setIsDialogOpen(false);
          }}
          onCancel={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </motion.div>
  );
};
