/**
 * Página: Estratégias
 * Gerenciar estratégias de automação
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockEstrategias, filtrarEstrategias, paginar, formatarData } from '@/lib/mockData';
import { Zap, CheckCircle2, AlertCircle, Inbox } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

// Ícone por tipo de comunicação
const getIconeTipo = (tipo: string) => {
  if (tipo === 'email') return <Inbox className="text-blue-600" size={18} />;
  if (tipo === 'sms') return <AlertCircle className="text-green-600" size={18} />;
  return <Zap className="text-orange-600" size={18} />;
};

export default function EstrategiasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTipoFilter = (value: string) => {
    setTipoFilter(value);
    setCurrentPage(1);
  };

  // Cálculos de estatísticas
  const estrategiaStats = useMemo(() => {
    return {
      total: mockEstrategias.length,
      ativas: mockEstrategias.filter((e) => e.ativa).length,
      inativas: mockEstrategias.filter((e) => !e.ativa).length,
      totalExecutions: mockEstrategias.reduce((sum, e) => sum + e.totalExecutions, 0),
    };
  }, []);

  const estrategiasFiltradas = useMemo(() => {
    return filtrarEstrategias(searchTerm, tipoFilter || undefined);
  }, [searchTerm, tipoFilter]);

  const { items: estrategiasPaginadas, total: totalEstrategias } = useMemo(() => {
    return paginar(estrategiasFiltradas, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [estrategiasFiltradas, currentPage]);

  const totalPages = Math.ceil(totalEstrategias / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Estratégias de Automação</h1>
        <p className="text-gray-600 mt-2">Gerenciar estratégias automatizadas de comunicação</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Estratégias</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{estrategiaStats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Estratégias Ativas</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{estrategiaStats.ativas}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Estratégias Inativas</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{estrategiaStats.inativas}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Execuções Totais</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{estrategiaStats.totalExecutions}</p>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por nome ou descrição..."
        filters={[
          {
            label: 'Tipo',
            name: 'tipo',
            value: tipoFilter,
            options: [
              { label: 'Email', value: 'email' },
              { label: 'SMS', value: 'sms' },
              { label: 'WhatsApp', value: 'whatsapp' },
            ],
            onChange: handleTipoFilter,
          },
        ]}
      />

      {/* Tabela de Estratégias */}
      <TableCard title={`Total de Estratégias: ${totalEstrategias}`} actionLabel="Nova Estratégia">
        {estrategiasPaginadas.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Execuções
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Taxa de Sucesso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Criado por
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Data de Ativação
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {estrategiasPaginadas.map((estrategia) => (
                  <tr key={estrategia.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{estrategia.nome}</div>
                        <div className="text-sm text-gray-500 mt-1">{estrategia.descricao}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        {getIconeTipo(estrategia.tipo)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          estrategia.ativa
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {estrategia.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="font-semibold text-gray-900">{estrategia.totalExecutions}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${estrategia.taxaSucesso}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {estrategia.taxaSucesso}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {estrategia.criadoPor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatarData(estrategia.dataAtivacao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onEdit={() => console.log('Editar estratégia:', estrategia.id)}
                        onDelete={() => console.log('Deletar estratégia:', estrategia.id)}
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
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma estratégia encontrada
            </h3>
            <p className="text-gray-600">Crie sua primeira estratégia de automação</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
