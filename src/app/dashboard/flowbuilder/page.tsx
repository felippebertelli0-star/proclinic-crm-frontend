/**
 * Página: Flow Builder
 * Construtor visual de fluxos de automação
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockFlowBuilder, filtrarFlowBuilder, paginar, formatarData } from '@/lib/mockData';
import { GitBranch, CheckCircle2, AlertTriangle, Pause } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

// Ícone por tipo de trigger
const getIconeTrigger = (trigger: string) => {
  if (trigger === 'novo_paciente') return '👤';
  if (trigger === 'agendamento') return '📅';
  return '💬';
};

export default function FlowBuilderPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Cálculos de estatísticas
  const flowStats = useMemo(() => {
    return {
      total: mockFlowBuilder.length,
      ativos: mockFlowBuilder.filter((f) => f.status === 'ativo').length,
      pausados: mockFlowBuilder.filter((f) => f.status === 'pausado').length,
      totalExecucoes: mockFlowBuilder.reduce((sum, f) => sum + f.execucoes, 0),
      erroMedio:
        Math.round(
          mockFlowBuilder.reduce((sum, f) => sum + f.taxaErro, 0) / mockFlowBuilder.length,
        ) || 0,
    };
  }, []);

  const flowsFiltrados = useMemo(() => {
    return filtrarFlowBuilder(searchTerm, statusFilter || undefined);
  }, [searchTerm, statusFilter]);

  const { items: flowsPaginados, total: totalFlows } = useMemo(() => {
    return paginar(flowsFiltrados, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [flowsFiltrados, currentPage]);

  const totalPages = Math.ceil(totalFlows / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Flow Builder</h1>
        <p className="text-gray-600 mt-2">Construtor visual de fluxos de automação</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Fluxos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{flowStats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Fluxos Ativos</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{flowStats.ativos}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Execuções Totais</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{flowStats.totalExecucoes}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Taxa de Erro Médio</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{flowStats.erroMedio}%</p>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por nome do fluxo..."
        filters={[
          {
            label: 'Status',
            name: 'status',
            value: statusFilter,
            options: [
              { label: 'Ativo', value: 'ativo' },
              { label: 'Pausado', value: 'pausado' },
              { label: 'Arquivado', value: 'arquivado' },
            ],
            onChange: handleStatusFilter,
          },
        ]}
      />

      {/* Tabela de Fluxos */}
      <TableCard title={`Total de Fluxos: ${totalFlows}`} actionLabel="Novo Fluxo">
        {flowsPaginados.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Nome do Fluxo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Trigger
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Passos
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Execuções
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Taxa de Erro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Última Execução
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {flowsPaginados.map((flow) => (
                  <tr key={flow.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <GitBranch className="text-blue-600" size={20} />
                        <div>
                          <div className="font-medium text-gray-900">{flow.nome}</div>
                          <div className="text-sm text-gray-500 mt-1">{flow.descricao}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-2xl">{getIconeTrigger(flow.trigger)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="font-semibold text-gray-900">{flow.passos}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1 ${
                          flow.status === 'ativo'
                            ? 'bg-green-100 text-green-800'
                            : flow.status === 'pausado'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {flow.status === 'ativo' && <CheckCircle2 size={14} />}
                        {flow.status === 'pausado' && <Pause size={14} />}
                        {flow.status.charAt(0).toUpperCase() + flow.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="font-semibold text-gray-900">{flow.execucoes}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {flow.taxaErro > 5 && <AlertTriangle size={16} className="text-red-600" />}
                        <span
                          className={`text-sm font-semibold ${
                            flow.taxaErro > 5 ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {flow.taxaErro}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatarData(flow.ultimaExecucao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onView={() => console.log('Abrir fluxo:', flow.id)}
                        onEdit={() => console.log('Editar fluxo:', flow.id)}
                        onDelete={() => console.log('Deletar fluxo:', flow.id)}
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
            <div className="text-5xl mb-4">🔀</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum fluxo encontrado</h3>
            <p className="text-gray-600">Crie seu primeiro fluxo de automação</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
