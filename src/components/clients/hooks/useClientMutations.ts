
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NewClientData } from "../types";

// Client mutations (create, update, delete)
export const useClientMutations = () => {
  const queryClient = useQueryClient();
  
  // Create a new client
  const useCreateClient = () => {
    return useMutation({
      mutationFn: async (client: NewClientData) => {
        console.log("Creating client with data:", client);
        
        // Get the user ID from the auth state
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw new Error("Authentication error");
        }
        
        if (!session?.user) {
          console.error("No authenticated user found");
          throw new Error("User is not authenticated");
        }

        console.log("Authenticated user ID:", session.user.id);

        const clientData = {
          name: client.name,
          email: client.email || null,
          phone: client.phone || null,
          address: client.address || null,
          user_id: session.user.id
        };

        console.log("Inserting client data:", clientData);

        const { data, error } = await supabase
          .from("clients")
          .insert(clientData)
          .select()
          .single();

        if (error) {
          console.error("Error creating client:", error);
          throw error;
        }

        console.log("Client created successfully:", data);
        return data;
      },
      onSuccess: (data) => {
        console.log("Client creation mutation succeeded:", data);
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        toast.success("Client created successfully");
      },
      onError: (error: any) => {
        console.error("Client creation mutation failed:", error);
        toast.error(error.message || "Failed to create client");
      },
    });
  };

  // Update a client
  const useUpdateClient = () => {
    return useMutation({
      mutationFn: async ({ id, ...clientData }: { id: string } & NewClientData) => {
        console.log("Updating client:", id, "with data:", clientData);
        
        const updateData = {
          name: clientData.name,
          email: clientData.email || null,
          phone: clientData.phone || null,
          address: clientData.address || null,
        };

        const { data, error } = await supabase
          .from("clients")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("Error updating client:", error);
          throw error;
        }

        console.log("Client updated successfully:", data);
        return data;
      },
      onSuccess: (data) => {
        console.log("Client update mutation succeeded:", data);
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        toast.success("Client updated successfully");
      },
      onError: (error: any) => {
        console.error("Client update mutation failed:", error);
        toast.error(error.message || "Failed to update client");
      },
    });
  };

  // Delete a client
  const deleteClient = async (id: string) => {
    try {
      console.log("Deleting client:", id);
      
      // Check if client is used in invoices
      const { data: invoices, error: invoiceError } = await supabase
        .from("invoices")
        .select("id")
        .eq("client_id", id);

      if (invoiceError) {
        console.error("Error checking invoices:", invoiceError);
        throw invoiceError;
      }

      if (invoices && invoices.length > 0) {
        console.log("Client has associated invoices, cannot delete");
        toast.error("Cannot delete client that has associated invoices");
        return;
      }

      // Delete the client
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting client:", error);
        throw error;
      }

      console.log("Client deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client deleted successfully");
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast.error(error.message || "Failed to delete client");
    }
  };

  return {
    useCreateClient,
    useUpdateClient,
    deleteClient
  };
};
