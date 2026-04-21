/**
 * Página: Filas
 * Gerenciar filas de atendimento e distribuição de chamados
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockFilas, filtrarFilas, paginar, formatarData } from '@/lib/mockData';
import { Users, Clock, CheckCircle2 } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function FilasPage() {
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
  const filaStats = useMemo(() => {
    return {
      total: mockFilas.length,
      ativas: mockFilas.filter((f) => f.status === 'ativa').length,
      totalAtendimentos: mockFilas.reduce((sum, f) => sum + f.totalAtendimentos, 0),
      tempoMedioGeral:
        Math.round(
          mockFilas.reduce((sum, f) => sum + f.tempoMedio, 0) / mockFilas.length,
        ) || 0,
    };
  }, []);

  const filasFiltradas = useMemo(() => {
    return filtrarFilas(searchTerm, statusFilter || undefined);
  }, [searchTerm, statusFilter]);

  const { items: filasPaginadas, total: totalFilas } = useMemo(() => {
    return paginar(filasFiltradas, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [filasFiltradas, currentPage]);

  const totalPages = Math.ceil(totalFilas / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Filas de Atendimento</h1>
        <p className="text-gray-600 mt-2">Gerenciar filas e distribuição de pacientes</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Filas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{filaStats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Filas Ativas</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{filaStats.ativas}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Atendimentos</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{filaStats.totalAtendimentos}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Tempo Médio (min)</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{filaStats.tempoMedioGeral}</p>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por nome da fila..."
        filters={[
          {
            label: 'Status',
            name: 'status',
            value: statusFilter,
            options: [
              { label: 'Ativa', value: 'ativa' },
              { label: 'Pausada', value: 'pausada' },
            ],
            onChange: handleStatusFilter,
          },
        ]}
      />

      {/* Tabela de Filas */}
      <TableCard title={`Total de Filas: ${totalFilas}`} actionLabel="Nova Fila">
        {filasPaginadas.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Nome da Fila
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Atendimentos
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Completos
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Tempo Médio
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Agentes Ativos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Última Atualização
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filasPaginadas.map((fila) => {
                  const percentualCompleto = Math.round(
                    (fila.atendimentosCompletos / fila.totalAtendimentos) * 100,
                  );

                  return (
                    <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{fila.nome}</div>
                        <div className="text-sm text-gray-500 mt-1">{fila.descricao}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            fila.status === 'ativa'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {fila.status === 'ativa' ? 'Ativa' : 'Pausada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2 font-semibold text-gray-900">
                          <Clock size={16} />
                          {fila.totalAtendimentos}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2 font-semibold text-green-600">
                          <CheckCircle2 size={16} />
                          {fila.atendimentosCompletos}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-semibold text-gray-900">
                          {fila.tempoMedio} min
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Users size={16} className="text-blue-600" />
                          <span className="font-semibold text-gray-900">{fila.agentesAtivos}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatarData(fila.ultimaAtualizacao)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <ActionButtons
                          onView={() => console.log('Abrir fila:', fila.id)}
                          onEdit={() => console.log('Editar fila:', fila.id)}
                          onDelete={() => console.log('Deletar fila:', fila.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
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
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma fila encontrada</h3>
            <p className="text-gray-600">Crie sua primeira fila de atendimento</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
