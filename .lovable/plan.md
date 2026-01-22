
# Plan: Sistema de Cálculos Tributarios Colombianos

## Objetivo
Implementar cálculos automáticos de retenciones, IVA y deducciones según el régimen tributario colombiano (régimen común, municipio Bogotá con ICA 0.5%).

---

## Configuración Tributaria Colombia

```text
┌───────────────────────────────────────────────────────────────────┐
│  TASAS DE RETENCIÓN EN LA FUENTE (Rete-Renta)                    │
├───────────────────────────────────────────────────────────────────┤
│  Compras / Inventario            →  2.5%                         │
│  Servicios                       →  4.0%                         │
│  Arrendamiento Inmueble          →  3.5%                         │
│  Publicidad / Transporte         →  1.0%                         │
├───────────────────────────────────────────────────────────────────┤
│  IVA                             →  19%                          │
│  Rete-IVA (50% del IVA)          →  9.5% efectivo                │
│  ICA Bogotá                      →  0.5%                         │
└───────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Cálculo Automático

```text
ENTRADA: Valor Bruto (sin IVA)
         ↓
┌────────────────────────────────────────────────────────────────┐
│  1. DETECTAR TIPO DE GASTO                                     │
│     → Mapear categoría/subcategoría a concepto tributario      │
│       (inventario, servicio, arrendamiento, publicidad, etc.)  │
└────────────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────────┐
│  2. CALCULAR IVA                                               │
│     IVA = Valor Bruto × 19%                                    │
│     Valor Total = Valor Bruto + IVA                            │
└────────────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────────┐
│  3. CALCULAR RETENCIONES                                       │
│     Rete-Fuente = Valor Bruto × % según concepto               │
│     Rete-IVA = IVA × 50% (si proveedor responsable)            │
│     Rete-ICA = Valor Bruto × 0.5%                              │
└────────────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────────┐
│  4. CALCULAR NETO A PAGAR                                      │
│     Neto = Valor Bruto + IVA - Rete-Fuente - Rete-IVA - ICA    │
└────────────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────────┐
│  5. CALCULAR BENEFICIOS FISCALES                               │
│     Costo Deducible = Valor Bruto (100%)                       │
│     IVA Descontable = IVA - Rete-IVA                           │
│     Crédito Renta = Rete-Fuente                                │
│     Crédito ICA = Rete-ICA                                     │
└────────────────────────────────────────────────────────────────┘
```

---

## Cambios Requeridos

### 1. Crear archivo de configuración tributaria

**Nuevo archivo:** `src/components/finances/expense-tracker/utils/colombianTaxConfig.ts`

Define tasas oficiales y mapeo de categorías a conceptos tributarios:

```typescript
// Tasas de retención según concepto
export const RETENTION_RATES = {
  compras: 0.025,        // 2.5% inventario/materiales
  servicios: 0.04,       // 4.0% servicios generales
  arrendamiento: 0.035,  // 3.5% arrendamiento inmueble
  publicidad: 0.01,      // 1.0% publicidad/transporte
  honorarios: 0.10,      // 10% honorarios (opcional)
};

export const IVA_RATE = 0.19;          // 19%
export const RETE_IVA_RATE = 0.50;     // 50% del IVA
export const ICA_BOGOTA_RATE = 0.005;  // 0.5%
```

Incluye función de mapeo de categorías:

```typescript
export function getRetentionType(categoryId: string, subcategoryId: string): string {
  // Mapea cada subcategoría al tipo de retención aplicable
  const mappings = {
    'adquisicion_vehiculos': 'compras',
    'materiales_blindaje': 'compras',
    'mano_obra_directa': 'servicios',
    'arrendamiento_taller': 'arrendamiento',
    'publicidad_marketing': 'publicidad',
    // ... etc
  };
  return mappings[subcategoryId] || 'servicios';
}
```

---

### 2. Crear hook de cálculos tributarios

**Nuevo archivo:** `src/components/finances/expense-tracker/hooks/useColombianTaxCalculations.ts`

Hook reutilizable que calcula todo automáticamente:

```typescript
export interface TaxCalculationResult {
  valorBruto: number;
  iva: number;
  valorTotal: number;
  reteFuente: number;
  reteIva: number;
  reteIca: number;
  totalRetenciones: number;
  netoAPagar: number;
  costoDeducible: number;
  ivaDescontable: number;
  creditoRenta: number;
  creditoIca: number;
}

export function calculateColombianTaxes(
  valorBruto: number,
  categoryId: string,
  subcategoryId: string,
  proveedorResponsableIva: boolean = true
): TaxCalculationResult { ... }
```

---

### 3. Actualizar el formulario de gastos

**Archivo:** `src/components/finances/expense-tracker/components/ExpenseForm.tsx`

Agregar:
- Campo para indicar si el proveedor es responsable de IVA (checkbox)
- Panel de cálculos que muestre en tiempo real:
  - IVA calculado
  - Retención en la fuente
  - Rete-IVA  
  - Rete-ICA
  - **Neto a pagar al proveedor**

```text
┌────────────────────────────────────────────────────────────────┐
│  NUEVO GASTO                                                   │
├────────────────────────────────────────────────────────────────┤
│  Valor Bruto (sin IVA): [_______________]                      │
│                                                                │
│  Categoría: [▼ Compra y Transformación ]                       │
│  Subcategoría: [▼ Materiales de blindaje ]                     │
│                                                                │
│  [✓] Proveedor responsable de IVA                              │
├────────────────────────────────────────────────────────────────┤
│  CÁLCULOS AUTOMÁTICOS                                          │
│  ─────────────────────────────────────────────────────────────│
│  + IVA (19%):                           $ 1,900,000            │
│  = Valor Total:                         $11,900,000            │
│  ─────────────────────────────────────────────────────────────│
│  - Rete-Fuente (2.5%):                  $   250,000            │
│  - Rete-IVA (50% IVA):                  $   950,000            │
│  - Rete-ICA (0.5%):                     $    50,000            │
│  ─────────────────────────────────────────────────────────────│
│  = NETO A PAGAR:                        $10,650,000            │
└────────────────────────────────────────────────────────────────┘
```

---

### 4. Migración de base de datos

Agregar columnas para almacenar cálculos tributarios:

```sql
ALTER TABLE expenses ADD COLUMN valor_bruto numeric DEFAULT 0;
ALTER TABLE expenses ADD COLUMN iva numeric DEFAULT 0;
ALTER TABLE expenses ADD COLUMN rete_fuente numeric DEFAULT 0;
ALTER TABLE expenses ADD COLUMN rete_iva numeric DEFAULT 0;
ALTER TABLE expenses ADD COLUMN rete_ica numeric DEFAULT 0;
ALTER TABLE expenses ADD COLUMN neto_pagar numeric DEFAULT 0;
ALTER TABLE expenses ADD COLUMN proveedor_responsable_iva boolean DEFAULT true;
ALTER TABLE expenses ADD COLUMN tipo_retencion text DEFAULT 'servicios';
```

---

### 5. Actualizar tipos e interfaces

**Archivo:** `src/components/finances/expense-tracker/hooks/useExpenseTracker.ts`

Extender interfaces para incluir campos tributarios:

```typescript
export interface Expense {
  // ... campos existentes
  valorBruto: number;
  iva: number;
  reteFuente: number;
  reteIva: number;
  reteIca: number;
  netoPagar: number;
  proveedorResponsableIva: boolean;
  tipoRetencion: string;
}
```

---

### 6. Actualizar estadísticas con datos fiscales

**Archivo:** `src/components/finances/expense-tracker/components/ExpenseStats.tsx`

Nuevas tarjetas de estadísticas:

```text
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Total Gastos   │ │  IVA Descontable│ │  Crédito Renta  │
│  $XX,XXX,XXX    │ │  $X,XXX,XXX     │ │  $X,XXX,XXX     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Crédito ICA    │ │  Total Retenido │ │  Neto Pagado    │
│  $XXX,XXX       │ │  $X,XXX,XXX     │ │  $XX,XXX,XXX    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

### 7. Actualizar la tabla de gastos

**Archivo:** `src/components/finances/expense-tracker/components/ExpenseTableColumns.tsx`

Agregar columnas para mostrar:
- Valor Bruto
- IVA
- Retenciones (tooltip con detalle)
- Neto Pagado

---

## Archivos a Crear/Modificar

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/components/finances/expense-tracker/utils/colombianTaxConfig.ts` | **CREAR** | Configuración de tasas y mapeos |
| `src/components/finances/expense-tracker/hooks/useColombianTaxCalculations.ts` | **CREAR** | Hook de cálculos tributarios |
| `src/components/finances/expense-tracker/components/ExpenseForm.tsx` | Modificar | Agregar campo proveedor IVA y panel de cálculos |
| `src/components/finances/expense-tracker/hooks/useExpenseTracker.ts` | Modificar | Extender interfaces y operaciones DB |
| `src/components/finances/expense-tracker/components/ExpenseStats.tsx` | Modificar | Nuevas tarjetas de estadísticas fiscales |
| `src/components/finances/expense-tracker/components/ExpenseTableColumns.tsx` | Modificar | Columnas de IVA, retenciones, neto |
| Base de datos | Migración | Agregar 8 columnas tributarias |

---

## Formato de Moneda

Todos los valores se mostrarán en **Pesos Colombianos (COP)** usando el formato `es-CO`:

```typescript
valor.toLocaleString('es-CO', { 
  style: 'currency', 
  currency: 'COP',
  minimumFractionDigits: 0 
})
// Ejemplo: $10.650.000
```

---

## Beneficios

1. **Cálculo automático** - El usuario solo ingresa el valor bruto sin IVA
2. **Cumplimiento tributario** - Retenciones calculadas según normativa colombiana vigente
3. **Control fiscal** - Visualización clara de créditos tributarios (IVA descontable, anticipos de renta e ICA)
4. **Auditoría** - Todos los cálculos quedan almacenados en la base de datos para reportes
5. **Simplicidad** - El usuario final ve exactamente cuánto debe pagar al proveedor
