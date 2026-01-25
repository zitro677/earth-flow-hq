-- Historial de conversaciones del agente
CREATE TABLE public.agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Verificaciones de listas restrictivas (auditoría SARLAFT)
CREATE TABLE public.sanctions_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entity_name TEXT NOT NULL,
  entity_document TEXT,
  entity_type TEXT NOT NULL DEFAULT 'person',
  result TEXT NOT NULL,
  details JSONB,
  checked_lists TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_agent_conversations_user_id ON public.agent_conversations(user_id);
CREATE INDEX idx_agent_conversations_updated_at ON public.agent_conversations(updated_at DESC);
CREATE INDEX idx_sanctions_checks_user_id ON public.sanctions_checks(user_id);
CREATE INDEX idx_sanctions_checks_entity_name ON public.sanctions_checks(entity_name);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_agent_conversations_updated_at
  BEFORE UPDATE ON public.agent_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS para agent_conversations
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON public.agent_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON public.agent_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON public.agent_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON public.agent_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS para sanctions_checks
ALTER TABLE public.sanctions_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sanctions checks"
  ON public.sanctions_checks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sanctions checks"
  ON public.sanctions_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);