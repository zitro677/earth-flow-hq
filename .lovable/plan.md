
# Plan: Corregir Card "Monto Pendiente" en Propuestas

## Problema Identificado

La card "Monto Pendiente" siempre muestra **$0** porque:

| Código actual | Estados en BD |
|---------------|---------------|
| `status === "Pending"` | Draft, Sent, Approved, Rejected |

El estado **"Pending" no existe** en la base de datos. Las propuestas "pendientes de aprobación" tienen el estado **"Sent"** (Enviada).

---

## Lógica de Negocio

Según el ciclo de vida de las propuestas:

```text
Draft (Borrador) → Sent (Enviada/Pendiente) → Approved/Rejected
                          ↑
                   "Pendiente de respuesta"
```

Una propuesta en estado **"Sent"** es una propuesta **pendiente de aprobación** por parte del cliente.

---

## Solución

### Archivo: `src/components/proposals/ProposalStats.tsx`

Cambiar el filtro de `"Pending"` a `"Sent"`:

```typescript
// ANTES (incorrecto)
const pendingAmount = proposals
  .filter((proposal) => proposal.status === "Pending")
  .reduce((sum, proposal) => sum + formatAmount(proposal.amount), 0);

// DESPUÉS (correcto)
const pendingAmount = proposals
  .filter((proposal) => proposal.status === "Sent")
  .reduce((sum, proposal) => {
    // Usar total si está disponible, sino amount
    const total = proposal.total ? Number(proposal.total) : 0;
    const amount = formatAmount(proposal.amount);
    return sum + (total > 0 ? total : amount);
  }, 0);
```

Actualizar también el contador de propuestas pendientes:

```typescript
// ANTES
{proposals.filter((proposal) => proposal.status === "Pending").length}

// DESPUÉS  
{proposals.filter((proposal) => proposal.status === "Sent").length}
```

---

## Cambio Adicional Recomendado

### Archivo: `src/components/proposals/ProposalFilters.tsx`

El filtro "Pendiente" usa `value="pending"` pero el estado real es "Sent". Hay que alinear la terminología:

| Filtro UI | Valor interno | Estado en BD |
|-----------|---------------|--------------|
| Borrador | draft | Draft |
| **Pendiente** | **sent** | **Sent** |
| Aprobada | approved | Approved |
| Rechazada | rejected | Rejected |

---

## Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/proposals/ProposalStats.tsx` | Cambiar filtro de "Pending" a "Sent" para la card Monto Pendiente |
| `src/components/proposals/ProposalFilters.tsx` | Cambiar value "pending" a "sent" para el filtro Pendiente |
| `src/components/proposals/ProposalsPage.tsx` | Actualizar lógica de filtrado para usar "Sent" en lugar de "Pending" |

---

## Resultado Esperado

1. **Card "Monto Pendiente"**: Mostrará la suma de todas las propuestas con estado "Sent" (enviadas pero sin respuesta)
2. **Contador**: Mostrará correctamente "X propuestas pendientes" 
3. **Filtro "Pendiente"**: Filtrará correctamente las propuestas enviadas
