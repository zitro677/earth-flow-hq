
# Plan: Corrección de Edición de Proyectos

## Problemas Identificados

1. **Error "Failed to update project" al agregar Team Members**
   - El componente `TeamMembers.tsx` intenta guardar `{ team: updatedTeam }` en Supabase
   - La tabla `projects` NO tiene columna `team` - solo tiene: id, user_id, client_id, name, description, status, start_date, end_date, budget, actual_cost, progress
   - Esto causa el error porque Supabase rechaza columnas inexistentes

2. **El presupuesto no guarda cambios**
   - `BudgetSection.tsx` llama a `handleSaveBudget` en `ProjectOverview.tsx`
   - Pero `ProjectOverview.tsx` guarda en `localStorage`, NO en Supabase
   - Debería usar `updateProject()` para persistir en la base de datos

3. **No se puede cambiar el estado del proyecto**
   - El componente `StatusSelector.tsx` existe y funciona correctamente
   - Pero NO está siendo usado en la interfaz - solo se muestra un Badge estático en `ProjectStatusBadge.tsx`
   - Necesita reemplazar el Badge por el selector interactivo

---

## Solución Propuesta

### Paso 1: Migración de Base de Datos

Agregar columna `team` tipo JSONB a la tabla `projects`:

```sql
ALTER TABLE projects ADD COLUMN team jsonb DEFAULT '[]'::jsonb;
```

Esto permitirá almacenar un array de objetos con la estructura:
```json
[{"name": "Juan", "role": "Diseñador", "avatar": ""}]
```

---

### Paso 2: Actualizar ProjectOverview.tsx

Modificar `handleSaveBudget` para guardar en Supabase en lugar de localStorage:

```typescript
import { updateProject } from "../hooks/projectOperations";

const handleSaveBudget = async (budgetUsed: number, totalBudget: number) => {
  // Actualizar en Supabase
  const result = await updateProject(project.id, { 
    budget: totalBudget,
    actual_cost: budgetUsed 
  });
  
  if (result) {
    // Actualizar extraData local
    const updatedExtraData = {
      ...extraData,
      totalCost: budgetUsed
    };
    saveExtraData(updatedExtraData);
    
    // Notificar al padre
    if (onProjectUpdate) {
      onProjectUpdate();
    }
  }
};
```

---

### Paso 3: Hacer el Status Editable

Modificar `ProjectTitle.tsx` para usar `StatusSelector` en lugar del Badge estático:

```typescript
import StatusSelector from "./StatusSelector";

// En lugar de solo mostrar el badge:
<StatusSelector
  projectId={projectId}
  currentStatus={projectStatus}
  getStatusColor={getStatusColor}
  onStatusChange={onStatusChange}
/>
```

Agregar callback para recargar el proyecto cuando cambie el estado.

---

## Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| **Base de datos** | Agregar columna `team jsonb DEFAULT '[]'` |
| `src/components/projects/detail/ProjectOverview.tsx` | Usar `updateProject()` para guardar budget en Supabase |
| `src/components/projects/detail/components/ProjectTitle.tsx` | Reemplazar Badge estático con StatusSelector interactivo |
| `src/components/projects/detail/ProjectHeader.tsx` | Pasar callback `onStatusChange` a ProjectTitle |
| `src/components/projects/ProjectDetail.tsx` | Agregar handler para cambio de estado |

---

## Flujo Corregido

```text
EDITAR PROYECTO
      │
      ├──► Agregar Team Member
      │         │
      │         ▼
      │    TeamMembers.tsx
      │         │
      │         ▼
      │    updateProject(id, { team: [...] })
      │         │
      │         ▼
      │    ✓ Guardado en Supabase (columna team jsonb)
      │
      ├──► Editar Presupuesto
      │         │
      │         ▼
      │    BudgetSection.tsx → handleSaveBudget
      │         │
      │         ▼
      │    updateProject(id, { budget, actual_cost })
      │         │
      │         ▼
      │    ✓ Guardado en Supabase
      │
      └──► Cambiar Estado
                │
                ▼
           StatusSelector.tsx (nuevo en ProjectTitle)
                │
                ▼
           updateProject(id, { status })
                │
                ▼
           ✓ Guardado en Supabase
```

---

## Resultado Esperado

1. **Team Members**: Se guardan correctamente en la nueva columna `team` de tipo JSONB
2. **Presupuesto**: Se persiste en Supabase en las columnas `budget` y `actual_cost`
3. **Estado**: El usuario puede cambiar entre Planning, In Progress, On Hold, y Completed directamente desde la vista de detalle usando un dropdown interactivo
