

# Plan: Corrección del Error "Failed to create invoice"

## Problema Identificado

Al intentar crear una factura, el error "Failed to create invoice" ocurre debido a varios problemas en el flujo de datos:

1. **Campo `total` no se envía en `invoice_items`** - Aunque tiene default, es mejor práctica calcularlo
2. **Validación de dirección muy estricta** - Puede fallar si el cliente no tiene dirección
3. **IVA incorrecto** - Aún dice 7% en lugar de 19%

---

## Cambios Técnicos

### 1. Corregir `useInvoiceMutations.ts` - Agregar campo `total`
**Archivo:** `src/components/invoices/hooks/useInvoiceMutations.ts`

Modificar la creación de items para incluir el campo `total`:

```typescript
// Líneas 48-53: Agregar cálculo de total
const invoiceItems = items.map(item => ({
  invoice_id: data.id,
  description: item.description,
  quantity: item.quantity,
  unit_price: item.unit_price,
  total: item.quantity * item.unit_price, // AGREGAR ESTA LÍNEA
}));
```

También aplicar el mismo cambio en la sección de actualización (líneas 107-112).

---

### 2. Hacer la dirección opcional en el formulario
**Archivo:** `src/components/invoices/form/formSchema.ts`

Cambiar la validación de `address` para que sea opcional o permita cadenas vacías:

```typescript
// Cambiar de:
address: z.string().min(5, { message: "Address must be at least 5 characters." }),

// A:
address: z.string().optional().default(""),
```

---

### 3. Corregir el IVA a 19%
**Archivo:** `src/components/invoices/form/hooks/useInvoiceSubmission.ts`

Actualizar la tasa de impuesto:

```typescript
// Línea 54: Cambiar de 0.07 a 0.19
tax_rate: 0.19,  // 19% IVA
```

---

### 4. Mejorar manejo de errores
**Archivo:** `src/components/invoices/form/hooks/useInvoiceSubmission.ts`

Agregar logging más detallado para debugging:

```typescript
} catch (error) {
  console.error(`Error ${isEditMode ? "updating" : "creating"} invoice:`, error);
  // Mostrar mensaje de error más específico
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  toast.error(`Failed to ${isEditMode ? "update" : "create"} invoice: ${errorMessage}`);
}
```

---

## Resumen de Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/invoices/hooks/useInvoiceMutations.ts` | Agregar campo `total` calculado en items |
| `src/components/invoices/form/formSchema.ts` | Hacer `address` opcional |
| `src/components/invoices/form/hooks/useInvoiceSubmission.ts` | Cambiar IVA a 19% y mejorar errores |

---

## Resultado Esperado

Después de estos cambios:
- Las facturas se crearán correctamente
- Los clientes sin dirección podrán ser seleccionados
- El IVA reflejará el 19% correcto
- Los errores mostrarán mensajes más descriptivos

