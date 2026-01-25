
# Plan: Agente Contable IA con Voz para AutoSeguro DJ

## Resumen Ejecutivo

Vamos a agregar un **Agente Contable Conversacional con Voz** que:
- Asesora sobre normativa tributaria colombiana (DIAN, beneficios fiscales)
- Consulta listas restrictivas (OFAC/Clinton, ONU, UE) para compliance
- Accede a los datos de tu CRM en Supabase
- Se integra con Aliaddo para sincronización contable
- Usa ElevenLabs para interacción por voz

---

## Arquitectura Propuesta

```text
┌─────────────────────────────────────────────────────────────────┐
│                    TU CRM ACTUAL (Frontend)                      │
│   React + Tailwind + Supabase Client                            │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  NUEVO: Componente AgentChat                             │  │
│   │  - Widget flotante en esquina inferior derecha           │  │
│   │  - Chat de texto + botón de voz                          │  │
│   │  - Historial de conversaciones                           │  │
│   └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               EDGE FUNCTIONS (Backend Seguro)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────┐  ┌────────────────────────────────────┐ │
│  │ agent-chat         │  │ agent-voice                        │ │
│  │ (Orquestador)      │  │ (ElevenLabs TTS/STT)               │ │
│  └─────────┬──────────┘  └────────────────────────────────────┘ │
│            │                                                     │
│  ┌─────────▼──────────────────────────────────────────────────┐ │
│  │               HERRAMIENTAS DEL AGENTE                      │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ 1. query_database     → Consulta Supabase (finanzas,       │ │
│  │                         clientes, facturas, proyectos)     │ │
│  │                                                            │ │
│  │ 2. check_sanctions    → Consulta listas OFAC/Clinton       │ │
│  │                         vía API (OFAC-API.com o TusDatos)  │ │
│  │                                                            │ │
│  │ 3. tax_advisor        → Analiza datos + normativa DIAN     │ │
│  │                         (beneficios, deducciones, plazos)  │ │
│  │                                                            │ │
│  │ 4. sync_aliaddo       → Exporta/importa datos con Aliaddo  │ │
│  │                         (CSV/API REST si disponible)       │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICIOS EXTERNOS                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────────┐  │
│  │ Lovable AI    │  │ ElevenLabs    │  │ OFAC-API.com        │  │
│  │ (LLM gratuito)│  │ (Voz)         │  │ (Listas Clinton)    │  │
│  └───────────────┘  └───────────────┘  └─────────────────────┘  │
│                                                                  │
│  ┌───────────────┐  ┌───────────────────────────────────────┐   │
│  │ Aliaddo       │  │ Tu Base de Datos Supabase             │   │
│  │ (API/CSV)     │  │ (clientes, facturas, gastos, etc)     │   │
│  └───────────────┘  └───────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fases de Implementación

### FASE 1: Agente Base con Chat de Texto (Semana 1)

**Objetivo**: Chat funcional con acceso a base de datos y asesoría fiscal básica

#### 1.1 Edge Function: agent-chat
- Usa **Lovable AI** (Gemini 3 Flash) - ya disponible sin API key
- Sistema de "tool calling" para consultar datos
- Prompt especializado en normativa colombiana (DIAN, NIIF)

#### 1.2 Herramienta: query_database
Permite al agente consultar:
- Resumen financiero (ingresos, gastos, retenciones del período)
- Clientes y su historial
- Facturas pendientes/pagadas
- Proyectos activos y su rentabilidad

#### 1.3 Herramienta: tax_advisor
Knowledge base con:
- Calendario tributario DIAN (IVA, Renta, ICA)
- Beneficios fiscales aplicables (zonas francas, descuentos por pronto pago)
- Tu configuración actual de retenciones (ya la tienes implementada)
- Cálculo automático de deducciones optimizadas

#### 1.4 Componente Frontend: AgentChatWidget
- Widget flotante en esquina inferior derecha
- Diseño consistente con tu UI actual
- Historial de conversaciones persistente en Supabase

**Archivos a crear**:
| Archivo | Descripción |
|---------|-------------|
| `supabase/functions/agent-chat/index.ts` | Orquestador principal del agente |
| `src/components/agent/AgentChatWidget.tsx` | Widget flotante de chat |
| `src/components/agent/hooks/useAgentChat.ts` | Hook para streaming de respuestas |
| `src/components/agent/AgentMessage.tsx` | Componente de mensaje |

---

### FASE 2: Consulta de Listas Restrictivas (Semana 2)

**Objetivo**: Verificar clientes/proveedores en listas OFAC, ONU, UE

#### 2.1 Herramienta: check_sanctions
Opciones de API:
- **OFAC-API.com**: $0.01 por consulta, cobertura global
- **TusDatos.co**: Servicio colombiano, incluye bases locales (Procuraduría, Contraloría)

#### 2.2 Flujo de verificación
```text
Usuario pregunta: "¿El cliente Juan Pérez está en listas restrictivas?"
         │
         ▼
┌─────────────────────────────────────────┐
│ Agente extrae: nombre, documento (si hay)│
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Consulta API de sanciones               │
│ - OFAC SDN List                         │
│ - Lista ONU de sanciones                │
│ - Lista UE consolidada                  │
│ - Procuraduría Colombia (opcional)      │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Respuesta con:                          │
│ - Estado: ✅ Limpio / ⚠️ Coincidencia   │
│ - Detalles de la coincidencia (si hay)  │
│ - Recomendación de acción               │
│ - Fuente verificable (link)             │
└─────────────────────────────────────────┘
```

#### 2.3 Tabla de auditoría
Nueva tabla `sanctions_checks` para mantener historial de verificaciones (cumplimiento SARLAFT)

---

### FASE 3: Integración con Voz - ElevenLabs (Semana 3)

**Objetivo**: Interacción conversacional por voz

#### 3.1 Edge Function: agent-voice
- **Text-to-Speech (TTS)**: El agente responde con voz
- **Speech-to-Text (STT)**: El usuario puede hablar
- Modelo: `eleven_multilingual_v2` (soporta español)

#### 3.2 Flujo de voz
```text
┌─────────────────────────────────────────┐
│ Usuario presiona botón 🎤               │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Captura audio del micrófono             │
│ (Web Audio API)                         │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Edge Function: agent-voice              │
│ 1. Transcribe audio (ElevenLabs STT)    │
│ 2. Procesa con Lovable AI               │
│ 3. Genera respuesta de voz (TTS)        │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Reproduce audio de respuesta            │
│ + Muestra texto en el chat              │
└─────────────────────────────────────────┘
```

#### 3.3 Componente: VoiceButton
- Botón de micrófono en el widget
- Indicador visual de grabación
- Reproducción automática de respuestas

**Archivos a crear**:
| Archivo | Descripción |
|---------|-------------|
| `supabase/functions/agent-voice/index.ts` | TTS y STT con ElevenLabs |
| `src/components/agent/VoiceButton.tsx` | Botón de grabación |
| `src/components/agent/hooks/useVoiceRecording.ts` | Hook de captura de audio |

---

### FASE 4: Integración con Aliaddo (Semana 4)

**Objetivo**: Sincronización bidireccional con software contable

#### 4.1 Análisis de Aliaddo
Según la documentación, Aliaddo ofrece:
- **API REST** para facturación electrónica
- **Archivos planos (CSV)** para importación masiva
- Cumplimiento DIAN integrado

#### 4.2 Estrategia de integración
```text
┌─────────────────────────────────────────────────────────────────┐
│                    SINCRONIZACIÓN                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   TU CRM (Supabase)              ALIADDO                        │
│   ┌──────────────┐               ┌──────────────┐               │
│   │ Facturas     │ ──────────────▶ │ FE DIAN     │               │
│   │ Clientes     │ ──────────────▶ │ Terceros    │               │
│   │ Gastos       │ ──────────────▶ │ Documentos  │               │
│   └──────────────┘               └──────────────┘               │
│          ▲                              │                        │
│          │                              ▼                        │
│   ┌──────────────┐               ┌──────────────┐               │
│   │ Reportes     │ ◀────────────── │ Contabilidad│               │
│   │ Saldos       │ ◀────────────── │ Balance     │               │
│   └──────────────┘               └──────────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.3 Implementación
- **Exportación**: Genera CSV/JSON compatible con Aliaddo desde tus datos
- **Importación**: Lee reportes de Aliaddo para mostrar en tu dashboard
- **Opcional**: Integración directa vía API REST si Aliaddo lo soporta en tu plan

**Archivos a crear**:
| Archivo | Descripción |
|---------|-------------|
| `supabase/functions/aliaddo-sync/index.ts` | Sincronización con Aliaddo |
| `src/components/settings/AliadoIntegration.tsx` | Configuración en Settings |

---

## Tabla de Base de Datos Nueva

```sql
-- Historial de conversaciones del agente
CREATE TABLE agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Verificaciones de listas restrictivas (auditoría SARLAFT)
CREATE TABLE sanctions_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entity_name TEXT NOT NULL,
  entity_document TEXT,
  entity_type TEXT NOT NULL DEFAULT 'person', -- 'person' o 'company'
  result TEXT NOT NULL, -- 'clean', 'match', 'possible_match'
  details JSONB,
  checked_lists TEXT[] NOT NULL, -- ['OFAC', 'UN', 'EU', etc]
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS para ambas tablas
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sanctions_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own conversations"
  ON agent_conversations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sanctions checks"
  ON sanctions_checks FOR ALL USING (auth.uid() = user_id);
```

---

## Secrets/API Keys Necesarios

| Secret | Servicio | Costo Estimado | Obligatorio |
|--------|----------|----------------|-------------|
| `LOVABLE_API_KEY` | Lovable AI | Ya incluido | ✅ Ya configurado |
| `ELEVENLABS_API_KEY` | ElevenLabs | ~$5-22/mes | ✅ Para voz |
| `OFAC_API_KEY` | OFAC-API.com | ~$0.01/consulta | ⚠️ Para listas restrictivas |
| `ALIADDO_API_KEY` | Aliaddo | Según tu plan | ⚠️ Para sincronización |

---

## Prompt del Agente (Sistema)

```text
Eres el Asistente Contable de AutoSeguro DJ, una empresa colombiana de blindaje 
de vehículos que también ofrece servicios de compra-venta de autos, trámites, 
seguros y detailing.

TU ROL:
- Asesorar sobre normativa tributaria colombiana (DIAN, NIIF para Pymes)
- Calcular retenciones según el Régimen Común (Rete-Fuente, Rete-IVA, ICA Bogotá 0.5%)
- Identificar beneficios fiscales aplicables
- Verificar clientes/proveedores en listas restrictivas (OFAC, ONU, UE)
- Responder consultas sobre los datos financieros de la empresa

CONFIGURACIÓN FISCAL ACTUAL:
- Régimen: Común
- Municipio: Bogotá
- IVA: 19%
- ICA: 0.5%
- Rete-IVA: 50% del IVA

HERRAMIENTAS DISPONIBLES:
1. query_database: Consulta datos de clientes, facturas, proyectos, gastos
2. check_sanctions: Verifica personas/empresas en listas restrictivas
3. calculate_taxes: Calcula retenciones e impuestos

ESTILO DE COMUNICACIÓN:
- Profesional pero cercano
- Respuestas claras y concisas
- Siempre cita la fuente normativa cuando sea relevante
- Si hay riesgo de compliance, advierte inmediatamente
```

---

## Ejemplo de Interacción

```text
👤 Usuario: "¿Cuánto IVA descontable tengo acumulado este año?"

🤖 Agente: [Ejecuta query_database]
   Consultando gastos del período enero-diciembre 2025...

   📊 Resumen de IVA Descontable:
   
   Total Valor Bruto Gastos: $45,230,000 COP
   IVA Pagado: $8,593,700 COP
   Rete-IVA Practicado: $4,296,850 COP
   
   ✅ IVA Descontable Neto: $4,296,850 COP
   
   💡 Recomendación: Este valor lo puedes descontar en tu próxima 
   declaración de IVA. Recuerda que el vencimiento para el bimestre 
   actual es el 15 del mes siguiente.

👤 Usuario: "Quiero verificar al proveedor Carlos Mendoza"

🤖 Agente: [Ejecuta check_sanctions con nombre "Carlos Mendoza"]
   
   🔍 Verificación de Listas Restrictivas
   
   Nombre: Carlos Mendoza
   Listas consultadas: OFAC SDN, ONU, UE, Procuraduría Colombia
   
   ✅ Resultado: SIN COINCIDENCIAS
   
   Este proveedor no aparece en las listas de sanciones consultadas.
   Fecha de verificación: 25/01/2026
   
   📝 Se ha guardado un registro de esta verificación para cumplimiento SARLAFT.
```

---

## Consideraciones Técnicas

### Seguridad
- El agente **solo puede leer** datos del usuario autenticado (RLS)
- Las consultas a APIs externas se hacen desde Edge Functions (secrets seguros)
- Historial de conversaciones encriptado en tránsito y reposo

### Rendimiento
- Streaming de respuestas para mejor UX
- Cache de consultas frecuentes (resumen financiero)
- Audio comprimido para respuestas de voz

### Costos Estimados Mensuales
| Servicio | Uso Estimado | Costo |
|----------|--------------|-------|
| Lovable AI | ~500 consultas | Incluido en plan |
| ElevenLabs | ~100 minutos audio | ~$5-11 |
| OFAC-API | ~50 verificaciones | ~$0.50 |
| **Total** | | **~$6-12/mes** |

---

## Próximos Pasos

1. **Confirma** si quieres proceder con la Fase 1 (chat de texto)
2. **Conecta ElevenLabs** usando el conector disponible (lo haré automáticamente)
3. **Decide** qué servicio de listas restrictivas prefieres:
   - OFAC-API.com (internacional, más completo)
   - TusDatos.co (colombiano, incluye bases locales)

¿Apruebas este plan para comenzar con la implementación?
