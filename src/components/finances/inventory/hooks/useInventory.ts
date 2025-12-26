
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useInventory = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load inventory from Supabase
  useEffect(() => {
    const loadInventory = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          setIsLoading(false);
          return;
        }

        const { data: inventoryData, error } = await supabase
          .from('inventory')
          .select('*')
          .eq('user_id', session.user.id)
          .order('name', { ascending: true });

        if (error) {
          console.error("Error fetching inventory:", error);
          toast.error("Failed to load inventory");
          return;
        }

        // Transform database inventory to match our interface
        const transformedInventory = (inventoryData || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category || 'tools',
          unit_cost: parseFloat(item.unit_cost?.toString() || '0'),
          quantity: item.quantity || 0,
          life_span: 5, // Default value, could be extracted from interval if needed
          depreciation_rate: 20, // Default value, could be calculated
          status: item.status || 'active',
        }));

        setInventory(transformedInventory);
      } catch (error) {
        console.error("Error loading inventory:", error);
        toast.error("Failed to load inventory");
      } finally {
        setIsLoading(false);
      }
    };

    loadInventory();
  }, []);

  const handleAddItem = async (data: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error("You must be logged in to add inventory items");
        return;
      }

      const { data: newItem, error } = await supabase
        .from('inventory')
        .insert({
          user_id: session.user.id,
          name: data.name,
          category: data.category,
          unit_cost: parseFloat(data.unit_cost?.toString() || '0'),
          quantity: parseInt(data.quantity?.toString() || '0', 10),
          status: data.status || 'active',
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding inventory item:", error);
        toast.error("Failed to add inventory item");
        return;
      }

      const transformedItem = {
        id: newItem.id,
        name: newItem.name,
        category: newItem.category,
        unit_cost: parseFloat(newItem.unit_cost?.toString() || '0'),
        quantity: newItem.quantity,
        life_span: parseInt(data.life_span?.toString() || '5', 10),
        depreciation_rate: parseFloat(data.depreciation_rate?.toString() || '20'),
        status: newItem.status,
      };
      
      setInventory([...inventory, transformedItem]);
      toast.success("Item added successfully");
    } catch (error) {
      console.error("Error adding inventory item:", error);
      toast.error("Failed to add inventory item");
    }
  };

  const handleEditItem = async (data: any) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .update({
          name: data.name,
          category: data.category,
          unit_cost: parseFloat(data.unit_cost.toString()),
          quantity: parseInt(data.quantity.toString(), 10),
          status: data.status,
        })
        .eq('id', selectedItem.id);

      if (error) {
        console.error("Error updating inventory item:", error);
        toast.error("Failed to update inventory item");
        return;
      }

      const updatedData = {
        ...data,
        unit_cost: parseFloat(data.unit_cost.toString()),
        quantity: parseInt(data.quantity.toString(), 10),
        life_span: parseInt(data.life_span?.toString() || '5', 10),
        depreciation_rate: parseFloat(data.depreciation_rate?.toString() || '20'),
      };
      
      setInventory(
        inventory.map((item) =>
          item.id === selectedItem.id ? { ...item, ...updatedData } : item
        )
      );
      setSelectedItem(null);
      toast.success("Item updated successfully");
    } catch (error) {
      console.error("Error updating inventory item:", error);
      toast.error("Failed to update inventory item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting inventory item:", error);
        toast.error("Failed to delete inventory item");
        return;
      }

      setInventory(inventory.filter((item) => item.id !== id));
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      toast.error("Failed to delete inventory item");
    }
  };

  // Add handlers to each inventory item
  const inventoryWithHandlers = inventory.map((item) => ({
    ...item,
    onEdit: (item: any) => {
      setSelectedItem(item);
      setIsDialogOpen(true);
    },
    onDelete: handleDeleteItem,
  }));

  return {
    inventory: inventoryWithHandlers,
    isDialogOpen,
    setIsDialogOpen,
    selectedItem,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    isLoading,
  };
};
