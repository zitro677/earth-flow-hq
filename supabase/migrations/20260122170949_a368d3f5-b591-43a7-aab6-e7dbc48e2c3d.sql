-- Add Colombian tax calculation columns to expenses table
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS valor_bruto numeric DEFAULT 0;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS iva numeric DEFAULT 0;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS rete_fuente numeric DEFAULT 0;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS rete_iva numeric DEFAULT 0;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS rete_ica numeric DEFAULT 0;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS neto_pagar numeric DEFAULT 0;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS proveedor_responsable_iva boolean DEFAULT true;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS tipo_retencion text DEFAULT 'servicios';