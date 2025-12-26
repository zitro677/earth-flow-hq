
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSupabaseData = (lastUpdate: number) => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSupabaseData = async () => {
      setIsLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user?.id) {
          console.log("No authenticated user found");
          setIsLoading(false);
          return;
        }
        
        const userId = sessionData.session.user.id;

        // Load proposals from Supabase
        const fetchProposals = async () => {
          try {
            const { data, error } = await supabase
              .from('proposals')
              .select(`
                *,
                clients!proposals_client_id_fkey (
                  name,
                  email,
                  address,
                  phone
                )
              `)
              .eq('user_id', userId)
              .order('created_at', { ascending: false });
              
            if (error) {
              console.error("Error fetching proposals:", error);
              return [];
            }
            
            return data || [];
          } catch (error) {
            console.error("Unexpected error fetching proposals:", error);
            return [];
          }
        };

        // Load invoices from Supabase
        const fetchInvoices = async () => {
          try {
            const { data, error } = await supabase
              .from('invoices')
              .select(`
                *,
                clients!invoices_client_id_fkey (
                  name,
                  email
                )
              `)
              .eq('user_id', userId)
              .order('issue_date', { ascending: false });
              
            if (error) {
              console.error("Error fetching invoices:", error);
              return [];
            }
            
            return data || [];
          } catch (error) {
            console.error("Unexpected error fetching invoices:", error);
            return [];
          }
        };

        // Load clients from Supabase
        const fetchClients = async () => {
          try {
            const { data, error } = await supabase
              .from('clients')
              .select('*')
              .eq('user_id', userId)
              .order('name', { ascending: true });
              
            if (error) {
              console.error("Error fetching clients:", error);
              return [];
            }
            
            return data || [];
          } catch (error) {
            console.error("Unexpected error fetching clients:", error);
            return [];
          }
        };
        
        const [proposalsData, invoicesData, clientsData] = await Promise.all([
          fetchProposals(),
          fetchInvoices(),
          fetchClients()
        ]);
        
        setProposals(proposalsData);
        setInvoices(invoicesData);
        setClients(clientsData);
        
      } catch (error) {
        console.error("Error loading supabase data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSupabaseData();
  }, [lastUpdate]);

  return {
    proposals,
    invoices,
    clients,
    isLoading
  };
};
