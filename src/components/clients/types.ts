
// Define client related types
export interface Client {
  id: string;
  name: string;
  email?: string;
  address?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// Type for creating a new client
export interface NewClientData {
  name: string; // Name is required
  email?: string;
  address?: string;
  phone?: string;
}
