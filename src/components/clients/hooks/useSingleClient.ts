
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Client } from "../types";

// Fetch a single client
export const useSingleClient = () => {
  const fetchClient = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching client:", error);
        toast.error("Failed to load client details");
        throw error;
      }

      return data as Client;
    } catch (error) {
      console.error("Error in fetchClient:", error);
      throw error;
    }
  };

  return { fetchClient };
};
