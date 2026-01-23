
# Plan: Corregir Error de Cierre de Sesión

## Problema Identificado

Cuando intentas cerrar sesión, aparece el error "Error al cerrar sesión" porque:

1. **La sesión ya expiró en el servidor** pero el navegador aún tiene los datos guardados
2. Al llamar a `signOut()`, el servidor responde "Session not found" (sesión no encontrada)
3. El código actual trata esto como un error, cuando en realidad deberías simplemente ser redirigido a la página de login

## Solución

Modificar la función `signOut` para manejar el caso de sesión expirada como un cierre de sesión exitoso, en lugar de un error.

### Cambios en `src/components/auth/hooks/useAuthState.tsx`

```typescript
const signOut = async () => {
  try {
    console.log("Attempting to sign out...");
    setLoading(true);
    
    const { error } = await supabase.auth.signOut();
    
    // Si hay error pero es porque la sesión no existe,
    // tratarlo como éxito (el usuario ya no está autenticado)
    if (error && error.name !== 'AuthSessionMissingError') {
      console.error("Error in supabase.auth.signOut():", error);
      throw error;
    }
    
    console.log("Sign out successful");
    
    // Limpiar estado local
    setUser(null);
    setSession(null);
    setLoading(false);
    
    // Redirigir a página de login
    window.location.href = "/auth";
  } catch (error) {
    console.error("Error signing out:", error);
    
    // Incluso si hay error, limpiar estado local y redirigir
    setUser(null);
    setSession(null);
    setLoading(false);
    window.location.href = "/auth";
  }
};
```

### Cambios en `src/components/settings/SettingsPage.tsx`

Simplificar el manejo de errores ya que el signOut ahora siempre limpiará la sesión:

```typescript
const handleSignOut = async () => {
  await signOut();
  // No necesitamos toast aquí, el useAuthState ya maneja todo
};
```

### Cambios en `src/components/layout/hooks/useSidebar.tsx`

Igual, simplificar el handleSignOut:

```typescript
const handleSignOut = useCallback(async () => {
  toast.loading("Cerrando sesión...");
  await signOut();
  // La navegación se hace en signOut con window.location.href
}, [signOut]);
```

## Resumen de Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/auth/hooks/useAuthState.tsx` | Manejar `AuthSessionMissingError` como éxito y siempre limpiar estado local |
| `src/components/settings/SettingsPage.tsx` | Simplificar `handleSignOut` |
| `src/components/layout/hooks/useSidebar.tsx` | Simplificar `handleSignOut` |

## Resultado Esperado

- ✅ Cerrar sesión funcionará incluso si la sesión ya expiró
- ✅ No más mensajes de error "Error al cerrar sesión"
- ✅ El usuario siempre será redirigido a la página de login
- ✅ El estado local siempre se limpiará correctamente
