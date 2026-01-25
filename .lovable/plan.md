
# Plan: Solución Definitiva para Error 403 en Google OAuth

## Diagnóstico Confirmado

El error 403 que ves **no proviene del código** de tu aplicación. La implementación en `useLoginForm.tsx` y `LoginPage.tsx` es correcta. El problema está en la configuración del proveedor Google OAuth en el backend de Lovable Cloud.

## Causa Raíz

Cuando usas credenciales gestionadas por Lovable Cloud, la configuración de Google OAuth debe estar habilitada en el dashboard de Lovable Cloud. El flujo OAuth falla en Google antes de regresar a tu app porque:

1. **Google Auth no está habilitado** en Lovable Cloud Auth Settings, o
2. **El dominio de preview no está autorizado** en la configuración interna

## Solución en 3 Pasos

### Paso 1: Verificar que Google Auth esté habilitado en Lovable Cloud

1. Abre el dashboard de Lovable Cloud haciendo clic en el botón "View Backend" que aparecerá después de aprobar este plan
2. Navega a **Users → Auth Settings → Sign In Methods**
3. Busca **Google** en la lista de proveedores
4. Asegúrate de que esté **habilitado** (toggle ON)
5. Si está deshabilitado, actívalo y guarda los cambios

### Paso 2: Agregar scope explícito de email (Cambio en código)

Para evitar problemas con ciertas configuraciones de Google Suite, agregaré el scope explícito de email al llamar a `signInWithOAuth`. Este cambio es una práctica recomendada por Supabase:

```typescript
// En useLoginForm.tsx, línea 46-55
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: currentOrigin,
    scopes: 'email profile',  // ← AGREGAR ESTA LÍNEA
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  }
});
```

### Paso 3: Probar después de los cambios

1. Cierra sesión si estás logueado
2. Intenta iniciar sesión con Google nuevamente
3. Si el error persiste, el problema está en la configuración interna de Lovable Cloud y deberás contactar soporte

## Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/auth/hooks/useLoginForm.tsx` | Agregar `scopes: 'email profile'` en las opciones de OAuth |

## Resultado Esperado

- El flujo de Google OAuth funcionará correctamente en Preview
- Los usuarios podrán iniciar sesión con su cuenta de Google
- Se solicitarán explícitamente los permisos de email y perfil

## Alternativa si persiste el problema

Si después de estos pasos el error 403 continúa, significa que hay un problema con las credenciales gestionadas de Lovable Cloud. En ese caso, las opciones son:

1. **Contactar soporte de Lovable** para verificar la configuración interna
2. **Usar credenciales propias de Google Cloud Console** (configurar manualmente Client ID y Secret)

## Nota Técnica

El error 403 "You do not have access to this page" de Google típicamente indica:
- La aplicación OAuth está en modo "Testing" y tu email no está en la lista de Test Users
- El Client ID no tiene el origen/redirect URI autorizado
- El proveedor OAuth está deshabilitado en el backend

Con las credenciales gestionadas de Lovable Cloud, estos aspectos deberían estar configurados automáticamente, pero es necesario que Google Auth esté habilitado en el dashboard.
