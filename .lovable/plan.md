

# Plan: Integrar ElevenLabs para Interacción por Voz

## Objetivo

Agregar capacidades de voz al Asistente Contable para que:
1. **El usuario pueda hablar** (Speech-to-Text) en lugar de escribir
2. **El asistente responda con voz** (Text-to-Speech) de forma natural en español

## Arquitectura de la Solución

```text
┌─────────────────────────────────────────────────────────────────┐
│                    Widget del Agente                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ 🎤 Grabar   │───→│ STT Edge   │───→│ Texto para  │         │
│  │   Audio     │    │ Function    │    │ el chat     │         │
│  └─────────────┘    └─────────────┘    └──────┬──────┘         │
│                                               │                 │
│                                               ▼                 │
│                                        agent-chat               │
│                                               │                 │
│                                               ▼                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ 🔊 Reproducir│◀───│ TTS Edge   │◀───│ Respuesta   │         │
│  │   Audio     │    │ Function    │    │ del agente  │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Componentes a Crear

### 1. Edge Function: `agent-voice`

Maneja tanto Speech-to-Text como Text-to-Speech con ElevenLabs.

| Endpoint | Método | Función |
|----------|--------|---------|
| `/tts` | POST | Convierte texto a audio (voz del asistente) |
| `/stt` | POST | Convierte audio a texto (entrada del usuario) |

### 2. Hook: `useAgentVoice`

Nuevo hook que maneja:
- Grabación de audio del micrófono
- Envío a la Edge Function para transcripción
- Reproducción de respuestas de voz
- Estados de carga y errores

### 3. Actualizar Widget de Chat

Agregar botones para:
- 🎤 Grabar mensaje de voz
- 🔊 Reproducir respuesta del asistente

## Detalles Técnicos

### Edge Function `agent-voice`

```text
Archivo: supabase/functions/agent-voice/index.ts

Funcionalidades:
├── POST /tts
│   ├── Recibe: { text: string, voice_id?: string }
│   ├── Llama: ElevenLabs TTS API
│   └── Retorna: Audio MP3 binario
│
└── POST /stt
    ├── Recibe: FormData con archivo de audio
    ├── Llama: ElevenLabs STT API (scribe_v2)
    └── Retorna: { text: string }
```

### Configuración de Voz

| Parámetro | Valor |
|-----------|-------|
| Modelo TTS | `eleven_multilingual_v2` (soporta español) |
| Voz sugerida | Roger (CwhRBWXzGAHq8TQ4Fs17) - profesional |
| Modelo STT | `scribe_v2` (alta precisión) |
| Idioma | Español (detección automática) |

### Hook `useAgentVoice`

```text
Archivo: src/components/agent/hooks/useAgentVoice.ts

Estados:
├── isRecording: boolean
├── isTranscribing: boolean
├── isSpeaking: boolean
└── error: string | null

Métodos:
├── startRecording(): Promise<void>
├── stopRecording(): Promise<string> (retorna transcripción)
├── speakText(text: string): Promise<void>
└── stopSpeaking(): void
```

### Actualización del Widget

```text
Archivo: src/components/agent/AgentChatWidget.tsx

Nuevos elementos:
├── Botón de micrófono (junto al input)
├── Botón de reproducir voz (en cada respuesta)
├── Indicador visual de grabación
└── Control de volumen (opcional)
```

## Flujo de Usuario

### Enviar mensaje por voz:
1. Usuario presiona 🎤
2. Aparece indicador de grabación (onda de audio)
3. Usuario habla su consulta
4. Al soltar, se envía a STT
5. Texto transcrito aparece en el input
6. Se envía automáticamente al agente

### Escuchar respuesta:
1. Respuesta del agente llega como texto
2. Automáticamente (o con botón) se envía a TTS
3. Se reproduce el audio
4. Indicador visual de "hablando"

## Archivos a Crear/Modificar

| Archivo | Acción |
|---------|--------|
| `supabase/functions/agent-voice/index.ts` | Crear |
| `supabase/config.toml` | Actualizar (agregar función) |
| `src/components/agent/hooks/useAgentVoice.ts` | Crear |
| `src/components/agent/AgentChatWidget.tsx` | Modificar |
| `src/components/agent/VoiceIndicator.tsx` | Crear (opcional) |

## Resultado Esperado

1. **Entrada por voz**: El usuario puede mantener presionado el botón del micrófono y hablar su consulta en español
2. **Salida por voz**: Las respuestas del asistente se pueden escuchar con voz natural
3. **Experiencia fluida**: Indicadores visuales claros durante grabación y reproducción
4. **Fallback a texto**: Si hay error de voz, el chat de texto sigue funcionando

