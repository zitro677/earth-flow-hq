import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Sistema prompt para el agente contable colombiano
const SYSTEM_PROMPT = `Eres el Asistente Contable de AutoSeguro DJ, una empresa colombiana de blindaje de vehículos que también ofrece servicios de compra-venta de autos, trámites, seguros y detailing.

TU ROL:
- Asesorar sobre normativa tributaria colombiana (DIAN, NIIF para Pymes)
- Calcular retenciones según el Régimen Común (Rete-Fuente, Rete-IVA, ICA Bogotá 0.5%)
- Identificar beneficios fiscales aplicables
- Verificar clientes/proveedores en listas restrictivas (OFAC, ONU, UE) - próximamente
- Responder consultas sobre los datos financieros de la empresa

CONFIGURACIÓN FISCAL ACTUAL:
- Régimen: Común
- Municipio: Bogotá
- IVA: 19%
- ICA: 0.5%
- Rete-IVA: 50% del IVA (cuando el proveedor es responsable de IVA)

TASAS DE RETENCIÓN EN LA FUENTE:
- Compras generales: 2.5%
- Servicios: 4%
- Arrendamientos: 3.5%
- Transporte y Publicidad: 1%

BENEFICIOS FISCALES DISPONIBLES:
- Descuentos por pronto pago de impuestos (usualmente 10% antes del vencimiento)
- IVA descontable acumulado de compras
- Créditos tributarios por retenciones practicadas

CALENDARIO TRIBUTARIO (principales):
- IVA: Bimestral (meses impares)
- Rete-Fuente: Mensual
- ICA: Bimestral
- Renta: Anual (abril-mayo según NIT)

HERRAMIENTAS DISPONIBLES:
Cuando necesites información de la base de datos, usa las herramientas disponibles.
Puedo consultar: clientes, facturas, proyectos, gastos/expenses e inventario.

IMPORTANTE SOBRE RESPUESTAS:
- Cuando recibas datos de las herramientas, interprétalos y responde en lenguaje natural
- NO muestres JSON crudo al usuario
- Presenta la información de forma clara, amigable y resumida
- Usa formato de texto con emojis para hacer la información más legible
- Formatea los montos en pesos colombianos (COP) con separadores de miles

ESTILO DE COMUNICACIÓN:
- Profesional pero cercano
- Respuestas claras y concisas
- Siempre cita la fuente normativa cuando sea relevante (Art. XX del E.T.)
- Si hay riesgo de compliance, advierte inmediatamente
- Usa emojis para hacer la conversación más amigable 📊💰📋
- Formatea montos en pesos colombianos (COP)`;

// Definición de herramientas para el agente
const TOOLS = [
  {
    type: "function",
    function: {
      name: "query_database",
      description: "Consulta la base de datos para obtener información financiera, clientes, facturas, proyectos o gastos del usuario",
      parameters: {
        type: "object",
        properties: {
          query_type: {
            type: "string",
            enum: ["financial_summary", "clients", "invoices", "projects", "expenses", "inventory"],
            description: "Tipo de consulta a realizar"
          },
          filters: {
            type: "object",
            properties: {
              date_from: { type: "string", description: "Fecha inicio (YYYY-MM-DD)" },
              date_to: { type: "string", description: "Fecha fin (YYYY-MM-DD)" },
              status: { type: "string", description: "Estado del registro" },
              client_id: { type: "string", description: "ID del cliente" }
            }
          }
        },
        required: ["query_type"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "calculate_taxes",
      description: "Calcula retenciones e impuestos según la normativa colombiana",
      parameters: {
        type: "object",
        properties: {
          base_amount: { type: "number", description: "Monto base para el cálculo" },
          calculation_type: {
            type: "string",
            enum: ["iva", "retefuente", "reteiva", "reteica", "full_deductions"],
            description: "Tipo de cálculo a realizar"
          },
          retention_concept: {
            type: "string",
            enum: ["compras", "servicios", "arrendamiento", "transporte"],
            description: "Concepto de retención (para rete-fuente)"
          },
          is_iva_responsible: {
            type: "boolean",
            description: "Si el proveedor es responsable de IVA"
          }
        },
        required: ["base_amount", "calculation_type"]
      }
    }
  }
];

// Tipos para datos
interface ExpenseData {
  valor_bruto?: number;
  amount?: number;
  iva?: number;
  rete_fuente?: number;
  rete_iva?: number;
  rete_ica?: number;
  category?: string;
  expense_date?: string;
}

interface InvoiceData {
  amount?: number;
  status?: string;
  issue_date?: string;
  due_date?: string;
  invoice_number?: string;
  clients?: { name: string };
}

interface ProjectData {
  status?: string;
  budget?: number;
  actual_cost?: number;
  clients?: { name: string };
}

interface InventoryData {
  quantity?: number;
  unit_cost?: number;
  name?: string;
}

interface ClientData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface ToolCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

interface ToolResult {
  tool_call_id: string;
  role: "tool";
  content: string;
}

// Ejecutar herramienta de consulta a base de datos
async function executeQueryDatabase(
  supabase: SupabaseClient,
  userId: string,
  queryType: string,
  filters?: { date_from?: string; date_to?: string; status?: string; client_id?: string }
) {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
  const endOfYear = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
  
  const dateFrom = filters?.date_from || startOfYear;
  const dateTo = filters?.date_to || endOfYear;

  switch (queryType) {
    case "financial_summary": {
      const { data: expensesRaw, error: expError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId)
        .gte("expense_date", dateFrom)
        .lte("expense_date", dateTo);

      const { data: invoicesRaw, error: invError } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", userId)
        .gte("issue_date", dateFrom)
        .lte("issue_date", dateTo);

      if (expError || invError) {
        return { error: "Error consultando datos financieros" };
      }

      const expenses = (expensesRaw || []) as ExpenseData[];
      const invoices = (invoicesRaw || []) as InvoiceData[];

      // Case-insensitive status comparison
      const paidInvoices = invoices.filter(i => i.status?.toLowerCase() === "paid");

      const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.valor_bruto || e.amount || 0), 0);
      const totalIVA = expenses.reduce((sum, e) => sum + Number(e.iva || 0), 0);
      const totalReteFuente = expenses.reduce((sum, e) => sum + Number(e.rete_fuente || 0), 0);
      const totalReteIVA = expenses.reduce((sum, e) => sum + Number(e.rete_iva || 0), 0);
      const totalReteICA = expenses.reduce((sum, e) => sum + Number(e.rete_ica || 0), 0);
      const totalIncome = paidInvoices.reduce((sum, i) => sum + Number(i.amount || 0), 0);

      return {
        periodo: `${dateFrom} a ${dateTo}`,
        ingresos: {
          total: totalIncome,
          cantidad_facturas: paidInvoices.length
        },
        gastos: {
          valor_bruto_total: totalExpenses,
          iva_pagado: totalIVA,
          rete_fuente_practicada: totalReteFuente,
          rete_iva_practicada: totalReteIVA,
          rete_ica_practicada: totalReteICA,
          cantidad_gastos: expenses.length
        },
        beneficios_fiscales: {
          iva_descontable: totalIVA - totalReteIVA,
          credito_renta: totalReteFuente,
          credito_ica: totalReteICA
        },
        utilidad_bruta: totalIncome - totalExpenses
      };
    }

    case "clients": {
      const { data: clientsRaw, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) return { error: "Error consultando clientes" };
      const clients = (clientsRaw || []) as ClientData[];
      return { clientes: clients, total: clients.length };
    }

    case "invoices": {
      let query = supabase
        .from("invoices")
        .select("*, clients(name)")
        .eq("user_id", userId)
        .gte("issue_date", dateFrom)
        .lte("issue_date", dateTo);

      // Case-insensitive status filter
      if (filters?.status) {
        // We need to get all and filter in memory for case-insensitive comparison
      }
      if (filters?.client_id) query = query.eq("client_id", filters.client_id);

      const { data: invoicesRaw, error } = await query.order("issue_date", { ascending: false }).limit(50);

      if (error) return { error: "Error consultando facturas" };
      
      let invoices = (invoicesRaw || []) as InvoiceData[];
      
      // Case-insensitive status filter
      if (filters?.status) {
        const statusLower = filters.status.toLowerCase();
        invoices = invoices.filter(i => i.status?.toLowerCase() === statusLower);
      }

      // Case-insensitive status counting
      const summary = {
        total: invoices.reduce((sum, i) => sum + Number(i.amount || 0), 0),
        cantidad: invoices.length,
        por_estado: {
          paid: (invoicesRaw || []).filter((i: InvoiceData) => i.status?.toLowerCase() === "paid").length,
          pending: (invoicesRaw || []).filter((i: InvoiceData) => i.status?.toLowerCase() === "pending").length,
          draft: (invoicesRaw || []).filter((i: InvoiceData) => i.status?.toLowerCase() === "draft").length
        }
      };
      
      return { facturas: invoices, resumen: summary };
    }

    case "projects": {
      const { data: projectsRaw, error } = await supabase
        .from("projects")
        .select("*, clients(name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) return { error: "Error consultando proyectos" };

      const projects = (projectsRaw || []) as ProjectData[];
      // Case-insensitive status comparison
      const activeProjects = projects.filter(p => p.status?.toLowerCase() === "in_progress");
      const totalBudget = activeProjects.reduce((sum, p) => sum + Number(p.budget || 0), 0);
      const totalActual = activeProjects.reduce((sum, p) => sum + Number(p.actual_cost || 0), 0);

      return {
        proyectos: projects,
        resumen: {
          activos: activeProjects.length,
          presupuesto_total: totalBudget,
          costo_actual_total: totalActual,
          variacion: totalBudget - totalActual
        }
      };
    }

    case "expenses": {
      const query = supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId)
        .gte("expense_date", dateFrom)
        .lte("expense_date", dateTo);

      const { data: expensesRaw, error } = await query.order("expense_date", { ascending: false }).limit(30);

      if (error) return { error: "Error consultando gastos" };

      const expenses = (expensesRaw || []) as ExpenseData[];
      const byCategory = expenses.reduce((acc, e) => {
        const cat = e.category || "general";
        if (!acc[cat]) acc[cat] = { count: 0, total: 0 };
        acc[cat].count++;
        acc[cat].total += Number(e.valor_bruto || e.amount || 0);
        return acc;
      }, {} as Record<string, { count: number; total: number }>);

      return { gastos: expenses, por_categoria: byCategory };
    }

    case "inventory": {
      const { data: inventoryRaw, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("user_id", userId)
        .order("name", { ascending: true });

      if (error) return { error: "Error consultando inventario" };

      const inventory = (inventoryRaw || []) as InventoryData[];
      const totalValue = inventory.reduce((sum, i) => sum + (Number(i.quantity || 0) * Number(i.unit_cost || 0)), 0);
      const lowStock = inventory.filter(i => Number(i.quantity || 0) <= 5);

      return {
        inventario: inventory,
        resumen: {
          items_totales: inventory.length,
          valor_total: totalValue,
          items_bajo_stock: lowStock.length
        }
      };
    }

    default:
      return { error: "Tipo de consulta no reconocido" };
  }
}

// Ejecutar cálculos de impuestos
function executeCalculateTaxes(
  baseAmount: number,
  calculationType: string,
  retentionConcept?: string,
  isIvaResponsible?: boolean
) {
  const IVA_RATE = 0.19;
  const ICA_RATE = 0.005;
  const RETE_IVA_RATE = 0.50;
  
  const RETE_FUENTE_RATES: Record<string, number> = {
    compras: 0.025,
    servicios: 0.04,
    arrendamiento: 0.035,
    transporte: 0.01
  };

  switch (calculationType) {
    case "iva":
      return {
        base: baseAmount,
        iva: baseAmount * IVA_RATE,
        total_con_iva: baseAmount * (1 + IVA_RATE),
        nota: "IVA 19% según Art. 468 del Estatuto Tributario"
      };

    case "retefuente": {
      const rate = RETE_FUENTE_RATES[retentionConcept || "servicios"] || 0.04;
      return {
        base: baseAmount,
        tasa: rate * 100,
        retencion: baseAmount * rate,
        concepto: retentionConcept || "servicios",
        nota: `Rete-Fuente ${rate * 100}% según Art. 392 y ss. del E.T.`
      };
    }

    case "reteiva": {
      const iva = baseAmount * IVA_RATE;
      return {
        base: baseAmount,
        iva: iva,
        rete_iva: iva * RETE_IVA_RATE,
        nota: "Rete-IVA 50% del IVA según Art. 437-1 del E.T."
      };
    }

    case "reteica":
      return {
        base: baseAmount,
        rete_ica: baseAmount * ICA_RATE,
        nota: "Rete-ICA 0.5% para actividades en Bogotá (Acuerdo 352/08)"
      };

    case "full_deductions": {
      const rate = RETE_FUENTE_RATES[retentionConcept || "servicios"] || 0.04;
      const iva = baseAmount * IVA_RATE;
      const reteFuente = baseAmount * rate;
      const reteIva = isIvaResponsible ? iva * RETE_IVA_RATE : 0;
      const reteIca = baseAmount * ICA_RATE;
      const netoPagar = baseAmount + iva - reteFuente - reteIva - reteIca;

      return {
        valor_bruto: baseAmount,
        iva: iva,
        subtotal: baseAmount + iva,
        deducciones: {
          rete_fuente: reteFuente,
          rete_iva: reteIva,
          rete_ica: reteIca,
          total_deducciones: reteFuente + reteIva + reteIca
        },
        neto_a_pagar: netoPagar,
        beneficios_fiscales: {
          iva_descontable: iva - reteIva,
          credito_renta: reteFuente,
          credito_ica: reteIca
        },
        nota: "Cálculo completo según Régimen Común - Bogotá"
      };
    }

    default:
      return { error: "Tipo de cálculo no reconocido" };
  }
}

// Ejecutar herramientas y obtener resultados
async function executeToolCalls(
  toolCalls: ToolCall[],
  supabase: SupabaseClient,
  userId: string
): Promise<ToolResult[]> {
  const results: ToolResult[] = [];

  for (const tc of toolCalls) {
    try {
      const args = JSON.parse(tc.function.arguments);
      let result;

      if (tc.function.name === "query_database") {
        result = await executeQueryDatabase(supabase, userId, args.query_type, args.filters);
      } else if (tc.function.name === "calculate_taxes") {
        result = executeCalculateTaxes(
          args.base_amount,
          args.calculation_type,
          args.retention_concept,
          args.is_iva_responsible
        );
      } else {
        result = { error: `Herramienta desconocida: ${tc.function.name}` };
      }

      results.push({
        tool_call_id: tc.id,
        role: "tool",
        content: JSON.stringify(result)
      });
    } catch (e) {
      console.error("Error ejecutando herramienta:", e);
      results.push({
        tool_call_id: tc.id,
        role: "tool",
        content: JSON.stringify({ error: "Error ejecutando herramienta" })
      });
    }
  }

  return results;
}

// Procesar stream de la API y extraer contenido o tool calls
async function processStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder
): Promise<{ content: string; toolCalls: ToolCall[] }> {
  let content = "";
  const toolCalls: ToolCall[] = [];
  let currentToolCall: ToolCall | null = null;
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") break;

      try {
        const parsed = JSON.parse(jsonStr);
        const delta = parsed.choices?.[0]?.delta;

        if (delta?.content) {
          content += delta.content;
        }

        // Manejar tool calls
        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            if (tc.index !== undefined) {
              if (tc.id) {
                currentToolCall = { id: tc.id, function: { name: tc.function?.name || "", arguments: "" } };
                toolCalls.push(currentToolCall);
              }
              if (tc.function?.arguments && currentToolCall) {
                currentToolCall.function.arguments += tc.function.arguments;
              }
            }
          }
        }
      } catch {
        // Ignorar líneas que no son JSON válido
      }
    }
  }

  return { content, toolCalls };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Obtener usuario autenticado
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "No autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabase.auth.getClaims(token);
    
    if (authError || !userData?.claims?.sub) {
      return new Response(
        JSON.stringify({ error: "Token inválido" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = userData.claims.sub as string;

    // Primera llamada a Lovable AI con herramientas
    const firstResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        tools: TOOLS,
        tool_choice: "auto",
        stream: true
      }),
    });

    if (!firstResponse.ok) {
      const errorText = await firstResponse.text();
      console.error("AI gateway error:", firstResponse.status, errorText);
      
      if (firstResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Por favor intenta en unos minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (firstResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Se requiere agregar créditos para continuar usando el asistente." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Error del servicio de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Procesar primera respuesta
    const reader = firstResponse.body?.getReader();
    if (!reader) {
      return new Response(
        JSON.stringify({ error: "No se pudo leer la respuesta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const decoder = new TextDecoder();
    const { content: firstContent, toolCalls } = await processStream(reader, decoder);

    // Si no hay tool calls, hacer streaming directo de la respuesta
    if (toolCalls.length === 0) {
      // Hacer una nueva llamada y retornar el stream directamente
      const directResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages
          ],
          stream: true
        }),
      });

      if (!directResponse.ok) {
        return new Response(
          JSON.stringify({ error: "Error del servicio de IA" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(directResponse.body, {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        },
      });
    }

    // Two-Turn Tool Calling: Ejecutar herramientas y hacer segunda llamada al AI
    console.log("Ejecutando herramientas:", toolCalls.map(tc => tc.function.name));
    
    const toolResults = await executeToolCalls(toolCalls, supabase, userId);
    console.log("Resultados de herramientas obtenidos");

    // Construir mensajes para la segunda llamada
    const secondCallMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
      {
        role: "assistant",
        content: firstContent || null,
        tool_calls: toolCalls.map(tc => ({
          id: tc.id,
          type: "function",
          function: {
            name: tc.function.name,
            arguments: tc.function.arguments
          }
        }))
      },
      ...toolResults
    ];

    // Segunda llamada al AI con los resultados de las herramientas
    const secondResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: secondCallMessages,
        stream: true
      }),
    });

    if (!secondResponse.ok) {
      const errorText = await secondResponse.text();
      console.error("Second AI call error:", secondResponse.status, errorText);
      
      return new Response(
        JSON.stringify({ error: "Error procesando la respuesta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Retornar el stream de la segunda respuesta (respuesta natural del AI)
    return new Response(secondResponse.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      },
    });

  } catch (e) {
    console.error("agent-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
