
# Plan: Sistema de Categorías y Subcategorías de Gastos Deducibles

## Objetivo
Implementar un sistema jerárquico de categorías y subcategorías para gastos deducibles, específico para el negocio de blindaje de vehículos AutoSeguro DJ.

---

## Estructura de Categorías Propuesta

```text
┌─────────────────────────────────────────────────────────────────┐
│  CATEGORÍA PRINCIPAL          │  SUBCATEGORÍAS                  │
├─────────────────────────────────────────────────────────────────┤
│  1. Compra y Transformación   │  - Adquisición de vehículos     │
│     de Vehículos              │  - Materiales de blindaje       │
│                               │  - Repuestos y adaptación       │
│                               │  - Mano de obra directa         │
│                               │  - Consumibles de taller        │
│                               │  - Servicios (energía/gas/agua) │
│                               │  - Arrendamiento taller         │
│                               │  - Depreciación maquinaria      │
│                               │  - Mantenimiento equipos        │
├─────────────────────────────────────────────────────────────────┤
│  2. Venta y Comercialización  │  - Comisiones vendedores        │
│                               │  - Publicidad y marketing       │
│                               │  - Traslado de unidades         │
│                               │  - Preparación vehículos        │
│                               │  - Gastos de entrega            │
│                               │  - Gastos de garantía           │
├─────────────────────────────────────────────────────────────────┤
│  3. Trámites e Intermediación │  - Derechos y registros         │
│                               │  - Transporte y almacenamiento  │
│                               │  - Licencias y software         │
│                               │  - Comisiones gestores          │
├─────────────────────────────────────────────────────────────────┤
│  4. Administración y Finanzas │  - Sueldos administrativos      │
│                               │  - Aportes parafiscales         │
│                               │  - Arrendamiento oficinas       │
│                               │  - Servicios públicos           │
│                               │  - Licencias software           │
│                               │  - Material de oficina          │
│                               │  - Uniformes y EPP              │
│                               │  - Viajes y hospedaje           │
│                               │  - Seguros                      │
│                               │  - Depreciación activos         │
│                               │  - Mantenimiento inmuebles      │
│                               │  - Reparaciones locativas       │
├─────────────────────────────────────────────────────────────────┤
│  5. Marketing y RRPP          │  - Eventos VIP                  │
│                               │  - Merchandising                │
│                               │  - Membresías y gremios         │
│                               │  - Certificaciones              │
├─────────────────────────────────────────────────────────────────┤
│  6. Financieros y Tributarios │  - Intereses préstamos          │
│                               │  - Comisiones bancarias         │
│                               │  - Auditoría externa            │
│                               │  - Timbres y registros          │
├─────────────────────────────────────────────────────────────────┤
│  7. Kilometraje               │  - Kilometraje (deducible)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cambios Requeridos

### 1. Crear archivo de configuración de categorías

**Nuevo archivo:** `src/components/finances/expense-tracker/data/expenseCategories.ts`

Este archivo contendrá la estructura de categorías y subcategorías, facilitando futuras modificaciones sin tocar el código del formulario.

```typescript
export interface ExpenseSubcategory {
  id: string;
  label: string;
  description?: string;
}

export interface ExpenseCategory {
  id: string;
  label: string;
  icon?: string;
  subcategories: ExpenseSubcategory[];
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: "transformacion",
    label: "Compra y Transformación de Vehículos",
    subcategories: [
      { id: "adquisicion_vehiculos", label: "Adquisición de vehículos" },
      { id: "materiales_blindaje", label: "Materiales de blindaje" },
      // ... más subcategorías
    ]
  },
  // ... más categorías
];
```

---

### 2. Actualizar el tipo `NewExpense`

**Archivo:** `src/components/finances/expense-tracker/hooks/useExpenseTracker.ts`

Agregar campo `subcategory` al tipo:

```typescript
export interface NewExpense {
  date: string;
  category: string;
  subcategory: string;  // NUEVO
  amount: string;
  vendor: string;
  description: string;
  deductible: boolean;
  miles?: string;
}
```

---

### 3. Actualizar el formulario de gastos

**Archivo:** `src/components/finances/expense-tracker/components/ExpenseForm.tsx`

Cambios principales:
- Importar las categorías desde el nuevo archivo de configuración
- Agregar selector de categoría principal con grupos visuales
- Agregar selector de subcategoría dependiente de la categoría seleccionada
- Las subcategorías se actualizarán dinámicamente según la categoría elegida

```text
Diseño del formulario actualizado:
┌────────────────────────────────────────────────────────────┐
│  Agregar Nuevo Gasto                                       │
├────────────────────────────────────────────────────────────┤
│  Fecha: [___________]     Categoría: [▼ Seleccionar    ]   │
│                                                            │
│  Subcategoría: [▼ Seleccionar subcategoría          ]      │
│                                                            │
│  Monto ($): [_________]   Proveedor: [________________]    │
│                                                            │
│  Descripción: [_______________________________________]    │
│                                                            │
│  [✓] Deducible de impuestos                                │
│                                                            │
│                          [Cancelar]  [Guardar Gasto]       │
└────────────────────────────────────────────────────────────┘
```

---

### 4. Actualizar base de datos (opcional pero recomendado)

Agregar columna `subcategory` a la tabla `expenses`:

```sql
ALTER TABLE expenses ADD COLUMN subcategory text;
```

Esto permitirá almacenar y filtrar por subcategoría en reportes futuros.

---

### 5. Actualizar operaciones de guardado

**Archivo:** `src/components/finances/expense-tracker/hooks/useExpenseTracker.ts`

- Incluir `subcategory` en las operaciones de INSERT y UPDATE
- Transformar los datos recuperados para incluir subcategoría

---

## Archivos a Modificar/Crear

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/components/finances/expense-tracker/data/expenseCategories.ts` | **CREAR** | Configuración de categorías y subcategorías |
| `src/components/finances/expense-tracker/hooks/useExpenseTracker.ts` | Modificar | Agregar subcategory al tipo y operaciones |
| `src/components/finances/expense-tracker/components/ExpenseForm.tsx` | Modificar | UI con selectores jerárquicos |
| Base de datos | Migración | Agregar columna subcategory |

---

## Beneficios de esta Implementación

1. **Fácil de usar**: El usuario selecciona primero la categoría principal y luego la subcategoría específica
2. **Organizado**: Las categorías están agrupadas lógicamente según el tipo de gasto
3. **Mantenible**: Las categorías están en un archivo de configuración separado, fácil de modificar
4. **Extensible**: Se pueden agregar nuevas categorías o subcategorías sin cambiar el código del formulario
5. **Reportes precisos**: Permitirá generar reportes fiscales detallados por categoría y subcategoría

---

## Experiencia de Usuario

1. El usuario abre el formulario de nuevo gasto
2. Selecciona la **categoría principal** (ej: "Compra y Transformación de Vehículos")
3. El selector de subcategoría se actualiza mostrando solo las opciones relevantes
4. Selecciona la **subcategoría** (ej: "Materiales de blindaje")
5. Completa el resto del formulario
6. Todos los gastos quedan etiquetados con ambos niveles para reportes fiscales
