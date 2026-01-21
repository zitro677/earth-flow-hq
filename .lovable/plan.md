
# Plan: Cambiar Branding a "AutoseguroDJ S.A.S"

## Resumen
Actualizar todas las referencias de branding de "Landscape Irrigation" / "Green Landscape Irrigation" / "Riego de Paisajes" a **"AutoseguroDJ S.A.S"** en toda la aplicación.

---

## Archivos a Modificar

### 1. Metadatos de la Aplicación
**Archivo:** `index.html`
- Cambiar título de `landscape-lifecycle-manager` a `AutoseguroDJ S.A.S`
- Actualizar meta descripción

### 2. Barra Lateral (Sidebar)
**Archivo:** `src/components/layout/sidebar/SidebarHeader.tsx`
- Cambiar `"Landscape Irrigation"` → `"AutoseguroDJ S.A.S"`

### 3. Página de Login
**Archivo:** `src/components/auth/LoginPage.tsx`
- Cambiar título `"Riego de Paisajes"` → `"AutoseguroDJ S.A.S"`

### 4. Página de Carga/Index
**Archivo:** `src/pages/Index.tsx`
- Cambiar `"Welcome to Landscape Pro"` → `"Bienvenido a AutoseguroDJ S.A.S"`

### 5. Configuración de Usuario
**Archivo:** `src/components/settings/hooks/useSettings.ts`
- Cambiar compañía predeterminada de `"Landscape Irrigation"` → `"AutoseguroDJ S.A.S"`
- Actualizar bio a algo relacionado con blindaje de vehículos

### 6. Generador de PDF de Propuestas (Header)
**Archivo:** `src/components/proposals/utils/pdf/headerSection.ts`
- Cambiar nombre de empresa a `"AutoseguroDJ S.A.S"`
- Actualizar teléfono y email de contacto (necesitamos los datos reales)
- Actualizar URL del sitio web a `www.autosegurodj.com`

### 7. Generador de PDF de Facturas
**Archivo:** `src/components/invoices/InvoicePdfGenerator.tsx`
- Actualizar footer con nuevo nombre de empresa y datos de contacto

### 8. Servicio de Email de Facturas
**Archivo:** `src/components/invoices/InvoiceEmailService.tsx`
- Actualizar nombre de empresa en PDF footer
- Actualizar subject del email
- Actualizar cuerpo del email con nuevo nombre y datos de contacto

### 9. Componente Logo
**Archivo:** `src/components/shared/Logo.tsx`
- Actualizar alt text de `"Company Logo"` → `"AutoseguroDJ S.A.S"`
- (Opcional) Subir un logo propio de AutoseguroDJ

---

## Información Necesaria

Para completar correctamente los datos de contacto en los PDFs y emails, necesitaré:

| Campo | Valor Actual | Valor Nuevo |
|-------|-------------|-------------|
| Nombre | Green Landscape Irrigation | AutoseguroDJ S.A.S |
| Teléfono | (727) 484-5516 | ¿? |
| Email | greenplanetlandscaping01@gmail.com | ¿? |
| Web | www.greenlandscapeirrigation.com | www.autosegurodj.com |

---

## Consideraciones Técnicas

1. **Logo**: El logo actual está en `/lovable-uploads/d13d02a7-c0f4-4b0a-828d-cc566f2b3d02.png`. Si tienes un logo de AutoseguroDJ, puedes subirlo y lo integraré.

2. **Colores**: Los PDFs usan tonos verdes (RGB: 93, 144, 73). ¿Deseas mantener estos colores o cambiarlos a la paleta de AutoseguroDJ?

3. **Idioma**: La página de login ya está en español. Mantendré la consistencia en español.

---

## Próximos Pasos

Una vez aprobado este plan, procederé a modificar todos los archivos listados. Si puedes proporcionar los datos de contacto reales, los incluiré inmediatamente.
