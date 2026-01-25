import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { Message } from "./hooks/useAgentChat";

interface AgentMessageProps {
  message: Message;
}

export function AgentMessage({ message }: AgentMessageProps) {
  const isAssistant = message.role === "assistant";

  // Formatear el contenido para renderizar código JSON correctamente
  const formatContent = (content: string) => {
    // Detectar bloques de código JSON
    const codeBlockRegex = /```json\n([\s\S]*?)\n```/g;
    const parts: Array<{ type: "text" | "code"; content: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: content.slice(lastIndex, match.index) });
      }
      parts.push({ type: "code", content: match[1] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: "text", content: content.slice(lastIndex) });
    }

    if (parts.length === 0) {
      parts.push({ type: "text", content });
    }

    return parts;
  };

  const formattedParts = formatContent(message.content);

  return (
    <div
      className={cn(
        "flex gap-3 p-3 rounded-lg",
        isAssistant ? "bg-muted/50" : "bg-primary/10"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isAssistant ? "bg-primary text-primary-foreground" : "bg-secondary"
        )}
      >
        {isAssistant ? (
          <Bot className="w-4 h-4" />
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="text-xs text-muted-foreground mb-1">
          {isAssistant ? "Asistente Contable" : "Tú"} •{" "}
          {message.timestamp.toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {formattedParts.map((part, index) =>
            part.type === "code" ? (
              <pre
                key={index}
                className="bg-muted p-3 rounded-md overflow-x-auto text-xs"
              >
                <code>{part.content}</code>
              </pre>
            ) : (
              <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed">
                {part.content}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
