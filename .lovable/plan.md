
# Plan: Corregir Vulnerabilidades de Seguridad en `user_roles`

## Vulnerabilidades Identificadas

### 1. Política RLS Permite Escalación de Privilegios (CRÍTICA)
La política `"Users can update their own role"` permite a cualquier usuario autenticado cambiar su propio rol de `user` a `admin`:

```sql
-- POLÍTICA ACTUAL (VULNERABLE)
cmd: UPDATE
policyname: Users can update their own role
qual: (auth.uid() = user_id)
```

**Impacto**: Un usuario malicioso puede ejecutar:
```javascript
await supabase.from('user_roles').update({ role: 'admin' }).eq('user_id', myId)
```

### 2. Política INSERT Demasiado Permisiva
```sql
cmd: INSERT
policyname: System can insert roles
with_check: true  -- Permite a CUALQUIERA insertar roles
```

### 3. Verificación de Admin Solo en Cliente
El código en `useRoleManagement.tsx` verifica `if (userRole !== 'admin')` pero esto es **solo validación del lado del cliente**, fácilmente evitable.

### 4. Emails Hardcodeados para Admin
```typescript
if (user?.email === 'greenplanetlandscaping01@gmail.com') {
  const adminSuccess = await ensureAdminRole(userId);
}
```
Esto es una práctica de seguridad incorrecta.

---

## Solución Propuesta

### Paso 1: Actualizar Políticas RLS en Base de Datos

**Migración SQL a ejecutar:**

```sql
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

-- 4. Nueva política: Solo admins pueden actualizar roles
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 5. Nueva política: Solo el trigger del sistema puede insertar
-- (via handle_new_user trigger que ya existe)
CREATE POLICY "System trigger can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  -- Solo permite insertar el rol del propio usuario (para el trigger)
  auth.uid() = user_id 
  AND role = 'user'  -- Nuevos usuarios solo pueden ser 'user'
);

-- 6. Política para que admins puedan ver todos los roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR public.is_admin(auth.uid())
);

-- 7. Eliminar política SELECT actual y reemplazar
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
```

### Paso 2: Actualizar Código Frontend

**Archivo: `src/components/auth/hooks/useRoleManagement.tsx`**

Eliminar:
- Verificaciones de email hardcodeadas (líneas 17-35)
- Función `ensureAdminRole` (líneas 59-88) - No debe ser posible desde el cliente

La función `updateUserRole` debe mantenerse pero ahora fallará correctamente si el usuario no es admin (la BD rechazará la operación).

```typescript
// ELIMINAR estas líneas (17-35):
if (user?.email === 'greenplanetlandscaping01@gmail.com') {
  // ...
}
if (user?.email === 'zitro677.lo87@gmail.com') {
  // ...
}

// ELIMINAR función ensureAdminRole completa (59-88)
```

---

## Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| **Base de datos** | Migración SQL para actualizar políticas RLS |
| `src/components/auth/hooks/useRoleManagement.tsx` | Eliminar código hardcodeado de emails y función ensureAdminRole |

---

## Resultado de Seguridad

| Antes | Después |
|-------|---------|
| Cualquier usuario puede auto-promoverse a admin | Solo admins pueden cambiar roles |
| Emails hardcodeados en código | Roles gestionados solo via BD |
| Validación solo en cliente | Validación en servidor (RLS) |
| INSERT con `true` | INSERT restringido a rol 'user' |

---

## Configuración Inicial de Admins

Para asignar el primer admin de forma segura, se debe hacer directamente en la base de datos:

```sql
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = 'uuid-del-usuario-a-promover';
```

Esto solo puede hacerse por alguien con acceso directo a la base de datos.
