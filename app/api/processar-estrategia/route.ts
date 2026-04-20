import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

/**
 * SENIOR-LEVEL FIX FOR 401 AUTHENTICATION ERROR
 *
 * Root Cause Analysis:
 * 1. Module-level client instantiation caused API key to be read at module load time
 * 2. In Vercel serverless environment, env vars may not be available until runtime
 * 3. No validation or logging of API key presence/format
 *
 * Solution:
 * - Instantiate client at function runtime (inside POST handler)
 * - Add comprehensive validation of environment variables
 * - Add detailed logging for debugging in production
 * - Improve error handling with specific error types
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const mes = formData.get('mes') as string;

    console.log('[ESTRATEGIA_API] Form data received:', {
      fileName: file?.name,
      fileSize: file?.size,
      mes: mes,
    });

    if (!file) {
      console.warn('[ESTRATEGIA_API] No file provided in request');
      return NextResponse.json(
        { sucesso: false, erro: 'Nenhuma imagem enviada' },
        { status: 400 }
      );
    }

    // Convert file to base64
    console.log('[ESTRATEGIA_API] Converting file to base64...');
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    console.log('[ESTRATEGIA_API] ✓ File converted to base64, length:', base64.length);

    // Send to Claude Vision API
    console.log('[ESTRATEGIA_API] Sending request to Claude Vision API...');
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64,
              },
            },
            {
              type: 'text',
              text: `Analise esta imagem de estratégia e extraia as informações em formato JSON.

              Para cada estratégia/campanha encontrada, crie um objeto com:
              - nome: (nome da estratégia)
              - canal: (canal de marketing: Ads, WhatsApp, Instagram, Email, etc)
              - status: (Ativa ou Pausada)
              - investimento: (valor em R$ ou "Grátis")

              IMPORTANTE: Retorne APENAS um JSON válido com um array "estrategias", nada mais. Exemplo:
              {
                "estrategias": [
                  {"nome": "Campanha Google Ads", "canal": "Ads", "status": "Ativa", "investimento": "R$ 2000"},
                  {"nome": "Follow-up Automático", "canal": "WhatsApp", "status": "Ativa", "investimento": "Grátis"}
                ]
              }`,
            },
          ],
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

    // Parse JSON
    const jsonMatch = resposta.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[ESTRATEGIA_API] ✗ Could not extract JSON from response');
      console.error('[ESTRATEGIA_API] Response preview:', resposta.text.substring(0, 200));
      return NextResponse.json(
        { sucesso: false, erro: 'Não foi possível extrair dados da imagem' },
        { status: 400 }
      );
    }

    let dados;
    try {
      dados = JSON.parse(jsonMatch[0]);
      console.log('[ESTRATEGIA_API] ✓ JSON parsed successfully');
    } catch (parseError) {
      const parseMsg = parseError instanceof Error ? parseError.message : String(parseError);
      console.error('[ESTRATEGIA_API] ✗ JSON parse error:', parseMsg);
      console.error('[ESTRATEGIA_API] JSON string:', jsonMatch[0].substring(0, 200));
      return NextResponse.json(
        { sucesso: false, erro: 'Erro ao processar dados da imagem' },
        { status: 400 }
      );
    }

    const estrategias = dados.estrategias || [];
    console.log('[ESTRATEGIA_API] ✓ Successfully extracted', estrategias.length, 'estratégias');

    return NextResponse.json({
      sucesso: true,
      estrategias: estrategias,
      mes: mes,
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
