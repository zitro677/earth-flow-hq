
// Define supplier related types
export interface Supplier {
  id: string;
  user_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tax_id?: string | null;
  contact_person?: string | null;
  category?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Type for creating a new supplier
export interface NewSupplierData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  contact_person?: string;
  category?: string;
  notes?: string;
}

// Supplier categories
export const SUPPLIER_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'materiales', label: 'Materiales' },
  { value: 'blindaje', label: 'Blindaje' },
  { value: 'vidrios', label: 'Vidrios' },
  { value: 'acero', label: 'Acero' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'herramientas', label: 'Herramientas' },
] as const;
