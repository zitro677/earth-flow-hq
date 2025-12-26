
import { supabase } from "@/integrations/supabase/client";

/**
 * Finds a client by email for the specified user
 */
export const findClientByEmail = async (email: string, userId: string) => {
  const { data: existingClients, error } = await supabase
    .from('clients')
    .select('id, name, email, phone, address')
    .eq('email', email)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching existing clients:', error);
    throw error;
  }
  
  return existingClients && existingClients.length > 0 ? existingClients[0] : null;
};

/**
 * Updates an existing client with new information
 */
export const updateClient = async (clientId: string, clientData: { 
  name: string, 
  email: string, 
  phone?: string, 
  address: string 
}, userId: string) => {
  const { data: updatedClient, error } = await supabase
    .from('clients')
    .update({
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address
    })
    .eq('id', clientId)
    .eq('user_id', userId)
    .select('id, name, email, phone, address')
    .single();
    
  if (error) {
    console.error('Error updating client:', error);
    throw error;
  }
  
  return updatedClient;
};

/**
 * Creates a new client with the provided information
 */
export const createClient = async (clientData: { 
  name: string, 
  email: string, 
  phone?: string, 
  address: string 
}, userId: string) => {
  const { data: newClient, error } = await supabase
    .from('clients')
    .insert({
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address,
      user_id: userId
    })
    .select('id, name, email, phone, address')
    .single();
    
  if (error) {
    console.error('Error creating client:', error);
    throw error;
  }
  
  return newClient;
};

/**
 * Fetches client details by ID
 */
export const getClientById = async (clientId: string) => {
  const { data, error } = await supabase
    .from('clients')
    .select('name, email, phone, address')
    .eq('id', clientId)
    .single();
  
  if (error) {
    console.error('Error fetching client details:', error);
    throw error;
  }
  
  return data;
};
