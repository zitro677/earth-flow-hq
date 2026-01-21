
# Plan: Rediseño del PDF de Propuestas - AutoSeguroDJ

## Objetivo
Rediseñar completamente el generador de PDF de propuestas para crear un documento de una página, profesional y moderno, con la identidad visual de AutoseguroDJ S.A.S (verde oscuro #15803d y blanco).

---

## Estructura del Nuevo PDF

```text
┌─────────────────────────────────────────────────────────────────┐
│  [LOGO]  AUTOSEGURODJ S.A.S                                     │
│          PROPUESTA COMERCIAL                                     │
│  ───────────────────────────────────────────────────────────    │
│  📞 +57 304 257 61 04 | ✉️ gerencia@autosegurodj.com            │
├─────────────────────────────────────────────────────────────────┤
│  CLIENTE                          │  FECHAS                     │
│  Nombre: [cliente]                │  Emisión: [fecha]           │
│  Email: [email]                   │  Validez: [fecha]           │
│  Teléfono: [teléfono]             │                             │
├─────────────────────────────────────────────────────────────────┤
│  🚗 RESUMEN DE SERVICIO                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Concepto          │ Detalle                             │    │
│  │ Servicio          │ Blindaje de vidrios                 │    │
│  │ Material          │ Laminado de seguridad               │    │
│  │ Tiempo            │ 2 semanas desde recepción           │    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│  💰 PROPUESTA ECONÓMICA                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Item              │ Valor                               │    │
│  │ [servicios]       │ $X,XXX,XXX COP                     │    │
│  │ Subtotal          │ $X,XXX,XXX                         │    │
│  │ IVA (19%)         │ $XXX,XXX                           │    │
│  │ TOTAL             │ $X,XXX,XXX COP                     │    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│  📅 CONDICIONES DE PAGO                                         │
│  • 30% al iniciar ($X,XXX,XXX)                                  │
│  • 70% al finalizar ($X,XXX,XXX)                                │
├─────────────────────────────────────────────────────────────────┤
│  ✅ NOTAS Y GARANTÍAS                                           │
│  • Incluye garantía por 1 año                                   │
│  • Homologación ante Ministerio de Transporte                   │
│  • Entrega en punto de servicio o domicilio                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           [ ACEPTAR PROPUESTA ]                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                     www.autosegurodj.com                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cambios Técnicos

### 1. Actualizar paleta de colores
**Archivo:** `src/components/proposals/utils/pdf/headerSection.ts`

| Elemento | Color Actual | Nuevo Color |
|----------|--------------|-------------|
| Verde principal | #5d9049 (93, 144, 73) | #15803d (21, 128, 61) |
| Líneas decorativas | #b5d3ae | #15803d |
| Títulos de sección | Verde claro | #15803d |
| Fondo cajas info | Beige/gris | Blanco con borde verde |

### 2. Rediseñar sección de encabezado
**Archivo:** `src/components/proposals/utils/pdf/headerSection.ts`

Cambios:
- Logo más prominente (centrado o izquierda)
- Título "PROPUESTA COMERCIAL" grande y centrado
- Línea de contacto con iconos minimalistas debajo del título
- Diseño más limpio y espaciado

### 3. Rediseñar sección de cliente
**Archivo:** `src/components/proposals/utils/pdf/clientSection.ts`

Cambios:
- Dos columnas: datos del cliente (izquierda) y fechas (derecha)
- Diseño con fondo blanco y bordes verdes sutiles
- Incluir fecha de emisión y validez en la misma fila visual

### 4. Nueva sección: Resumen de Servicio
**Archivo:** Crear `src/components/proposals/utils/pdf/serviceSummarySection.ts`

Nueva sección con tabla que incluya:
- Concepto / Detalle
- Servicio ofrecido
- Material utilizado
- Tiempo estimado de instalación

### 5. Rediseñar sección de precios
**Archivo:** `src/components/proposals/utils/pdf/pricingSection.ts`

Cambios:
- Título "PROPUESTA ECONÓMICA" con icono de dinero
- Tabla con items detallados
- Mostrar subtotal, IVA (19%), y TOTAL en formato COP
- Usar formato de moneda colombiana: `$X.XXX.XXX COP`

### 6. Nueva sección: Condiciones de Pago
**Archivo:** Crear `src/components/proposals/utils/pdf/paymentTermsSection.ts`

Mostrar:
- 30% al iniciar (con monto calculado)
- 70% al finalizar (con monto calculado)
- Formato con bullets y montos claros

### 7. Rediseñar sección de notas
**Archivo:** `src/components/proposals/utils/pdf/contentSections.ts`

Cambios:
- Formato de lista con checkmarks verdes (✅)
- Incluir garantías y condiciones estándar
- Diseño más compacto

### 8. Nuevo elemento: Botón "Aceptar Propuesta"
**Archivo:** `src/components/proposals/utils/pdf/footerSection.ts` (crear)

Agregar:
- Rectángulo verde (#15803d) centrado
- Texto blanco "ACEPTAR PROPUESTA"
- Pie de página con website

### 9. Actualizar formatter de moneda
**Archivo:** `src/components/proposals/utils/formatters.ts`

Cambiar de USD a COP:
```typescript
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
```

### 10. Actualizar generador principal
**Archivo:** `src/components/proposals/ProposalPdfGenerator.tsx`

Reorganizar el flujo para:
- Mantener todo en una página (optimizar espacios)
- Llamar a las nuevas secciones en orden
- Agregar lógica para calcular 30%/70% de pagos

### 11. Corregir footer antiguo
**Archivo:** `src/components/proposals/utils/pdf/contentSections.ts`

Eliminar referencia a "Green Landscape Irrigation" y actualizar a AutoseguroDJ S.A.S

---

## Archivos a Modificar

| Archivo | Acción |
|---------|--------|
| `headerSection.ts` | Modificar - nuevo diseño y colores |
| `clientSection.ts` | Modificar - dos columnas, nuevo estilo |
| `pricingSection.ts` | Modificar - formato COP, nuevo diseño |
| `contentSections.ts` | Modificar - eliminar footer antiguo, nuevo estilo |
| `formatters.ts` | Modificar - cambiar USD a COP |
| `ProposalPdfGenerator.tsx` | Modificar - reorganizar secciones |
| `pdfSections.ts` | Modificar - exportar nuevas secciones |
| **Nuevo:** `serviceSummarySection.ts` | Crear - resumen de servicio |
| **Nuevo:** `paymentTermsSection.ts` | Crear - condiciones de pago |
| **Nuevo:** `footerSection.ts` | Crear - botón y footer |

---

## Consideraciones Importantes

1. **Optimización de espacio**: Todo debe caber en una página A4, usando espaciado compacto pero legible

2. **Iconos**: Se usarán caracteres Unicode simples en lugar de emojis para compatibilidad:
   - Teléfono: puede ser texto simple o símbolo básico
   - Calendario: representación textual
   - Dinero: representación textual

3. **Compatibilidad**: jsPDF no soporta emojis nativamente, se usarán alternativas textuales o símbolos básicos

4. **Datos dinámicos**: El PDF tomará datos reales de la propuesta (cliente, items, montos, fechas)
