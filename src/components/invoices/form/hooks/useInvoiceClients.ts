
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../formSchema";

export const useInvoiceClients = (form: UseFormReturn<z.infer<typeof formSchema>>) => {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<boolean>(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching clients...");
        
        const { data, error } = await supabase
          .from("clients")
          .select("id, name, email, address");

        if (error) {
          console.error("Error fetching clients:", error);
          
          // Check if it's an authentication error
          if (error.code === "PGRST301" || error.message.includes("JWT")) {
            setAuthError(true);
          }
          
          toast.error("Error loading clients");
          return;
        }

        console.log("Clients loaded:", data);
        setClients(data || []);
      } catch (err) {
        console.error("Exception fetching clients:", err);
        toast.error("Failed to load clients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleClientChange = async (clientId: string) => {
    try {
      console.log("Client selected:", clientId);
      form.setValue("client_id", clientId, { shouldValidate: true });
      
      const selectedClient = clients.find(client => client.id === clientId);
      
      if (selectedClient) {
        console.log("Client details:", selectedClient);
        form.setValue("client", selectedClient.name, { shouldValidate: true });
        form.setValue("email", selectedClient.email || "", { shouldValidate: true });
        form.setValue("address", selectedClient.address || "", { shouldValidate: true });
      } else {
        const { data, error } = await supabase
          .from("clients")
          .select("name, email, address")
          .eq("id", clientId)
          .single();

        if (error) {
          console.error("Error fetching client details:", error);
          toast.error("Error loading client details");
          return;
        }

        if (data) {
          console.log("Client details from DB:", data);
          form.setValue("client", data.name, { shouldValidate: true });
          form.setValue("email", data.email || "", { shouldValidate: true });
          form.setValue("address", data.address || "", { shouldValidate: true });
        }
      }
    } catch (err) {
      console.error("Error in handleClientChange:", err);
      toast.error("Failed to load client details");
    }
  };

  return { clients, isLoading, handleClientChange, authError };
};
