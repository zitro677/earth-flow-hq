-- 1. Eliminar política vulnerable de UPDATE
DROP POLICY IF EXISTS "Users can update their own role" ON public.user_roles;

-- 2. Eliminar política INSERT demasiado permisiva
DROP POLICY IF EXISTS "System can insert roles" ON public.user_roles;

-- 3. Crear función SECURITY DEFINER para verificar rol admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- 4. Eliminar política SELECT actual antes de reemplazar
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;

-- 5. Nueva política: Solo admins pueden actualizar roles
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 6. Nueva política: Solo el trigger del sistema puede insertar (nuevos usuarios solo rol 'user')
CREATE POLICY "System trigger can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND role = 'user'
);

-- 7. Política para que admins puedan ver todos los roles, usuarios su propio rol
CREATE POLICY "Users and admins can view roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR public.is_admin(auth.uid())
);