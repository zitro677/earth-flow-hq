
# Plan: Solucionar Problemas del Agente y Agregar Administradores

## Resumen de Problemas Detectados

| Problema | Causa Raíz |
|----------|------------|
| Micrófono no aparece en servidor propio | Las Edge Functions (`agent-voice`, `agent-chat`) solo existen en Lovable Cloud. Tu servidor solo tiene el frontend. |
| Chat no responsive en móvil | Los cambios responsive recientes pueden no estar desplegados en tu servidor |
| diana1984.78@gmail.com como admin | No tiene cuenta creada todavía |
| zitro677.lo87@gmail.com como admin | ✅ Ya está configurado como admin en la base de datos |

---

## Parte 1: Requisitos para Self-Hosting (Servidor Propio)

Para que el agente contable funcione en tu propio servidor, necesitas replicar la infraestructura de backend:

### Opción A: Conectar a un Supabase externo (Recomendado)
1. Crear proyecto en [Supabase.com](https://supabase.com)
2. Exportar el esquema de base de datos desde Lovable Cloud
3. Importar las Edge Functions manualmente:
   - `agent-chat` → requiere `LOVABLE_API_KEY` (NO funciona fuera de Lovable)
   - `agent-voice` → requiere `ELEVENLABS_API_KEY`
4. Configurar secretos en el panel de Supabase

### Opción B: Modificar el código para usar otro LLM
Modificar `agent-chat/index.ts` para usar directamente:
- OpenAI API (`OPENAI_API_KEY`)
- Google AI Studio (`GOOGLE_AI_API_KEY`)  
- O cualquier proveedor compatible con OpenAI API

**Nota importante**: La `LOVABLE_API_KEY` es exclusiva de Lovable Cloud y NO funcionará en servidores externos.

---

## Parte 2: Cambios de Código para Compatibilidad

### Archivo 1: `supabase/functions/agent-chat/index.ts`
**Cambio**: Agregar soporte para OpenAI API como alternativa

```text
// Estructura propuesta:
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

// Si hay OPENAI_API_KEY, usar OpenAI directamente
// Si hay LOVABLE_API_KEY, usar el gateway de Lovable AI
// Si no hay ninguno, retornar error descriptivo
```

### Archivo 2: `src/components/agent/AgentChatWidget.tsx`
**Cambio**: Mejorar manejo cuando las Edge Functions no están disponibles

```text
// Mostrar mensaje amigable si el backend no responde
// En lugar de error silencioso, mostrar:
// "El asistente de voz no está disponible en este servidor"
```

### Archivo 3: `src/components/agent/hooks/useAgentVoice.ts`
**Cambio**: Agregar fallback cuando agent-voice no está disponible

```text
// Intentar conectar al endpoint
// Si falla, deshabilitar el botón de voz con mensaje explicativo
// En lugar de fallar silenciosamente
```

---

## Parte 3: Asignar Rol de Administrador a diana1984.78@gmail.com

### Prerrequisito
Diana debe primero:
1. Ir a la página de login de la aplicación
2. Registrarse con su email `diana1984.78@gmail.com`
3. Iniciar sesión al menos una vez

### Una vez registrada
Ejecutar en la base de datos:

```sql
-- Buscar el user_id de Diana
SELECT u.id, u.email 
FROM auth.users u 
WHERE u.email = 'diana1984.78@gmail.com';

-- Actualizar su rol a admin (reemplazar 'diana-user-id' con el ID real)
UPDATE public.user_roles 
SET role = 'admin', updated_at = now() 
WHERE user_id = 'diana-user-id';
```

O bien, tú (zitro677.lo87@gmail.com) puedes hacerlo desde la sección **Configuración → Gestión de usuarios** una vez que Diana tenga cuenta.

---

## Parte 4: Verificar Cambios Responsive

El código responsive **ya está implementado** en `AgentChatWidget.tsx`:
- Móvil: `left-4 right-4 w-auto`
- Desktop: `right-6 w-96`

### Para que funcione en tu servidor
1. **Hacer git pull** de los últimos cambios
2. **Rebuild** del frontend con los nuevos archivos
3. **Redesplegar** en tu servidor

---

## Archivos a Modificar

| Archivo | Propósito |
|---------|-----------|
| `supabase/functions/agent-chat/index.ts` | Agregar soporte para OpenAI API como alternativa a Lovable AI |
| `src/components/agent/AgentChatWidget.tsx` | Mostrar mensaje cuando el backend no está disponible |
| `src/components/agent/hooks/useAgentVoice.ts` | Manejar graciosamente cuando agent-voice no responde |

---

## Decisión Requerida

Para proceder necesito saber:

**¿Quieres que modifique el código para que sea compatible con OpenAI API directamente?**

Esto te permitiría:
- Obtener una API key de OpenAI ($5-20 USD/mes típico)
- Configurarla como `OPENAI_API_KEY` en tu servidor
- Que el agente funcione sin depender de Lovable Cloud

Si prefieres seguir usando solo Lovable Cloud (preview/published), no necesitas estos cambios y el agente seguirá funcionando normalmente aquí.

---

## Estado Actual de Administradores

| Email | Estado | Rol |
|-------|--------|-----|
| zitro677.lo87@gmail.com | ✅ Cuenta activa | admin |
| diana1984.78@gmail.com | ⚠️ No ha creado cuenta | pendiente |
