import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const mes = formData.get('mes') as string;

    if (!file) {
      return NextResponse.json({ sucesso: false, erro: 'Nenhuma imagem enviada' }, { status: 400 });
    }

    // Converter arquivo para base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // Enviar para Claude Vision API
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

    // Extrair o texto da resposta
    const resposta = message.content[0];
    if (resposta.type !== 'text') {
      return NextResponse.json({ sucesso: false, erro: 'Resposta inválida da IA' }, { status: 500 });
    }

    // Parsear JSON
    const jsonMatch = resposta.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ sucesso: false, erro: 'Não foi possível extrair dados da imagem' }, { status: 400 });
    }

    const dados = JSON.parse(jsonMatch[0]);
    const estrategias = dados.estrategias || [];

    return NextResponse.json({
      sucesso: true,
      estrategias: estrategias,
      mes: mes,
    });
  } catch (erro) {
    console.error('Erro ao processar estratégia:', erro);
    return NextResponse.json(
      { sucesso: false, erro: erro instanceof Error ? erro.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
