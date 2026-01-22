

# Plan: Corrección del Error de Columnas Inexistentes

## Problema Identificado

El error exacto es:
```
"Could not find the 'project_id' column of 'invoices' in the schema cache"
```

El código en `useInvoiceSubmission.ts` intenta enviar campos que **no existen** en la tabla `invoices`:
- `project_id: null` (línea 48)
- `proposal_id: null` (línea 49)

Según el schema de la base de datos, las columnas de `invoices` son:
`client_id`, `invoice_number`, `status`, `notes`, `created_at`, `user_id`, `id`, `tax_rate`, `due_date`, `issue_date`, `amount`, `updated_at`

---

## Solución

### Archivo: `src/components/invoices/form/hooks/useInvoiceSubmission.ts`

**Eliminar las líneas 48 y 49** que envían campos inexistentes:

```typescript
// CAMBIAR DE (líneas 45-57):
const invoiceData = {
  user_id: user.id,
  client_id: values.client_id,
  project_id: null,      // ❌ ELIMINAR - no existe en la tabla
  proposal_id: null,     // ❌ ELIMINAR - no existe en la tabla
  invoice_number: isEditMode ? undefined : generateInvoiceNumber(),
  issue_date: values.invoiceDate,
  due_date: values.dueDate,
  amount: totalAmount,
  tax_rate: 0.19,
  notes: values.notes,
  status: isEditMode ? undefined : "Pending",
};

// CAMBIAR A:
const invoiceData = {
  user_id: user.id,
  client_id: values.client_id,
  invoice_number: isEditMode ? undefined : generateInvoiceNumber(),
  issue_date: values.invoiceDate,
  due_date: values.dueDate,
  amount: totalAmount,
  tax_rate: 0.19,
  notes: values.notes,
  status: isEditMode ? undefined : "Pending",
};
```

---

## Resumen

| Archivo | Cambio |
|---------|--------|
| `useInvoiceSubmission.ts` | Eliminar `project_id: null` y `proposal_id: null` |

---

## Resultado Esperado

Después de este cambio, las facturas se crearán correctamente porque solo se enviarán los campos que existen en la tabla de la base de datos.

