/**
 * Página: Portal IA
 * Marketplace de agentes IA e ferramentas inteligentes
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockPortalIAs, filtrarPortalIAs, paginar, formatarData } from '@/lib/mockData';
import { Sparkles, Star, Download, CheckCircle2 } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function PortalIAsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoriaFilter = (value: string) => {
    setCategoriaFilter(value);
    setCurrentPage(1);
  };

  // Cálculos de estatísticas
  const iaStats = useMemo(() => {
    return {
      total: mockPortalIAs.length,
      ativas: mockPortalIAs.filter((i) => i.ativa).length,
      totalInstalacoes: mockPortalIAs.reduce((sum, i) => sum + i.instalacoes, 0),
      ratingMedio: (mockPortalIAs.reduce((sum, i) => sum + parseFloat(i.rating), 0) / mockPortalIAs.length).toFixed(1),
    };
  }, []);

  const iasFiltradas = useMemo(() => {
    return filtrarPortalIAs(searchTerm, categoriaFilter || undefined);
  }, [searchTerm, categoriaFilter]);

  const { items: iasPaginadas, total: totalIAs } = useMemo(() => {
    return paginar(iasFiltradas, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [iasFiltradas, currentPage]);

  const totalPages = Math.ceil(totalIAs / ITEMS_PER_PAGE);

  // Categorias únicas para filtro
  const categorias = Array.from(new Set(mockPortalIAs.map((i) => i.categoria)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Portal IA</h1>
        <p className="text-gray-600 mt-2">Marketplace de agentes IA e ferramentas inteligentes</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Agentes</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{iaStats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Agentes Ativos</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{iaStats.ativas}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Instalações</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{iaStats.totalInstalacoes}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Rating Médio</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{iaStats.ratingMedio}</p>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar agentes IA..."
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

      {/* Tabela de IAs */}
      <TableCard title={`Total de Agentes: ${totalIAs}`} actionLabel="Explorar Marketplace">
        {iasPaginadas.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Agente IA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Versão
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Instalações
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Lançamento
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {iasPaginadas.map((ia) => (
                  <tr key={ia.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white">
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{ia.nome}</div>
                          <div className="text-sm text-gray-500 mt-1">{ia.descricao}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {ia.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {ia.versao}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Star size={16} className="text-yellow-400" fill="currentColor" />
                        <span className="font-semibold text-gray-900">{ia.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Download size={16} className="text-blue-600" />
                        <span className="font-semibold text-gray-900">{ia.instalacoes}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1 ${
                          ia.ativa
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {ia.ativa && <CheckCircle2 size={14} />}
                        {ia.ativa ? 'Instalado' : 'Disponível'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatarData(ia.dataLancamento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onView={() => console.log('Ver agente IA:', ia.id)}
                        onEdit={() => console.log('Configurar agente:', ia.id)}
                      />
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
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum agente encontrado</h3>
            <p className="text-gray-600">Explore nosso marketplace de agentes IA</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
