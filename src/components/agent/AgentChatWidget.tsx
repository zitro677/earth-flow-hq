import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Trash2,
  Minimize2,
  Maximize2,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAgentChat } from "./hooks/useAgentChat";
import { useAgentVoice } from "./hooks/useAgentVoice";
import { AgentMessage } from "./AgentMessage";
import { VoiceIndicator } from "./VoiceIndicator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function AgentChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const { messages, isLoading, error, sendMessage, clearMessages } = useAgentChat();
  const { 
    isRecording, 
    isTranscribing, 
    isSpeaking, 
    error: voiceError,
    startRecording, 
    stopRecording, 
    speakText,
    stopSpeaking,
    clearError: clearVoiceError,
  } = useAgentVoice();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastAssistantMessageRef = useRef<string | null>(null);
  const isMobile = useIsMobile();

  // Check if browser supports voice recording
  const supportsVoice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
  }, []);

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus en input cuando se abre
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Auto-speak new assistant messages
  useEffect(() => {
    if (!autoSpeak || messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage.role === 'assistant' && 
      lastMessage.content !== lastAssistantMessageRef.current &&
      !isLoading
    ) {
      lastAssistantMessageRef.current = lastMessage.content;
      speakText(lastMessage.content);
    }
  }, [messages, autoSpeak, isLoading, speakText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");
    await sendMessage(message);
  };

  const handleMicClick = async () => {
    if (isRecording) {
      const transcription = await stopRecording();
      if (transcription) {
        setInputValue(transcription);
        // Auto-send the transcribed message
        await sendMessage(transcription);
      }
    } else {
      clearVoiceError();
      await startRecording();
    }
  };

  const handleSpeakMessage = (content: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(content);
    }
  };

  // Año actual dinámico para las consultas
  const currentYear = new Date().getFullYear();
  
  const quickActions = [
    { label: "📊 Resumen financiero", message: `Dame un resumen financiero completo del año ${currentYear}` },
    { label: "💰 Calcular IVA", message: "¿Cuánto IVA descontable tengo acumulado?" },
    { label: "📋 Facturas pendientes", message: "¿Cuáles son mis facturas pendientes de pago?" },
    { label: "🧮 Retenciones pagadas", message: `¿Cuánto he pagado en retenciones durante ${currentYear}? Desglosa por tipo (Rete-Fuente, Rete-IVA, Rete-ICA)` },
  ];

  const displayError = error || voiceError;

  return (
    <TooltipProvider>
      {/* Botón flotante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={cn(
              "fixed z-50",
              isMobile ? "bottom-4 right-4" : "bottom-6 right-6"
            )}
          >
            <Button
              size="lg"
              className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => setIsOpen(true)}
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "32rem"
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed z-50 bg-background border rounded-xl shadow-2xl overflow-hidden flex flex-col",
              isMobile 
                ? "bottom-4 left-4 right-4 w-auto" 
                : "bottom-6 right-6 w-96",
              isMinimized && "h-auto"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Asistente Contable</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">AutoSeguro DJ</p>
                    {(isRecording || isSpeaking) && (
                      <VoiceIndicator 
                        isActive={true} 
                        type={isRecording ? 'recording' : 'speaking'} 
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  title={autoSpeak ? "Desactivar voz automática" : "Activar voz automática"}
                >
                  {autoSpeak ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={clearMessages}
                  title="Limpiar conversación"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Contenido (oculto cuando minimizado) */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {/* Mensajes */}
                  <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    {messages.length === 0 ? (
                      <div className="space-y-4">
                        <div className="text-center text-muted-foreground py-4">
                          <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">
                            ¡Hola! Soy tu asistente contable. 
                            Puedo ayudarte con consultas fiscales, 
                            cálculos de retenciones y más.
                          </p>
                          <p className="text-xs mt-2 text-muted-foreground/70">
                            🎤 Mantén presionado el micrófono para hablar
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {quickActions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-auto py-2 px-3 justify-start"
                              onClick={() => sendMessage(action.message)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message) => (
                          <div key={message.id} className="group relative">
                            <AgentMessage message={message} />
                            {message.role === 'assistant' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleSpeakMessage(message.content)}
                                title={isSpeaking ? "Detener" : "Escuchar"}
                              >
                                {isSpeaking ? (
                                  <VolumeX className="w-3 h-3" />
                                ) : (
                                  <Volume2 className="w-3 h-3" />
                                )}
                              </Button>
                            )}
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Pensando...</span>
                          </div>
                        )}
                        {isTranscribing && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Transcribiendo...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>

                  {/* Error */}
                  {displayError && (
                    <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm">
                      {displayError}
                    </div>
                  )}

                  {/* Input */}
                  <form onSubmit={handleSubmit} className="p-4 border-t">
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={isRecording ? "destructive" : "outline"}
                            size="icon"
                            onClick={supportsVoice ? handleMicClick : undefined}
                            disabled={!supportsVoice || isLoading || isTranscribing}
                            className={cn(
                              "shrink-0 transition-all",
                              isRecording && "animate-pulse"
                            )}
                          >
                            {isRecording ? (
                              <MicOff className="w-4 h-4" />
                            ) : (
                              <Mic className="w-4 h-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {!supportsVoice 
                            ? "Tu navegador no soporta grabación de audio"
                            : isRecording 
                              ? "Detener grabación" 
                              : "Grabar mensaje de voz"
                          }
                        </TooltipContent>
                      </Tooltip>
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={isRecording ? "Grabando..." : "Escribe o habla tu consulta..."}
                        disabled={isLoading || isRecording || isTranscribing}
                        className="flex-1 min-w-0"
                      />
                      <Button 
                        type="submit" 
                        size="icon"
                        disabled={!inputValue.trim() || isLoading || isRecording}
                        className="shrink-0"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
