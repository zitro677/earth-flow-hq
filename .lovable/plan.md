
# Plan: Asignar Rol de Administrador a tu Cuenta

## Situación Actual

Tu cuenta `zitro677.lo87@gmail.com` (ID: `967fca1b-c12d-478c-93fa-238148b364cc`) fue creada exitosamente. Sin embargo, necesitamos verificar y corregir el rol de administrador.

## Problema Identificado

El sistema tiene un trigger `handle_new_user` que debería asignar automáticamente:
- **admin** al primer usuario registrado
- **user** a los demás usuarios

Parece que el registro en la tabla `user_roles` no se creó correctamente o tiene un rol incorrecto.

## Solución

Ejecutaré una migración SQL para:

1. **Verificar si existe un registro** en `user_roles` para tu usuario
2. **Insertar o actualizar** el rol a `admin`
3. **Verificar el registro en `profiles`** y crearlo si no existe

### SQL a Ejecutar

```sql
-- Insertar rol de admin si no existe, o actualizar si existe
INSERT INTO public.user_roles (user_id, role)
VALUES ('967fca1b-c12d-478c-93fa-238148b364cc', 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin', updated_at = now();

-- Verificar/crear perfil si no existe
INSERT INTO public.profiles (user_id, email, full_name)
VALUES (
  '967fca1b-c12d-478c-93fa-238148b364cc',
  'zitro677.lo87@gmail.com',
  'zitro677'
)
ON CONFLICT (user_id) 
DO UPDATE SET email = 'zitro677.lo87@gmail.com', updated_at = now();
```

## Cambios en el Código

No se requieren cambios en el código. Solo necesitamos actualizar los datos en la base de datos.

## Resultado Esperado

- Tu cuenta será reconocida como **administrador**
- Tendrás acceso a la sección de **Gestión de Usuarios** en Configuración
- Podrás cambiar roles de otros usuarios

## Nota Técnica

La tabla `user_roles` tiene una restricción única en `user_id`, por lo que usaremos `ON CONFLICT` para manejar ambos casos (inserción o actualización).
