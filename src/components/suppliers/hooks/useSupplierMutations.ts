
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NewSupplierData, Supplier } from "../types";

export const useSupplierMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createSupplier = useMutation({
    mutationFn: async (supplierData: NewSupplierData): Promise<Supplier> => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("suppliers")
        .insert({
          ...supplierData,
          user_id: session.session.user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating supplier:", error);
        throw error;
      }

      return data as Supplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast({
        title: "Proveedor creado",
        description: "El proveedor ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el proveedor. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const updateSupplier = useMutation({
    mutationFn: async ({ id, ...supplierData }: Partial<Supplier> & { id: string }): Promise<Supplier> => {
      const { data, error } = await supabase
        .from("suppliers")
        .update(supplierData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating supplier:", error);
        throw error;
      }

      return data as Supplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast({
        title: "Proveedor actualizado",
        description: "El proveedor ha sido actualizado exitosamente.",
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el proveedor. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteSupplier = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting supplier:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast({
        title: "Proveedor eliminado",
        description: "El proveedor ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el proveedor. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
};
