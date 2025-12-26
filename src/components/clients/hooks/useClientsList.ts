
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Client } from "../types";

// Fetch all clients
export const useClientsList = () => {
  const { 
    data: clients = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        console.log("Fetching clients list...");
        
        // Get the current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }
        
        if (!session?.user) {
          console.error("No authenticated user found");
          throw new Error("No authenticated user");
        }

        console.log("Fetching clients for user:", session.user.id);

        // Simple direct query to avoid any potential recursion
        const { data, error } = await supabase
          .from("clients")
          .select("id, name, email, phone, address, created_at, updated_at")
          .eq("user_id", session.user.id)
          .order("name");

        if (error) {
          console.error("Error fetching clients:", error);
          throw error;
        }

        console.log("Clients fetched successfully:", data?.length || 0, "clients");
        return data as Client[];
      } catch (err: any) {
        console.error("Client fetch error:", err);
        toast.error(err.message || "Failed to load clients");
        throw err;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    clients: clients || [],
    isLoading,
    error,
    refetch,
  };
};
