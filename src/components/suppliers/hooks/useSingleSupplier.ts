
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Supplier } from "../types";

export const useSingleSupplier = (id: string | undefined) => {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: async (): Promise<Supplier | null> => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching supplier:", error);
        throw error;
      }

      return data as Supplier;
    },
    enabled: !!id,
  });
};
