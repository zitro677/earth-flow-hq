
# Plan: Agregar Tarjetas de Propuestas Pendientes y Aprobadas al Dashboard

## Objetivo
Agregar dos nuevas tarjetas al dashboard para mostrar:
1. **Propuestas Pendientes** (estado "Sent" - enviadas esperando respuesta)
2. **Propuestas Aprobadas** (estado "Approved")

---

## Cambios Requeridos

### 1. Actualizar `useOverviewStats.ts`

Agregar nuevas métricas para propuestas pendientes y aprobadas:

```typescript
// Agregar estas nuevas métricas
const pendingProposals = proposals?.filter(p => p.status === 'Sent').length || 0;
const pendingProposalsAmount = proposals?.filter(p => p.status === 'Sent')
  .reduce((sum, p) => sum + parseFloat(p.amount?.toString() || '0'), 0) || 0;

const approvedProposals = proposals?.filter(p => p.status === 'Approved').length || 0;
const approvedProposalsAmount = proposals?.filter(p => p.status === 'Approved')
  .reduce((sum, p) => sum + parseFloat(p.amount?.toString() || '0'), 0) || 0;
```

Y retornarlas en el objeto:
```typescript
return {
  // ... existentes
  pendingProposals,
  pendingProposalsAmount,
  approvedProposals,
  approvedProposalsAmount
};
```

---

### 2. Actualizar `DashboardPage.tsx`

Cambiar la grilla de 4 a 6 columnas y agregar las nuevas tarjetas:

```text
Layout actual (4 tarjetas):
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Ingresos    │ Proyectos   │ Facturas    │ Nuevas      │
│ Totales     │ Activos     │ Pendientes  │ Propuestas  │
└─────────────┴─────────────┴─────────────┴─────────────┘

Nuevo layout (6 tarjetas en 2 filas):
┌─────────────┬─────────────┬─────────────┐
│ Ingresos    │ Proyectos   │ Facturas    │
│ Totales     │ Activos     │ Pendientes  │
├─────────────┼─────────────┼─────────────┤
│ Nuevas      │ Propuestas  │ Propuestas  │
│ Propuestas  │ Pendientes  │ Aprobadas   │
└─────────────┴─────────────┴─────────────┘
```

Agregar nuevas tarjetas con iconos apropiados:

```typescript
import { Clock, CheckCircle } from "lucide-react";

// Nueva tarjeta: Propuestas Pendientes
<OverviewCard
  title="Propuestas Pendientes"
  value={formatCurrency(overviewStats.pendingProposalsAmount)}
  description={`${overviewStats.pendingProposals} esperando respuesta`}
  icon={Clock}
  trend={0}
  delay={4}
  isLoading={isLoading}
/>

// Nueva tarjeta: Propuestas Aprobadas
<OverviewCard
  title="Propuestas Aprobadas"
  value={formatCurrency(overviewStats.approvedProposalsAmount)}
  description={`${overviewStats.approvedProposals} propuestas aprobadas`}
  icon={CheckCircle}
  trend={0}
  delay={5}
  isLoading={isLoading}
/>
```

---

### 3. Ajustar el Grid Responsivo

Modificar las clases CSS de la grilla:

```typescript
// Cambiar de:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

// A:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
```

Esto mostrará:
- **Móvil**: 1 columna (6 filas)
- **Tablet**: 2 columnas (3 filas)
- **Desktop**: 3 columnas (2 filas)

---

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/components/dashboard/hooks/calculations/useOverviewStats.ts` | Agregar cálculos de propuestas pendientes y aprobadas |
| `src/components/dashboard/DashboardPage.tsx` | Agregar 2 nuevas tarjetas y ajustar grid |

---

## Resultado Visual Esperado

El dashboard mostrará 6 tarjetas organizadas en 2 filas de 3 columnas:

- **Fila 1**: Ingresos Totales, Proyectos Activos, Facturas Pendientes
- **Fila 2**: Nuevas Propuestas (borradores), Propuestas Pendientes (enviadas), Propuestas Aprobadas

Cada tarjeta de propuestas mostrará:
- El monto total en formato de moneda
- La cantidad de propuestas en esa categoría
