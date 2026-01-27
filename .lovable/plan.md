
## Objetivo
Hacer que el botón de micrófono sea visible siempre dentro del widget del agente (especialmente en pantallas pequeñas), sin romper la UI en desktop.

---

## Hallazgos (qué está pasando)
- En el código **sí existe** el botón del micrófono dentro del formulario del chat (en `AgentChatWidget.tsx`, líneas 310–327).
- El contenedor del widget tiene un ancho fijo `w-96` (384px) y está anclado con `right-6`.
- En móviles comunes (360px de ancho), el widget queda **parcialmente fuera de pantalla hacia la izquierda**. En ese caso, el primer elemento del input (el botón del micrófono, que va a la izquierda) es justamente lo que puede quedar “cortado”, mientras el input y el botón de enviar (a la derecha) sí se alcanzan a ver.
- Por eso tu percepción es “no aparece el botón”, aunque técnicamente se está renderizando.

---

## Solución propuesta (UI responsive del widget)
### A) Hacer el widget responsive (ancho y posición)
Actualizar `AgentChatWidget.tsx` para que:
- En pantallas pequeñas use `left-4 right-4` (inset horizontal) y ancho flexible (no fijo).
- En pantallas medianas/grandes conserve el comportamiento actual (`right-6` y `w-96`).

Implementación esperada (a alto nivel):
- Importar `useIsMobile` desde `src/hooks/use-mobile.tsx`
- Calcular `const isMobile = useIsMobile()`
- Cambiar el `className` del contenedor principal (`motion.div`) para que sea condicional

Ejemplo de clases objetivo:
- Mobile:
  - `fixed bottom-4 left-4 right-4 w-auto max-w-none`
- Desktop:
  - `fixed bottom-6 right-6 w-96`

También ajustar, si hace falta, para evitar que el contenido interno colapse:
- Al `Input` darle `min-w-0` (o asegurar que el contenedor del input no provoque overflow raro).
- Mantener `z-50` para que no quede detrás del sidebar.

### B) Asegurar que el botón se vea incluso si el navegador no soporta grabación
En algunos dispositivos (sobre todo ciertos Safari/iOS antiguos), `MediaRecorder` puede no existir. Eso NO debería ocultar el botón; pero para una UX clara:
- Calcular `supportsVoice`:
  - `navigator.mediaDevices?.getUserMedia` existe
  - `window.MediaRecorder` existe
- Si no soporta, mostrar el botón igualmente pero deshabilitado y con tooltip tipo “Tu navegador no soporta grabación de audio”.

Esto evita confusión (botón ausente vs botón deshabilitado).

---

## Pasos de implementación (código)
1. Editar `src/components/agent/AgentChatWidget.tsx`
   - Importar `useIsMobile`
   - Calcular `isMobile`
   - Modificar clases del contenedor principal del widget para mobile/desktop
   - (Opcional recomendado) agregar `supportsVoice` y deshabilitar el botón con un mensaje claro si no hay soporte

2. Verificación visual rápida
   - Probar en viewport angosto (simular móvil) y confirmar:
     - Se ve el botón de micrófono a la izquierda del input
     - No se corta el widget horizontalmente
   - Probar en desktop y confirmar:
     - Se mantiene el ancho 384px y la ubicación actual

---

## Criterios de aceptación
- El botón del micrófono se ve dentro del widget en pantallas pequeñas y grandes.
- En móvil, el widget no queda cortado fuera de pantalla.
- Si el navegador no soporta grabación, el botón sigue visible (deshabilitado) con explicación.

---

## Notas técnicas
- Archivo clave: `src/components/agent/AgentChatWidget.tsx`
- Hook existente y reutilizable: `src/hooks/use-mobile.tsx` (`useIsMobile`)
- No requiere cambios en backend ni en `useAgentVoice` para resolver la visibilidad; el problema es de layout/ancho/posicionamiento.
