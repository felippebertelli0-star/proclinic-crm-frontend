/**
 * API de Estratégias - CRUD Completo
 *
 * Endpoints:
 * - GET /api/estrategias - Carregar todas as estratégias
 * - POST /api/estrategias - Criar novas estratégias
 * - PUT /api/estrategias/[id] - Atualizar estratégia
 * - DELETE /api/estrategias/[id] - Deletar estratégia
 *
 * Armazenamento: JSON em arquivo (pronto para upgrade para PostgreSQL/MongoDB)
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'estrategias.json');

// Garantir que o diretório existe
async function garantirDiretorio() {
  try {
    await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  } catch (erro) {
    console.error('[API_ESTRATEGIAS] Erro ao criar diretório:', erro);
  }
}

// Ler estratégias do arquivo
async function lerEstrategias(): Promise<any[]> {
  try {
    await garantirDiretorio();
    const conteudo = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(conteudo);
  } catch (erro) {
    // Arquivo não existe ainda, retornar array vazio
    return [];
  }
}

// Salvar estratégias no arquivo
async function salvarEstrategias(estrategias: any[]): Promise<void> {
  try {
    await garantirDiretorio();
    await fs.writeFile(DB_FILE, JSON.stringify(estrategias, null, 2), 'utf-8');
    console.log('[API_ESTRATEGIAS] ✓ Estratégias salvas:', estrategias.length);
  } catch (erro) {
    console.error('[API_ESTRATEGIAS] ✗ Erro ao salvar:', erro);
    throw new Error('Erro ao salvar estratégias');
  }
}

// GET - Carregar todas as estratégias
export async function GET(request: NextRequest) {
  try {
    console.log('[API_ESTRATEGIAS] GET - Carregando estratégias...');
    const estrategias = await lerEstrategias();

    return NextResponse.json({
      sucesso: true,
      estrategias,
      total: estrategias.length,
      carregadoEm: new Date().toISOString(),
    });
  } catch (erro) {
    console.error('[API_ESTRATEGIAS] ✗ Erro ao carregar:', erro);
    return NextResponse.json(
      {
        sucesso: false,
        erro: 'Erro ao carregar estratégias',
        detalhe: erro instanceof Error ? erro.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

// POST - Criar novas estratégias
export async function POST(request: NextRequest) {
  try {
    console.log('[API_ESTRATEGIAS] POST - Criando novas estratégias...');
    const body = await request.json();
    const { estrategias: novasEstrategias } = body;

    if (!Array.isArray(novasEstrategias)) {
      return NextResponse.json(
        { sucesso: false, erro: 'Campo "estrategias" deve ser um array' },
        { status: 400 }
      );
    }

    // Carregar estratégias existentes
    const estrategiasExistentes = await lerEstrategias();

    // Adicionar novas estratégias
    const estrategiasComId = novasEstrategias.map((est) => ({
      ...est,
      id: est.id || Date.now() + Math.random(),
    }));

    const todasEstrategias = [...estrategiasExistentes, ...estrategiasComId];

    // Salvar
    await salvarEstrategias(todasEstrategias);

    console.log('[API_ESTRATEGIAS] ✓ Criadas', novasEstrategias.length, 'estratégias');

    return NextResponse.json({
      sucesso: true,
      estrategias: estrategiasComId,
      total: todasEstrategias.length,
      criadoEm: new Date().toISOString(),
    });
  } catch (erro) {
    console.error('[API_ESTRATEGIAS] ✗ Erro ao criar:', erro);
    return NextResponse.json(
      {
        sucesso: false,
        erro: 'Erro ao criar estratégias',
        detalhe: erro instanceof Error ? erro.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

// PUT - Atualizar estratégia por ID
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { sucesso: false, erro: 'ID da estratégia é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[API_ESTRATEGIAS] PUT - Atualizando estratégia:', id);

    const body = await request.json();
    const estrategias = await lerEstrategias();

    const indice = estrategias.findIndex((est) => est.id === Number(id) || est.id === id);

    if (indice === -1) {
      return NextResponse.json(
        { sucesso: false, erro: 'Estratégia não encontrada' },
        { status: 404 }
      );
    }

    // Atualizar estratégia
    estrategias[indice] = {
      ...estrategias[indice],
      ...body,
      id: estrategias[indice].id, // Manter ID original
    };

    await salvarEstrategias(estrategias);

    console.log('[API_ESTRATEGIAS] ✓ Estratégia atualizada');

    return NextResponse.json({
      sucesso: true,
      estrategia: estrategias[indice],
      atualizadoEm: new Date().toISOString(),
    });
  } catch (erro) {
    console.error('[API_ESTRATEGIAS] ✗ Erro ao atualizar:', erro);
    return NextResponse.json(
      {
        sucesso: false,
        erro: 'Erro ao atualizar estratégia',
        detalhe: erro instanceof Error ? erro.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

// DELETE - Deletar estratégia por ID
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { sucesso: false, erro: 'ID da estratégia é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[API_ESTRATEGIAS] DELETE - Deletando estratégia:', id);

    let estrategias = await lerEstrategias();
    const tamanhoAnterior = estrategias.length;

    // Filtrar estratégia a deletar
    estrategias = estrategias.filter((est) => est.id !== Number(id) && est.id !== id);

    if (estrategias.length === tamanhoAnterior) {
      return NextResponse.json(
        { sucesso: false, erro: 'Estratégia não encontrada' },
        { status: 404 }
      );
    }

    await salvarEstrategias(estrategias);

    console.log('[API_ESTRATEGIAS] ✓ Estratégia deletada');

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Estratégia deletada com sucesso',
      deletadoEm: new Date().toISOString(),
    });
  } catch (erro) {
    console.error('[API_ESTRATEGIAS] ✗ Erro ao deletar:', erro);
    return NextResponse.json(
      {
        sucesso: false,
        erro: 'Erro ao deletar estratégia',
        detalhe: erro instanceof Error ? erro.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
