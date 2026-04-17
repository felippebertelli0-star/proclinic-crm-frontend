/**
 * Página: Respostas Rápidas
 * Gerenciar templates e respostas rápidas
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockRespostas, filtrarRespostas, paginar, formatarData } from '@/lib/mockData';
import { MessageSquare, Copy, Eye, Edit2 } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function RespostasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoriaFilter = (value: string) => {
    setCategoriaFilter(value);
    setCurrentPage(1);
  };

  // Cálculos de estatísticas
  const respostaStats = useMemo(() => {
    return {
      total: mockRespostas.length,
      totalUsos: mockRespostas.reduce((sum, r) => sum + r.usos, 0),
      usosPromedio: Math.round(
        mockRespostas.reduce((sum, r) => sum + r.usos, 0) / mockRespostas.length,
      ),
      usosHoje: Math.floor(mockRespostas.reduce((sum, r) => sum + r.usos, 0) * 0.15),
    };
  }, []);

  const respostasFiltradas = useMemo(() => {
    return filtrarRespostas(searchTerm, categoriaFilter || undefined);
  }, [searchTerm, categoriaFilter]);

  const { items: respostasPaginadas, total: totalRespostas } = useMemo(() => {
    return paginar(respostasFiltradas, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [respostasFiltradas, currentPage]);

  const totalPages = Math.ceil(totalRespostas / ITEMS_PER_PAGE);

  // Categorias únicas para filtro
  const categorias = Array.from(new Set(mockRespostas.map((r) => r.categoria)));

  const handleCopiar = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Respostas Rápidas</h1>
        <p className="text-gray-600 mt-2">Gerenciar templates e respostas pré-definidas</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Respostas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{respostaStats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Usos</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{respostaStats.totalUsos}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Usos em Média</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{respostaStats.usosPromedio}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Usos Hoje</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{respostaStats.usosHoje}</p>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por título ou conteúdo..."
        filters={[
          {
            label: 'Categoria',
            name: 'categoria',
            value: categoriaFilter,
            options: categorias.map((c) => ({ label: c, value: c })),
            onChange: handleCategoriaFilter,
          },
        ]}
      />

      {/* Tabela de Respostas */}
      <TableCard title={`Total de Respostas: ${totalRespostas}`} actionLabel="Nova Resposta">
        {respostasPaginadas.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Conteúdo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Usos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Criado por
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Modificado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {respostasPaginadas.map((resposta) => (
                  <tr key={resposta.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="text-blue-600" size={20} />
                        <div className="font-medium text-gray-900">{resposta.titulo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        {resposta.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{resposta.conteudo}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="font-semibold text-gray-900">{resposta.usos}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {resposta.criadoPor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatarData(resposta.dataModificacao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopiar(resposta.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copiar resposta"
                        >
                          {copiedId === resposta.id ? (
                            <span className="text-green-600 text-xs font-semibold">✓</span>
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        <ActionButtons
                          onEdit={() => console.log('Editar resposta:', resposta.id)}
                          onDelete={() => console.log('Deletar resposta:', resposta.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="px-6 py-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma resposta encontrada</h3>
            <p className="text-gray-600">Crie suas primeiras respostas rápidas</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
