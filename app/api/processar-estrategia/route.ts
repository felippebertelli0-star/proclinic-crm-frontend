import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

/**
 * SISTEMA DE EXTRAÇÃO DE ESTRATÉGIAS POR TEXTO
 *
 * Novo sistema que processa texto descritivo de estratégias ao invés de imagens.
 *
 * Mudanças de Vision API para Text API:
 * 1. Aceita JSON com campo "texto" ao invés de FormData com imagem
 * 2. Valida tamanho do texto (50-5000 caracteres)
 * 3. Claude analisa texto e extrai informações em formato JSON
 * 4. Mais confiável, barato e sem dependência de qualidade de imagem
 *
 * Mantém:
 * - Validação de API key em tempo de execução
 * - Logging detalhado para debugging
 * - Tratamento de erros específicos
 */

/**
 * Validates and retrieves the Anthropic API key from environment
 * @throws Error if API key is missing, invalid, or malformed
 */
function getValidatedApiKey(): string {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Check if API key exists
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY environment variable is not set. ' +
      'Please add it to your .env.local (development) or Vercel environment variables (production).'
    );
  }

  // Check if API key is not just whitespace
  const trimmedKey = apiKey.trim();
  if (!trimmedKey) {
    throw new Error(
      'ANTHROPIC_API_KEY environment variable is empty or contains only whitespace.'
    );
  }

  // Validate API key format (should start with "sk-ant-")
  if (!trimmedKey.startsWith('sk-ant-')) {
    throw new Error(
      `ANTHROPIC_API_KEY has invalid format. Expected format starting with "sk-ant-", ` +
      `but got "${trimmedKey.substring(0, 10)}...". ` +
      `This may indicate the key was corrupted or set incorrectly.`
    );
  }

  // Check minimum length (Anthropic keys are typically 80+ characters)
  if (trimmedKey.length < 50) {
    throw new Error(
      `ANTHROPIC_API_KEY is too short (${trimmedKey.length} chars). ` +
      `Expected at least 50 characters. The key may be incomplete.`
    );
  }

  return trimmedKey;
}

/**
 * Creates a validated Anthropic client instance at runtime
 * @returns Anthropic client with validated API key
 */
function createAnthropicClient(): Anthropic {
  const apiKey = getValidatedApiKey();

  const client = new Anthropic({
    apiKey: apiKey,
  });

  return client;
}

export async function POST(request: NextRequest) {
  try {
    // DEBUG LOG: Request received
    console.log('[ESTRATEGIA_API] POST request received at', new Date().toISOString());

    // Validate API key early
    let client: Anthropic;
    try {
      console.log('[ESTRATEGIA_API] Validating environment variables...');
      client = createAnthropicClient();
      console.log('[ESTRATEGIA_API] ✓ Anthropic client created successfully with valid API key');
    } catch (envError) {
      const errorMsg = envError instanceof Error ? envError.message : String(envError);
      console.error('[ESTRATEGIA_API] ✗ Environment validation failed:', errorMsg);
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Configuração do servidor inválida: chave de API não encontrada ou inválida',
          detalhe: errorMsg,
        },
        { status: 500 }
      );
    }

    // Parse JSON body
    interface ProcessarEstrategiaRequest {
      texto: string;
      mes: string;
      tamanho: number;
    }

    let body: ProcessarEstrategiaRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[ESTRATEGIA_API] ✗ Invalid JSON in request body');
      return NextResponse.json(
        { sucesso: false, erro: 'Requisição inválida', detalhe: 'O corpo da requisição deve ser JSON válido' },
        { status: 400 }
      );
    }

    const { texto, mes, tamanho } = body;

    // Validate text input
    if (!texto || typeof texto !== 'string') {
      console.warn('[ESTRATEGIA_API] No text provided in request');
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Texto da estratégia é obrigatório',
          detalhe: 'O campo "texto" deve ser uma string não vazia'
        },
        { status: 400 }
      );
    }

    if (tamanho < 50) {
      console.warn('[ESTRATEGIA_API] Text too short:', tamanho, 'caracteres');
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Texto muito curto',
          detalhe: `O texto deve ter pelo menos 50 caracteres (recebido: ${tamanho})`
        },
        { status: 400 }
      );
    }

    if (tamanho > 5000) {
      console.warn('[ESTRATEGIA_API] Text too long:', tamanho, 'caracteres');
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Texto muito longo',
          detalhe: `O texto não deve exceder 5000 caracteres (recebido: ${tamanho})`
        },
        { status: 400 }
      );
    }

    if (!mes) {
      console.warn('[ESTRATEGIA_API] No month provided in request');
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Mês é obrigatório',
          detalhe: 'Selecione um mês antes de processar'
        },
        { status: 400 }
      );
    }

    console.log('[ESTRATEGIA_API] Text data received:', {
      textLength: tamanho,
      mes: mes,
    });

    // Claude system prompt for text analysis
    const CLAUDE_SYSTEM_PROMPT = `Você é um assistente especializado em análise de estratégias comerciais, de marketing e operacionais.

Sua tarefa é ler um texto descritivo e extrair informações estruturadas sobre estratégias em formato JSON.

IMPORTANTE: Sua resposta DEVE ser um JSON válido, sem texto adicional antes ou depois.

Extraia a seguinte estrutura para CADA estratégia mencionada no texto:
{
  "nome": "Nome ou título da estratégia (máx 100 caracteres)",
  "descricao": "Descrição detalhada da estratégia, ações, objetivos e resultados esperados (máx 500 caracteres)",
  "tipo": "Categorize a estratégia: pode ser qualquer tipo como Aquisição, Retenção, Follow-up, Reativação, Recuperação, Consulta, Tratamento, Promoção, Campanha, Comunicação, ou qualquer outro tipo relevante",
  "taxaSucesso": "Valor de 0 a 100 representando % de sucesso estimado ou esperado"
}

REGRAS IMPORTANTES:
- Extraia TODAS as estratégias mencionadas (não apenas as com nomes específicos)
- Se o texto descreve ações, táticas ou planos com objetivos, considere como estratégia
- O campo "tipo" é flexível - adapte à realidade do texto (pode ser para qualquer tipo de negócio: clínica médica, consultório odontológico, estética, etc)
- Se o texto mencionar múltiplas estratégias, retorne um array JSON com todas
- Se não conseguir extrair informações estruturadas, retorne um array vazio []

NUNCA adicione explicações, comentários ou texto fora do JSON.`;

    const userPrompt = `Analise o seguinte texto de estratégia e extraia as informações em JSON:

Texto: ${texto}

Mês: ${mes}

Retorne um array JSON com as estratégias extraídas. Se não conseguir extrair nada válido, retorne [].`;

    // Send to Claude Text API
    console.log('[ESTRATEGIA_API] Sending request to Claude Text API...');
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: CLAUDE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    console.log('[ESTRATEGIA_API] ✓ Claude API response received successfully');

    // Extract response text
    const resposta = message.content[0];
    if (resposta.type !== 'text') {
      console.error('[ESTRATEGIA_API] ✗ Invalid response type:', resposta.type);
      return NextResponse.json(
        { sucesso: false, erro: 'Resposta inválida da IA' },
        { status: 500 }
      );
    }

    console.log('[ESTRATEGIA_API] Response text length:', resposta.text.length);

    // Parse JSON - extract array from response
    const jsonMatch = resposta.text.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch?.[0] || '[]';

    let estrategiasDados: Array<any>;
    try {
      estrategiasDados = JSON.parse(jsonString);
      console.log('[ESTRATEGIA_API] ✓ JSON parsed successfully');
    } catch (parseError) {
      const parseMsg = parseError instanceof Error ? parseError.message : String(parseError);
      console.error('[ESTRATEGIA_API] ✗ JSON parse error:', parseMsg);
      console.error('[ESTRATEGIA_API] JSON string preview:', jsonString.substring(0, 200));
      return NextResponse.json(
        { sucesso: false, erro: 'Erro ao processar texto da estratégia', detalhe: parseMsg },
        { status: 400 }
      );
    }

    // Validate it's an array
    if (!Array.isArray(estrategiasDados)) {
      console.error('[ESTRATEGIA_API] ✗ Response is not an array');
      return NextResponse.json(
        { sucesso: false, erro: 'Formato de resposta inválido', detalhe: 'Claude retornou um JSON que não é um array' },
        { status: 400 }
      );
    }

    // Enrich estratégias with system data
    interface EstrategiaExtraida {
      id: number;
      nome: string;
      descricao: string;
      tipo: string;
      ativa: boolean;
      dataCriacao: string;
      totalExecutions: number;
      taxaSucesso: number;
      criadoPor: string;
    }

    const estrategias: EstrategiaExtraida[] = estrategiasDados.map((est, idx) => ({
      id: Date.now() + idx,
      nome: est.nome || 'Estratégia sem nome',
      descricao: est.descricao || '',
      tipo: est.tipo || 'Consulta',
      ativa: true,
      dataCriacao: new Date().toISOString().split('T')[0],
      totalExecutions: 0,
      taxaSucesso: Math.min(100, Math.max(0, est.taxaSucesso || 85)),
      criadoPor: 'IA - Análise de Texto'
    }));

    console.log('[ESTRATEGIA_API] ✓ Successfully extracted', estrategias.length, 'estratégias');

    return NextResponse.json({
      sucesso: true,
      estrategias: estrategias,
      total: estrategias.length,
      processadoEm: new Date().toISOString()
    });

  } catch (erro) {
    const errorMsg = erro instanceof Error ? erro.message : String(erro);
    const errorCode = erro instanceof Error && erro.message.includes('401') ? '401' : 'unknown';

    console.error('[ESTRATEGIA_API] ✗ Fatal error:', {
      message: errorMsg,
      type: erro instanceof Error ? erro.constructor.name : typeof erro,
      timestamp: new Date().toISOString(),
    });

    // Check if it's an authentication error
    if (errorMsg.includes('401') || errorMsg.includes('authentication') || errorMsg.includes('invalid x-api-key')) {
      console.error('[ESTRATEGIA_API] ✗✗✗ AUTHENTICATION ERROR DETECTED - API key is invalid or missing');
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Erro de autenticação com a API de IA. Verifique se a chave de API está configurada corretamente.',
          detalhe: 'O servidor não conseguiu se autenticar com a API do Claude.',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        sucesso: false,
        erro: errorMsg || 'Erro desconhecido ao processar estratégia',
      },
      { status: 500 }
    );
  }
}
