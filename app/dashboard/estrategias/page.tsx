'use client';

import { useState, useEffect } from 'react';
import { useEstrategiasStore, Estrategia } from '@/store/estrategiasStore';

const TIPOS_ESTRATEGIA = [
  'Limpeza',
  'Clareamento',
  'Implante',
  'Tratamento Estético',
  'Consulta',
  'Restauração',
  'Aparelho Ortodôntico',
];

export default function EstrategiesPage() {
  const {
    estrategias,
    carregando,
    erro,
    carregarEstrategias,
    adicionarEstrategias,
    deletarEstrategia,
  } = useEstrategiasStore();

  const [modalAberto, setModalAberto] = useState(false);
  const [textoEstrategia, setTextoEstrategia] = useState('');
  const [contadorCaracteres, setContadorCaracteres] = useState(0);
  const [mesSelecionado, setMesSelecionado] = useState('');
  const [processandoTexto, setProcessandoTexto] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const MAX_CARACTERES = 5000;
  const MIN_CARACTERES = 50;

  // Carregar estratégias ao montar
  useEffect(() => {
    console.log('[ESTRATEGIAS] Página montada, carregando estratégias...');
    carregarEstrategias();
  }, [carregarEstrategias]);

  // Handler para textarea
  const handleTextoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const texto = e.target.value;
    if (texto.length <= MAX_CARACTERES) {
      setTextoEstrategia(texto);
      setContadorCaracteres(texto.length);
    }
  };

  // Validar antes de enviar
  const validarTexto = () => {
    if (!textoEstrategia.trim()) {
      alert('❌ Por favor, insira um texto de estratégia');
      return false;
    }
    if (contadorCaracteres < MIN_CARACTERES) {
      alert(`❌ Mínimo ${MIN_CARACTERES} caracteres (${contadorCaracteres}/${MIN_CARACTERES})`);
      return false;
    }
    if (!mesSelecionado) {
      alert('❌ Selecione um mês');
      return false;
    }
    return true;
  };

  // Processar texto com Claude
  const handleProcessarTexto = async () => {
    if (!validarTexto()) return;

    setProcessandoTexto(true);
    try {
      console.log('[ESTRATEGIAS] Enviando texto para processamento...');

      const response = await fetch('/api/processar-estrategia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: textoEstrategia.trim(),
          mes: mesSelecionado,
          tamanho: contadorCaracteres,
        }),
      });

      const dados = await response.json();

      if (!response.ok) {
        console.error('[ESTRATEGIAS] ✗ Erro na API:', dados);
        alert(`❌ ${dados.erro}\n${dados.detalhe || ''}`);
        return;
      }

      if (dados.sucesso && dados.estrategias?.length > 0) {
        console.log(
          `[ESTRATEGIAS] ✓ ${dados.estrategias.length} estratégias extraídas`
        );

        // Adicionar ao store (persiste no backend)
        await adicionarEstrategias(dados.estrategias);

        // Limpar modal
        setTextoEstrategia('');
        setContadorCaracteres(0);
        setMesSelecionado('');
        setModalAberto(false);

        alert(
          `✅ ${dados.estrategias.length} estratégias criadas e salvas com sucesso!`
        );
      } else {
        alert('⚠️ Nenhuma estratégia foi extraída. Verifique o texto.');
      }
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : 'Erro desconhecido';
      console.error('[ESTRATEGIAS] ✗ Erro:', msg);
      alert(`❌ Erro: ${msg}`);
    } finally {
      setProcessandoTexto(false);
    }
  };

  // Deletar estratégia
  const handleDeletar = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar esta estratégia?')) {
      try {
        await deletarEstrategia(id);
        alert('✅ Estratégia deletada com sucesso');
      } catch (erro) {
        alert('❌ Erro ao deletar estratégia');
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estratégias</h1>
          <p className="text-gray-600 mt-1">
            Total: {estrategias.length} estratégias
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          + Nova Estratégia
        </button>
      </div>

      {/* Erro */}
      {erro && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">❌ {erro}</p>
        </div>
      )}

      {/* Carregando */}
      {carregando && (
        <div className="text-center py-12">
          <p className="text-gray-600">⏳ Carregando estratégias...</p>
        </div>
      )}

      {/* Lista de Estratégias */}
      {!carregando && estrategias.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">📭 Nenhuma estratégia criada</p>
          <button
            onClick={() => setModalAberto(true)}
            className="text-yellow-600 hover:text-yellow-700 font-semibold"
          >
            Criar primeira estratégia →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estrategias.map((est) => (
            <div
              key={est.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {est.nome}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{est.tipo}</p>
                </div>
                <button
                  onClick={() => handleDeletar(est.id)}
                  className="text-red-600 hover:text-red-800 font-semibold text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                {est.descricao}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-semibold ${
                      est.ativa ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    {est.ativa ? '🟢 Ativa' : '⭕ Inativa'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa Sucesso:</span>
                  <span className="font-semibold text-blue-600">
                    {est.taxaSucesso}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Execuções:</span>
                  <span className="font-semibold text-gray-900">
                    {est.totalExecutions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Criada em:</span>
                  <span className="font-semibold text-gray-900">
                    {est.dataCriacao}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Nova Estratégia</h2>
              <button
                onClick={() => setModalAberto(false)}
                className="text-2xl hover:opacity-80"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insira o texto da estratégia:
                </label>
                <textarea
                  value={textoEstrategia}
                  onChange={handleTextoChange}
                  placeholder="Cole aqui o texto da estratégia para análise IA..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                  maxLength={MAX_CARACTERES}
                  disabled={processandoTexto}
                />
                <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                  <span>
                    {contadorCaracteres} / {MAX_CARACTERES} caracteres
                  </span>
                  {contadorCaracteres < MIN_CARACTERES && (
                    <span className="text-red-500">
                      Mínimo {MIN_CARACTERES} caracteres
                    </span>
                  )}
                </div>
              </div>

              {/* Mês */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione o mês:
                </label>
                <select
                  value={mesSelecionado}
                  onChange={(e) => setMesSelecionado(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  disabled={processandoTexto}
                >
                  <option value="">-- Selecione um mês --</option>
                  <option value="janeiro">Janeiro</option>
                  <option value="fevereiro">Fevereiro</option>
                  <option value="marco">Março</option>
                  <option value="abril">Abril</option>
                  <option value="maio">Maio</option>
                  <option value="junho">Junho</option>
                  <option value="julho">Julho</option>
                  <option value="agosto">Agosto</option>
                  <option value="setembro">Setembro</option>
                  <option value="outubro">Outubro</option>
                  <option value="novembro">Novembro</option>
                  <option value="dezembro">Dezembro</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg">
              <button
                onClick={() => setModalAberto(false)}
                disabled={processandoTexto}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleProcessarTexto}
                disabled={
                  processandoTexto ||
                  !textoEstrategia.trim() ||
                  contadorCaracteres < MIN_CARACTERES ||
                  !mesSelecionado
                }
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processandoTexto ? '⏳ Processando...' : '✓ Processar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
