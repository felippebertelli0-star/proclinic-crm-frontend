import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { adicionarEstrategiasSalvas } from '@/lib/estrategias-salvas';

const CLAUDE_SYSTEM_PROMPT = `Você é um assistente especializado em análise de estratégias clínicas e de automação.

Sua tarefa é ler um texto descritivo de uma estratégia e extrair informações estruturadas em formato JSON.

IMPORTANTE: Sua resposta DEVE ser um JSON válido, sem texto adicional antes ou depois.

Extraia a seguinte estrutura para CADA estratégia mencionada no texto:
{
  "nome": "Nome da estratégia (máx 100 caracteres)",
  "descricao": "Descrição detalhada (máx 500 caracteres)",
  "tipo": "Tipo/categoria da estratégia conforme mencionado no texto (ex: Marketing, Automação, Follow-up, Qualificação, etc)",
  "taxaSucesso": "Valor de 0 a 100 representando % de sucesso estimado"
}

Se o texto mencionar múltiplas estratégias, retorne um array JSON.

Se o texto não contiver informação suficiente, retorne um array vazio [].

NUNCA adicione explicações, comentários ou texto fora do JSON.`;

interface ProcessarEstrategiaRequest {
  texto: string;
  mes: string;
  tamanho: number;
}

interface EstrategiaExtraida {
  id: number;
  nome: string;
  descricao: string;
  tipo: string; // Qualquer tipo extraído pela IA
  ativa: boolean;
  dataCriacao: string;
  totalExecutions: number;
  taxaSucesso: number;
  criadoPor: string;
}

interface ProcessarEstrategiaResponse {
  sucesso: boolean;
  erro?: string;
  detalhe?: string;
  estrategias?: EstrategiaExtraida[];
  total?: number;
  processadoEm?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ProcessarEstrategiaResponse>> {
  try {
    console.log('[ESTRATEGIA_API] POST /api/processar-estrategia');

    // Validar API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('[ESTRATEGIA_API] ✗ API key não configurada');
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Erro de configuração',
          detalhe: 'ANTHROPIC_API_KEY não está configurada',
        },
        { status: 500 }
      );
    }

    // Parsear request
    const body: ProcessarEstrategiaRequest = await request.json();
    const { texto, mes, tamanho } = body;

    console.log(
      `[ESTRATEGIA_API] Texto: ${tamanho} caracteres, Mês: ${mes}`
    );

    // Validar texto
    if (!texto || typeof texto !== 'string') {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Texto da estratégia é obrigatório',
          detalhe: 'O campo "texto" deve ser uma string não vazia',
        },
        { status: 400 }
      );
    }

    if (tamanho < 50) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Texto muito curto',
          detalhe: `Mínimo 50 caracteres (recebido: ${tamanho})`,
        },
        { status: 400 }
      );
    }

    if (tamanho > 5000) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Texto muito longo',
          detalhe: `Máximo 5000 caracteres (recebido: ${tamanho})`,
        },
        { status: 400 }
      );
    }

    if (!mes) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Mês é obrigatório',
          detalhe: 'Selecione um mês antes de processar',
        },
        { status: 400 }
      );
    }

    // Chamar Claude API
    const client = new Anthropic({ apiKey });

    const userPrompt = `Analise o seguinte texto de estratégia e extraia as informações em JSON:

Texto: ${texto}

Mês: ${mes}

Retorne um array JSON com as estratégias extraídas. Se não conseguir extrair nada válido, retorne [].`;

    console.log('[ESTRATEGIA_API] Enviando para Claude API...');
    console.log('[ESTRATEGIA_API] API Key existe:', !!apiKey);

    let message;
    try {
      message = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        system: CLAUDE_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      console.log('[ESTRATEGIA_API] ✓ Resposta recebida do Claude');
      console.log('[ESTRATEGIA_API] Message object:', JSON.stringify(message).substring(0, 300));
    } catch (erroClaudeAPI) {
      console.error('[ESTRATEGIA_API] ✗ Erro ao chamar Claude API:', erroClaudeAPI);
      throw erroClaudeAPI;
    }

    // Extrair JSON da resposta
    const responseText =
      message.content[0]?.type === 'text' ? message.content[0].text : '';

    console.log('[ESTRATEGIA_API] Texto da resposta:', responseText.substring(0, 500));

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log('[ESTRATEGIA_API] ⚠️ Nenhum array JSON encontrado na resposta');
      return NextResponse.json(
        {
          sucesso: true,
          estrategias: [],
          total: 0,
          processadoEm: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    const jsonString = jsonMatch[0];
    const estrategiasDados = JSON.parse(jsonString) as Array<any>;

    console.log(
      `[ESTRATEGIA_API] ✓ JSON parseado com sucesso, ${estrategiasDados.length} estratégias`
    );

    // Enriquecer dados com tipos extraídos pela IA (sem mapeamento restritivo)
    const estrategias: EstrategiaExtraida[] = estrategiasDados.map(
      (est, idx) => ({
        id: Date.now() + idx,
        nome: est.nome || 'Estratégia sem nome',
        descricao: est.descricao || '',
        tipo: est.tipo || 'Estratégia',
        ativa: true,
        dataCriacao: new Date().toISOString().split('T')[0],
        totalExecutions: 0,
        taxaSucesso: Math.min(100, Math.max(0, est.taxaSucesso || 85)),
        criadoPor: 'IA - Análise de Texto',
      })
    );

    console.log(`[ESTRATEGIA_API] ✓ ${estrategias.length} estratégias criadas`);

    // Salvar estratégias criadas (tipos extraídos pela IA, sem mapeamento)
    try {
      adicionarEstrategiasSalvas(estrategias as any);
      console.log(`[ESTRATEGIA_API] ✓ ${estrategias.length} estratégias salvas em memória`);
    } catch (erroSalvar) {
      console.warn('[ESTRATEGIA_API] ⚠️ Erro ao salvar estratégias:', erroSalvar);
      // Continua mesmo se não conseguir salvar
    }

    return NextResponse.json(
      {
        sucesso: true,
        estrategias,
        total: estrategias.length,
        processadoEm: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
    console.error('[ESTRATEGIA_API] ✗ Erro:', mensagem);

    // Discriminar tipos de erro
    if (mensagem.includes('401')) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Erro de autenticação',
          detalhe: 'API key inválida ou expirada',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        sucesso: false,
        erro: 'Erro ao processar estratégia',
        detalhe: mensagem,
      },
      { status: 500 }
    );
  }
}
