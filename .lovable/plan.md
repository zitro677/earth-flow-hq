
Objetivo: que el inicio de sesión con Google funcione de forma consistente en **Preview** (incluyendo cuando pruebas dentro del editor) usando **tus propias credenciales de Google**, y dejarlo estable también para Producción.

Contexto (lo que sabemos):
- El 403 ocurre **solo en Preview**.
- Con credenciales “gestionadas” no se puede corregir la lista interna de dominios permitidos, así que la vía “definitiva” es **usar tus credenciales** + ajustar el flujo para que funcione aunque el Preview esté embebido.
- Ya añadimos `scopes: 'email profile'`, eso está bien y lo mantenemos.

-------------------------------------------------------------------------------

1) Paso a paso: crear credenciales OAuth en Google (Console)

A. Crear/seleccionar proyecto
1. Entra a Google Cloud Console.
2. Selecciona un proyecto existente o crea uno nuevo (recomendado: uno dedicado para tu app).

B. Configurar la pantalla de consentimiento (OAuth consent screen)
1. Ve a “APIs & Services” → “OAuth consent screen”.
2. Tipo de usuario:
   - Elige “External” (para cuentas Gmail normales).
3. Completa lo mínimo:
   - App name (nombre visible)
   - User support email
   - Developer contact email
4. Scopes:
   - Asegura los básicos: `openid`, `email`, `profile`
   - No agregues scopes “sensibles/restringidos” si no los necesitas.
5. Test users (muy importante si está en modo Testing):
   - Agrega tu email: `zitro677.lo87@gmail.com`
6. Guarda.

Notas:
- Si dejas la app en “Testing”, solo los “Test users” podrán entrar.
- Si quieres que cualquiera entre, tendrás que “Publish” la app (y cumplir requisitos de Google).

C. Crear el OAuth Client ID (Web application)
1. Ve a “APIs & Services” → “Credentials”.
2. “Create credentials” → “OAuth client ID”.
3. Application type: “Web application”.

D. Authorized JavaScript origins (añade estos 3)
Añade exactamente estos orígenes (sin paths):
- Preview (público): `https://id-preview--d93b01bb-1e54-40e6-9569-44d4509b1500.lovable.app`
- Preview dentro del editor: `https://d93b01bb-1e54-40e6-9569-44d4509b1500.lovableproject.com`
- Producción: `https://earth-flow-hq.lovable.app`

E. Authorized redirect URIs (NO lo inventes: cópialo del backend)
Aquí es donde más se equivoca la gente:
- El “redirect URI” correcto es el que usa el **backend de autenticación**, no “/auth/callback” en tu frontend.
- Para obtenerlo:
  1) Abre tu Backend (Lovable Cloud) y entra a la configuración de Google (paso 2 de este plan).
  2) Copia el campo que normalmente aparece como “Redirect URL / Callback URL”.
  3) Pégalo en “Authorized redirect URIs” en Google Cloud Console.

F. Copia valores
- Guarda el **Client ID** y **Client Secret** (los usarás en Lovable Cloud).

Checklist rápido de Google Console:
- [ ] Consent screen: External
- [ ] Test user agregado: `zitro677.lo87@gmail.com` (si está en Testing)
- [ ] OAuth Client ID: Web application
- [ ] 3 JavaScript origins añadidos (preview público, preview editor, producción)
- [ ] Redirect URI copiado del backend (no del frontend)

-------------------------------------------------------------------------------

2) Paso a paso: pegar Client ID/Secret en Lovable Cloud (Backend)

Cómo abrir el backend:
- Desktop: en la barra superior del editor, abre la vista “Cloud/Backend” (a veces está fijada; si no, está en “More”).
- Móvil: entra en modo Preview, toca el botón “…” y busca la opción para abrir “Cloud/Backend”.

Luego:
1. Ve a: Users → Auth Settings → Sign In Methods.
2. En “Google”:
   - Activa el toggle “ON”.
   - Selecciona “Use custom credentials” (o similar, según aparezca).
   - Pega:
     - Client ID
     - Client Secret
   - Guarda.

3. En esa misma pantalla, localiza el “Redirect URL / Callback URL” que el backend muestra.
   - Copia ese valor y úsalo en Google Console (paso 1.E).

Checklist backend:
- [ ] Google ON
- [ ] Client ID y Secret pegados
- [ ] Guardado aplicado
- [ ] Redirect URL copiado para Google Console

-------------------------------------------------------------------------------

3) Arreglo definitivo para Preview: evitar problemas por iframe (cambio de código)

Problema frecuente: el Preview dentro del editor corre embebido; algunos flujos OAuth se comportan mal ahí.

Solución robusta:
- Detectar si la app está corriendo dentro de un iframe.
- Si está en iframe:
  - Pedir al SDK la URL de OAuth sin redirigir automáticamente (`skipBrowserRedirect: true`)
  - Abrir esa URL en una pestaña nueva (`window.open(...)`)

Cambios propuestos (archivo existente):
- `src/components/auth/hooks/useLoginForm.tsx`
  - Mantener `scopes: 'email profile'`
  - Agregar:
    - `skipBrowserRedirect: true` cuando esté en iframe
    - `window.open(data.url, '_blank', 'noopener,noreferrer')` si hay `data.url`

Comportamiento esperado:
- Desde el Preview embebido, al tocar “Login con Google”, se abre una pestaña nueva para completar el login.
- Al volver, quedas autenticado y el Preview ya no falla con 403.

-------------------------------------------------------------------------------

4) Pruebas (paso a paso) para confirmar que quedó bien

1. En Google Console:
   - Verifica que el “OAuth Client” sea el que pegaste en Lovable Cloud.
2. En tu navegador:
   - Abre una ventana incógnito.
3. Prueba en este orden:
   A) Preview público (en pestaña normal):
      - `https://id-preview--d93b01bb-1e54-40e6-9569-44d4509b1500.lovable.app/auth`
   B) Preview dentro del editor:
      - botón Google → debe abrir pestaña nueva (tras el cambio de código)
   C) Producción:
      - `https://earth-flow-hq.lovable.app/auth`

Si aún aparece 403:
- Captura el texto exacto de la pantalla 403 (una frase completa) y la URL del navegador en esa pantalla.
- Con eso se determina si es “access_denied”, “app blocked”, “origin mismatch”, “redirect mismatch” u otra política de Google.

-------------------------------------------------------------------------------

5) Entregables (lo que haré cuando pases a modo implementación)
- Implementar el manejo “iframe-safe” en `useLoginForm.tsx` usando `skipBrowserRedirect`.
- Mantener `scopes: 'email profile'`.
- (Opcional) Mostrar un mensaje/toast tipo: “Abrimos una pestaña nueva para continuar con Google”.

Riesgos/consideraciones
- Si tu consentimiento está en “Testing” y no agregas tu email como Test user, seguirá fallando.
- Si el Redirect URI no se copia del backend exactamente, seguirá fallando.
- El Preview del editor usa un dominio distinto al Preview público; por eso hay que autorizar ambos orígenes.

Criterio de éxito
- Login con Google funciona en Preview (público y dentro del editor) y en Producción, sin 403.
