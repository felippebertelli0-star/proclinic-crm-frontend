/**
 * Página: Tarefas
 * Gerenciar tarefas com status (pendente, em andamento, concluído)
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockTarefas, filtrarTarefas, paginar, formatarData } from '@/lib/mockData';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function TarefasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [prioridadeFilter, setPrioridadeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePrioridadeFilter = (value: string) => {
    setPrioridadeFilter(value);
    setCurrentPage(1);
  };

  // Cálculos de estatísticas
  const taskStats = useMemo(() => {
    return {
      total: mockTarefas.length,
      pendente: mockTarefas.filter((t) => t.status === 'pendente').length,
      emAndamento: mockTarefas.filter((t) => t.status === 'em andamento').length,
      concluido: mockTarefas.filter((t) => t.status === 'concluido').length,
    };
  }, []);

  const tarefasFiltradas = useMemo(() => {
    return filtrarTarefas(searchTerm, statusFilter || undefined, prioridadeFilter || undefined);
  }, [searchTerm, statusFilter, prioridadeFilter]);

  const { items: tarefasPaginadas, total: totalTarefas } = useMemo(() => {
    return paginar(tarefasFiltradas, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [tarefasFiltradas, currentPage]);

  const totalPages = Math.ceil(totalTarefas / ITEMS_PER_PAGE);

  // Função para obter ícone de prioridade
  const getIconePrioridade = (prioridade: string) => {
    if (prioridade === 'alta') return <AlertCircle className="text-red-500" size={18} />;
    if (prioridade === 'media') return <Clock className="text-orange-500" size={18} />;
    return <CheckCircle2 className="text-green-500" size={18} />;
  };

  // Função para obter cor de prioridade
  const getCorPrioridade = (prioridade: string) => {
    if (prioridade === 'alta') return 'bg-red-50 text-red-700';
    if (prioridade === 'media') return 'bg-orange-50 text-orange-700';
    return 'bg-green-50 text-green-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
        <p className="text-gray-600 mt-2">Gerenciar tarefas e atividades da equipe</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Tarefas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{taskStats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Pendentes</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{taskStats.pendente}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Em Andamento</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{taskStats.emAndamento}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Concluídas</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{taskStats.concluido}</p>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por título ou descrição..."
        filters={[
          {
            label: 'Status',
            name: 'status',
            value: statusFilter,
            options: [
              { label: 'Pendente', value: 'pendente' },
              { label: 'Em Andamento', value: 'em andamento' },
              { label: 'Concluído', value: 'concluido' },
            ],
            onChange: handleStatusFilter,
          },
          {
            label: 'Prioridade',
            name: 'prioridade',
            value: prioridadeFilter,
            options: [
              { label: 'Baixa', value: 'baixa' },
              { label: 'Média', value: 'media' },
              { label: 'Alta', value: 'alta' },
            ],
            onChange: handlePrioridadeFilter,
          },
        ]}
      />

      {/* Tabela de Tarefas */}
      <TableCard title={`Total de Tarefas: ${totalTarefas}`} actionLabel="Nova Tarefa">
        {tarefasPaginadas.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Progresso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Vencimento
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tarefasPaginadas.map((tarefa) => (
                  <tr key={tarefa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{tarefa.titulo}</div>
                      <div className="text-sm text-gray-500 mt-1">{tarefa.descricao}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tarefa.responsavel || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getIconePrioridade(tarefa.prioridade)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getCorPrioridade(
                            tarefa.prioridade,
                          )}`}
                        >
                          {tarefa.prioridade.charAt(0).toUpperCase() + tarefa.prioridade.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <StatusBadge status={tarefa.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${tarefa.percentualConclusao}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-600">
                          {tarefa.percentualConclusao}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatarData(tarefa.dataVencimento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onEdit={() => console.log('Editar tarefa:', tarefa.id)}
                        onDelete={() => console.log('Deletar tarefa:', tarefa.id)}
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
            <div className="text-5xl mb-4">✓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-gray-600">Você está em dia com suas tarefas!</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
