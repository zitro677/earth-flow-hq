
# Plan: Corregir el Chatbot del Agente Contable

## Resumen del Problema

El chatbot tiene dos problemas principales:
1. **Respuestas en JSON crudo** - Muestra los datos directamente en formato técnico en lugar de texto natural para el usuario
2. **Datos incorrectos** - El filtro de estados no funciona porque hay discrepancia entre "pending" vs "Pending"

## Causa Raíz

El flujo actual es:
```text
Usuario pregunta → AI decide usar herramienta → Se ejecuta herramienta → 
Se envía JSON crudo al usuario ❌
```

El flujo correcto debe ser:
```text
Usuario pregunta → AI decide usar herramienta → Se ejecuta herramienta → 
AI recibe resultado → AI genera respuesta natural ✅
```

## Solución Propuesta

### Paso 1: Modificar el Edge Function para usar "Two-Turn Tool Calling"

En lugar de enviar el resultado JSON directamente al usuario, debemos:
1. Acumular los resultados de las herramientas
2. Hacer una segunda llamada al AI con los resultados
3. El AI genera una respuesta natural basada en los datos

### Paso 2: Corregir la comparación de estados (case-insensitive)

Cambiar las comparaciones de status para que sean insensibles a mayúsculas/minúsculas.

## Cambios Técnicos

### Archivo: `supabase/functions/agent-chat/index.ts`

**Cambio 1: Modificar la función `executeQueryDatabase` para comparaciones case-insensitive**

En el case "invoices" (líneas 234-259), cambiar:
```typescript
// ANTES
por_estado: {
  paid: invoices.filter(i => i.status === "paid").length,
  pending: invoices.filter(i => i.status === "pending").length,
  draft: invoices.filter(i => i.status === "draft").length
}

// DESPUÉS
por_estado: {
  paid: invoices.filter(i => i.status?.toLowerCase() === "paid").length,
  pending: invoices.filter(i => i.status?.toLowerCase() === "pending").length,
  draft: invoices.filter(i => i.status?.toLowerCase() === "draft").length
}
```

**Cambio 2: Refactorizar el manejo de streaming para "Two-Turn Tool Calling"**

En lugar de enviar el JSON directamente (línea 563), acumular los tool calls y hacer una segunda llamada al AI:

```typescript
// Cuando se detecta [DONE] y hay tool calls:
if (toolCalls.length > 0) {
  // 1. Ejecutar todas las herramientas
  const toolResults = [];
  for (const tc of toolCalls) {
    const args = JSON.parse(tc.function.arguments);
    let result;
    
    if (tc.function.name === "query_database") {
      result = await executeQueryDatabase(supabase, userId, args.query_type, args.filters);
    } else if (tc.function.name === "calculate_taxes") {
      result = executeCalculateTaxes(...);
    }
    
    toolResults.push({
      tool_call_id: tc.id,
      role: "tool",
      content: JSON.stringify(result)
    });
  }
  
  // 2. Segunda llamada al AI con los resultados
  const secondResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
        { role: "assistant", content: null, tool_calls: toolCalls },
        ...toolResults
      ],
      stream: true
    }),
  });
  
  // 3. Reenviar el stream de la segunda respuesta
  // (esto contendrá texto natural, no JSON)
}
```

## Flujo Final Esperado

Cuando el usuario pregunte "¿cuántas facturas están pendientes?":

1. El AI decidirá usar `query_database` con `query_type: "invoices"`
2. La herramienta consultará la BD y encontrará 4 facturas pendientes
3. El resultado se enviará de vuelta al AI
4. El AI responderá: "Tienes **4 facturas pendientes** por un total de **$15,800,000 COP** 📋"

## Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `supabase/functions/agent-chat/index.ts` | Implementar two-turn tool calling y corregir comparaciones case-insensitive |

## Resultado Esperado

- Las respuestas serán en texto natural, amigable para el usuario
- Los datos reflejarán correctamente el contenido de la base de datos
- El chatbot podrá contextualizar y explicar los datos, no solo mostrarlos
