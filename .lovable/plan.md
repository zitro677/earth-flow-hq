
# Plan: Corregir Problemas del Asistente Contable

## Problemas Identificados

### 1. Boton de Microfono No Aparece
**Causa**: El widget de chat (`AgentChatWidget.tsx`) ya tiene el boton de microfono implementado en las lineas 307-324. Sin embargo, el hook `useAgentVoice` esta siendo importado y el boton deberia aparecer. Necesito verificar si hay algun error de renderizado o si el componente se esta mostrando correctamente.

Revisando el codigo, el boton de microfono **si esta implementado** en el formulario (linea 307-324). El problema podria ser:
- Un error silencioso en el hook que causa que el componente no se renderice
- El widget no se muestra en la pagina actual

### 2. Ano Incorrecto (2024 vs 2026)
**Causa**: En el archivo `AgentChatWidget.tsx`, linea 108, el quick action dice:
```typescript
{ label: "Resumen financiero", message: "Dame un resumen financiero del ano actual" }
```

El problema NO esta en la logica del backend (que usa correctamente `new Date().getFullYear()` en linea 210), sino que probablemente el AI no esta interpretando "ano actual" correctamente. La solucion es ser mas explicito en el mensaje o agregar contexto al system prompt.

### 3. Respuesta Predefinida de Retenciones
**Causa**: En linea 111 del widget, el quick action esta configurado como:
```typescript
{ label: "Calcular retenciones", message: "Calcula las retenciones para un servicio de $5.000.000" }
```

Este es un mensaje **estatico** que siempre envia el mismo monto ($5.000.000). El usuario espera que el sistema consulte los gastos reales de la base de datos y estime retenciones basadas en esos datos.

---

## Cambios Propuestos

### Cambio 1: Agregar contexto de fecha al System Prompt
Modificar el `SYSTEM_PROMPT` en `agent-chat/index.ts` para incluir la fecha actual dinamicamente:

```typescript
const SYSTEM_PROMPT = `...
FECHA ACTUAL: ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
ANO FISCAL VIGENTE: ${new Date().getFullYear()}
...`;
```

Esto asegura que el AI siempre tenga contexto del ano actual.

### Cambio 2: Actualizar Quick Actions
Modificar los quick actions en `AgentChatWidget.tsx` para ser mas utiles:

| Antes | Despues |
|-------|---------|
| "Dame un resumen financiero del ano actual" | "Dame un resumen financiero del ano 2026" (dinamico) |
| "Calcula las retenciones para un servicio de $5.000.000" | "Cuanto he pagado en retenciones este ano? Desglosa por tipo" |

```typescript
const currentYear = new Date().getFullYear();
const quickActions = [
  { label: "Resumen financiero", message: `Dame un resumen financiero completo del ano ${currentYear}` },
  { label: "Calcular IVA", message: "Cuanto IVA descontable tengo acumulado?" },
  { label: "Facturas pendientes", message: "Cuales son mis facturas pendientes de pago?" },
  { label: "Retenciones pagadas", message: `Cuanto he pagado en retenciones durante ${currentYear}? Desglosa por tipo (Rete-Fuente, Rete-IVA, Rete-ICA)` },
];
```

### Cambio 3: Verificar renderizado del boton de microfono
El codigo del boton de microfono existe. Verificar:
- Si el componente `AgentChatWidget` esta incluido en el layout
- Si hay errores de importacion del hook `useAgentVoice`

---

## Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `supabase/functions/agent-chat/index.ts` | Agregar fecha actual al SYSTEM_PROMPT |
| `src/components/agent/AgentChatWidget.tsx` | Actualizar quick actions con ano dinamico y mensaje de retenciones mejorado |

---

## Resultado Esperado

1. **Microfono**: Verificar que el boton aparece correctamente (el codigo ya existe)
2. **Ano correcto**: El AI tendra contexto explicito del ano 2026 en su prompt del sistema
3. **Retenciones reales**: El quick action solicitara un desglose de retenciones pagadas, consultando la base de datos en lugar de calcular un monto estatico
