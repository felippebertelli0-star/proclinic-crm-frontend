/**
 * Página: Pedidos de Exames
 * Gerenciar solicitações e agendamentos de exames
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockPedidosExames, filtrarPedidosExames, paginar, formatarData } from '@/lib/mockData';
import { Microscope, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

// Ícone por status
const getIconeStatus = (status: string) => {
  if (status === 'realizado') return <CheckCircle2 className="text-green-600" size={18} />;
  if (status === 'agendado') return <Clock className="text-blue-600" size={18} />;
  if (status === 'cancelado') return <AlertCircle className="text-red-600" size={18} />;
  return <AlertCircle className="text-orange-600" size={18} />;
};

export default function PedidosExamesPage() {
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
  const exameStats = useMemo(() => {
    return {
      total: mockPedidosExames.length,
      solicitados: mockPedidosExames.filter((e) => e.status === 'solicitado').length,
      agendados: mockPedidosExames.filter((e) => e.status === 'agendado').length,
      realizados: mockPedidosExames.filter((e) => e.status === 'realizado').length,
      cancelados: mockPedidosExames.filter((e) => e.status === 'cancelado').length,
      resultadosAltadados: mockPedidosExames.filter((e) => e.resultado === 'Alterado').length,
    };
  }, []);

  const examesFiltrados = useMemo(() => {
    return filtrarPedidosExames(searchTerm, statusFilter || undefined).filter(
      (e) => !prioridadeFilter || e.prioridade === prioridadeFilter,
    );
  }, [searchTerm, statusFilter, prioridadeFilter]);

  const { items: examesPaginados, total: totalExames } = useMemo(() => {
    return paginar(examesFiltrados, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [examesFiltrados, currentPage]);

  const totalPages = Math.ceil(totalExames / ITEMS_PER_PAGE);

  // Função para obter cor de prioridade
  const getCorPrioridade = (prioridade: string) => {
    if (prioridade === 'alta') return 'bg-red-100 text-red-800';
    if (prioridade === 'media') return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos de Exames</h1>
        <p className="text-gray-600 mt-2">Gerenciar solicitações e agendamentos de exames</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Exames</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{exameStats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Solicitados</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{exameStats.solicitados}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Agendados</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{exameStats.agendados}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Realizados</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{exameStats.realizados}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Cancelados</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{exameStats.cancelados}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Alterados</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{exameStats.resultadosAltadados}</p>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por paciente, tipo de exame ou ID..."
        filters={[
          {
            label: 'Status',
            name: 'status',
            value: statusFilter,
            options: [
              { label: 'Solicitado', value: 'solicitado' },
              { label: 'Agendado', value: 'agendado' },
              { label: 'Realizado', value: 'realizado' },
              { label: 'Cancelado', value: 'cancelado' },
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

      {/* Tabela de Pedidos */}
      <TableCard title={`Total de Pedidos: ${totalExames}`} actionLabel="Novo Pedido">
        {examesPaginados.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    ID / Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Tipo de Exame
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Médico Responsável
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Laboratório
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Data Prevista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {examesPaginados.map((exame) => (
                  <tr key={exame.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Microscope className="text-blue-600" size={20} />
                        <div>
                          <div className="font-medium text-gray-900">{exame.id}</div>
                          <div className="text-sm text-gray-500">{exame.paciente}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {exame.tipoExame}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {exame.medico}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCorPrioridade(exame.prioridade)}`}>
                        {exame.prioridade.charAt(0).toUpperCase() + exame.prioridade.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getIconeStatus(exame.status)}
                        <span className="text-sm font-semibold text-gray-900">
                          {exame.status.charAt(0).toUpperCase() + exame.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {exame.laboratorio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatarData(exame.dataPrevista)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {exame.dataRealizado ? (
                        <span
                          className={`px-3 py-1 rounded-full font-semibold text-xs ${
                            exame.resultado === 'Normal'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {exame.resultado}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onView={() => console.log('Ver exame:', exame.id)}
                        onEdit={() => console.log('Editar exame:', exame.id)}
                        onDelete={() => console.log('Deletar exame:', exame.id)}
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
            <div className="text-5xl mb-4">🧬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pedido de exame encontrado</h3>
            <p className="text-gray-600">Comece solicitando exames para seus pacientes</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
