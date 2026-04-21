import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'estrategias.json');

async function ensureDirExists() {
  try {
    await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  } catch (erro) {
    console.error('[API] Erro ao criar diretório:', erro);
  }
}

async function lerEstrategias() {
  try {
    await ensureDirExists();
    const conteudo = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(conteudo);
  } catch (erro) {
    console.log('[API] Arquivo não existe, retornando array vazio');
    return [];
  }
}

async function salvarEstrategias(estrategias: any[]) {
  try {
    await ensureDirExists();
    await fs.writeFile(DB_FILE, JSON.stringify(estrategias, null, 2), 'utf-8');
    console.log(`[API] ✓ ${estrategias.length} estratégias salvas em ${DB_FILE}`);
  } catch (erro) {
    console.error('[API] ✗ Erro ao salvar estratégias:', erro);
    throw erro;
  }
}

// GET - Listar todas as estratégias
export async function GET(request: NextRequest) {
  try {
    console.log('[API] GET /api/estrategias');
    const estrategias = await lerEstrategias();
    return NextResponse.json({
      sucesso: true,
      estrategias,
      total: estrategias.length,
    });
  } catch (erro) {
    console.error('[API] ✗ Erro em GET:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Erro ao carregar estratégias' },
      { status: 500 }
    );
  }
}

// POST - Criar novas estratégias
export async function POST(request: NextRequest) {
  try {
    console.log('[API] POST /api/estrategias');
    const body = await request.json();
    const { estrategias: novasEstrategias } = body;

    if (!Array.isArray(novasEstrategias)) {
      return NextResponse.json(
        { sucesso: false, erro: 'Campo "estrategias" deve ser um array' },
        { status: 400 }
      );
    }

    const estrategiasExistentes = await lerEstrategias();
    const todasEstrategias = [...estrategiasExistentes, ...novasEstrategias];

    await salvarEstrategias(todasEstrategias);

    console.log(`[API] ✓ POST: ${novasEstrategias.length} estratégias adicionadas`);
    return NextResponse.json({
      sucesso: true,
      estrategias: novasEstrategias,
      total: todasEstrategias.length,
    });
  } catch (erro) {
    console.error('[API] ✗ Erro em POST:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Erro ao adicionar estratégias' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar estratégia por ID
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    console.log(`[API] DELETE /api/estrategias?id=${id}`);

    if (!id) {
      return NextResponse.json(
        { sucesso: false, erro: 'ID é obrigatório' },
        { status: 400 }
      );
    }

    const estrategias = await lerEstrategias();
    const filtradas = estrategias.filter((e: any) => e.id !== parseInt(id));

    if (filtradas.length === estrategias.length) {
      return NextResponse.json(
        { sucesso: false, erro: 'Estratégia não encontrada' },
        { status: 404 }
      );
    }

    await salvarEstrategias(filtradas);
    console.log(`[API] ✓ DELETE: Estratégia ${id} deletada`);

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Estratégia deletada com sucesso',
    });
  } catch (erro) {
    console.error('[API] ✗ Erro em DELETE:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Erro ao deletar estratégia' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar estratégia
export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    console.log(`[API] PUT /api/estrategias?id=${id}`);

    if (!id) {
      return NextResponse.json(
        { sucesso: false, erro: 'ID é obrigatório' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const estrategias = await lerEstrategias();
    const index = estrategias.findIndex((e: any) => e.id === parseInt(id));

    if (index === -1) {
      return NextResponse.json(
        { sucesso: false, erro: 'Estratégia não encontrada' },
        { status: 404 }
      );
    }

    estrategias[index] = { ...estrategias[index], ...body };
    await salvarEstrategias(estrategias);

    console.log(`[API] ✓ PUT: Estratégia ${id} atualizada`);
    return NextResponse.json({
      sucesso: true,
      estrategia: estrategias[index],
    });
  } catch (erro) {
    console.error('[API] ✗ Erro em PUT:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Erro ao atualizar estratégia' },
      { status: 500 }
    );
  }
}
