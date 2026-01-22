
# Plan: Traducción Completa de la Interfaz al Español

## Objetivo
Traducir todos los textos de la interfaz de usuario al español, incluyendo módulos, formularios, mensajes de error, tooltips, placeholders y botones.

---

## Análisis del Estado Actual

Tras revisar el código, he identificado que **muchos componentes ya están en español**, pero hay varios archivos que aún contienen texto en inglés que necesitan traducción.

---

## Archivos que Requieren Traducción

### 1. Módulo de Facturas (Invoices)

| Archivo | Textos a Traducir |
|---------|-------------------|
| `InvoiceForm.tsx` | "Back to Invoices" → "Volver a Facturas", "Edit Invoice" → "Editar Factura", "Create New Invoice" → "Crear Nueva Factura", "Reset" → "Restablecer", "Saving..." → "Guardando...", "Update Invoice" → "Actualizar Factura", "Save Invoice" → "Guardar Factura", "Cancel" → "Cancelar", "Please select a client" → "Por favor selecciona un cliente", "Please add at least one item" → "Por favor agrega al menos un ítem" |
| `InvoiceDetailsSection.tsx` | "Invoice Details" → "Detalles de Factura", "Invoice #" → "Factura #", "Invoice Date" → "Fecha de Factura", "Due Date" → "Fecha de Vencimiento", "Payment Terms" → "Términos de Pago", "Select terms" → "Seleccionar términos" |
| `InvoiceItemsSection.tsx` | "Items" → "Ítems", "Add Item" → "Agregar Ítem", "Description" → "Descripción", "Item description" → "Descripción del ítem", "Quantity" → "Cantidad", "Unit Price ($)" → "Precio Unitario (COP)" |
| `NotesSection.tsx` (invoices) | "Additional Notes" → "Notas Adicionales", "Add any additional notes or payment instructions..." → "Agrega notas adicionales o instrucciones de pago..." |
| `SummarySection.tsx` | "Summary" → "Resumen", "Subtotal" → "Subtotal" (ya está bien) |
| `AuthErrorAlert.tsx` | "Authentication Error" → "Error de Autenticación", "You must be logged in..." → "Debes iniciar sesión para crear una factura...", "Go to Login" → "Ir a Iniciar Sesión" |
| `StatusBadge.tsx` | "Paid" → "Pagada", "Pending" → "Pendiente", "Overdue" → "Vencida" |

### 2. Módulo de Clientes (Clients)

| Archivo | Textos a Traducir |
|---------|-------------------|
| `ClientForm.tsx` | "Back to Clients" → "Volver a Clientes", "Edit Client" → "Editar Cliente", "Add New Client" → "Agregar Nuevo Cliente", "Client Name*" → "Nombre del Cliente*", "Enter client name" → "Ingresa el nombre del cliente", "Email" → "Correo Electrónico", "Phone" → "Teléfono", "Phone number" → "Número de teléfono", "Address" → "Dirección", "Client address" → "Dirección del cliente", "Cancel" → "Cancelar", "Update Client" → "Actualizar Cliente", "Create Client" → "Crear Cliente", mensajes de validación |

### 3. Módulo de Proyectos (Projects)

| Archivo | Textos a Traducir |
|---------|-------------------|
| `ProjectForm.tsx` | "Loading Project..." → "Cargando Proyecto..." |
| `ProjectInfoCard.tsx` | "Project Information" → "Información del Proyecto", "Project Name" → "Nombre del Proyecto", "Enter project name" → "Ingresa el nombre del proyecto", "Client" → "Cliente", "Enter client name" → "Ingresa el nombre del cliente", "Status" → "Estado", "Select a status" → "Selecciona un estado" |
| `TimelineBudgetCard.tsx` | Revisar etiquetas de fechas y presupuesto |
| `projectColumns.tsx` | "Project Name" → "Nombre del Proyecto", "Client" → "Cliente", "Status" → "Estado", "Progress" → "Progreso", "Due Date" → "Fecha de Entrega", "Budget" → "Presupuesto", "Actions" → "Acciones", "View Details" → "Ver Detalles" |
| `FormActions.tsx` | "Cancel" → "Cancelar", "Updating..." → "Actualizando...", "Creating..." → "Creando...", "Update Project" → "Actualizar Proyecto", "Create Project" → "Crear Proyecto" |

### 4. Módulo de Configuración (Settings)

| Archivo | Textos a Traducir |
|---------|-------------------|
| `AccountTab.tsx` | "Personal Information" → "Información Personal", "Update your account details..." → "Actualiza los detalles de tu cuenta...", "Email" → "Correo Electrónico", "Your email address is used for login..." → "Tu correo electrónico se usa para iniciar sesión...", "Full Name" → "Nombre Completo", "Enter your full name" → "Ingresa tu nombre completo", "Company" → "Empresa", "Enter your company name" → "Ingresa el nombre de tu empresa", "Bio" → "Biografía", "Write a short bio..." → "Escribe una breve biografía...", "Saving..." → "Guardando...", "Save Changes" → "Guardar Cambios", "Password" → "Contraseña", "Update your password..." → "Actualiza tu contraseña...", "Current Password" → "Contraseña Actual", "New Password" → "Nueva Contraseña", "Confirm New Password" → "Confirmar Nueva Contraseña", "Update Password" → "Actualizar Contraseña" |
| `NotificationsTab.tsx` | "Notification Preferences" → "Preferencias de Notificaciones", "Configure how you receive notifications" → "Configura cómo recibes notificaciones", "Email Notifications" → "Notificaciones por Correo", "Receive notifications via email" → "Recibir notificaciones por correo", "Project Updates" → "Actualizaciones de Proyectos", "Get notified about changes..." → "Recibe notificaciones sobre cambios...", "Invoice Reminders" → "Recordatorios de Facturas", "Receive reminders about..." → "Recibe recordatorios sobre...", "Marketing Emails" → "Correos de Marketing", "Receive updates about new features..." → "Recibe actualizaciones sobre nuevas funciones...", "SMS Notifications" → "Notificaciones SMS", "Receive important notifications via SMS" → "Recibe notificaciones importantes por SMS", "Save Notification Settings" → "Guardar Preferencias de Notificaciones" |
| `PreferencesTab.tsx` | "Display Settings" → "Configuración de Visualización", "Customize the appearance..." → "Personaliza la apariencia...", "Dark Mode" → "Modo Oscuro", "Enable dark mode for reduced eye strain..." → "Activa el modo oscuro para reducir la fatiga visual...", "Compact View" → "Vista Compacta", "Display more content per page..." → "Muestra más contenido por página...", "Save Preferences" → "Guardar Preferencias", "Default Views" → "Vistas Predeterminadas", "Configure your default views..." → "Configura tus vistas predeterminadas...", "Default Dashboard View" → "Vista de Panel Predeterminada", "Overview" → "Resumen", "Projects" → "Proyectos", "Finances" → "Finanzas", "Custom" → "Personalizado", "Default Project View" → "Vista de Proyecto Predeterminada", "Grid" → "Cuadrícula", "List" → "Lista", "Kanban" → "Kanban", "Save View Settings" → "Guardar Configuración de Vistas" |

### 5. Mensajes de Toast y Errores Globales

| Ubicación | Textos a Traducir |
|-----------|-------------------|
| `InvoicesPage.tsx` | "You need to be logged in to view invoices" → "Debes iniciar sesión para ver las facturas", "Failed to load invoices" → "Error al cargar las facturas" |
| Mensajes de éxito | "Password updated successfully" → "Contraseña actualizada exitosamente", "Default views updated successfully" → "Vistas predeterminadas actualizadas exitosamente" |

### 6. Componentes de Proyectos Detalle

| Archivo | Textos a Traducir |
|---------|-------------------|
| `BudgetSection.tsx` | Botones de editar/cancelar |
| `HoursSection.tsx` | Botones de editar/cancelar |
| `TeamInfoSection.tsx` | "Team" → "Equipo", "team members assigned" → "miembros del equipo asignados" |
| `TimelineSection.tsx` | "Timeline" → "Cronograma" |

---

## Resumen de Cambios

| Categoría | Archivos a Modificar |
|-----------|---------------------|
| Facturas | 7 archivos |
| Clientes | 1 archivo |
| Proyectos | 5 archivos |
| Configuración | 3 archivos |
| Componentes Detalle | 4 archivos |
| **Total** | **~20 archivos** |

---

## Estrategia de Implementación

1. **Fase 1**: Traducir formularios principales (InvoiceForm, ClientForm, ProjectForm)
2. **Fase 2**: Traducir componentes de configuración (AccountTab, NotificationsTab, PreferencesTab)
3. **Fase 3**: Traducir columnas de tablas y filtros
4. **Fase 4**: Traducir mensajes de error, validación y toast
5. **Fase 5**: Verificar consistencia en toda la aplicación

---

## Notas Importantes

- El código ya usa el formato de moneda colombiana (COP) en las propuestas
- La navegación principal (sidebar) ya está en español
- Se mantendrá la consistencia con los términos ya usados en otras partes de la app
- Los estados de propuestas (Borrador, Enviada, Aprobada, Rechazada) se mantendrán como están
