/**
 * Página: Pagamentos
 * Gerenciar transações e pagamentos
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockPagamentos, filtrarPagamentos, paginar, formatarMoeda, formatarDataCurta } from '@/lib/mockData';
import { DollarSign } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function PagamentosPage() {
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

  const pagamentosFiltrados = useMemo(() => {
    return filtrarPagamentos(searchTerm, statusFilter || undefined);
  }, [searchTerm, statusFilter]);

  const { items: pagamentosPaginados, total: totalPagamentos } = useMemo(() => {
    return paginar(pagamentosFiltrados, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [pagamentosFiltrados, currentPage]);

  const totalPages = Math.ceil(totalPagamentos / ITEMS_PER_PAGE);

  // Estatísticas
  const stats = useMemo(() => {
    const confirmados = mockPagamentos.filter((p) => p.status === 'confirmado');
    const pendentes = mockPagamentos.filter((p) => p.status === 'pendente');
    const falhados = mockPagamentos.filter((p) => p.status === 'falhou');

    return {
      confirmados: {
        count: confirmados.length,
        valor: confirmados.reduce((sum, p) => sum + p.valor, 0),
      },
      pendentes: {
        count: pendentes.length,
        valor: pendentes.reduce((sum, p) => sum + p.valor, 0),
      },
      falhados: {
        count: falhados.length,
        valor: falhados.reduce((sum, p) => sum + p.valor, 0),
      },
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
        <p className="text-gray-600 mt-2">Gerencie suas transações e receitas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Confirmados</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.confirmados.count}</p>
              <p className="text-sm text-green-600 mt-2">{formatarMoeda(stats.confirmados.valor)}</p>
            </div>
            <div className="text-green-500 opacity-20">
              <DollarSign size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pendentes.count}</p>
              <p className="text-sm text-yellow-600 mt-2">{formatarMoeda(stats.pendentes.valor)}</p>
            </div>
            <div className="text-yellow-500 opacity-20">
              <DollarSign size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Falhados</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.falhados.count}</p>
              <p className="text-sm text-red-600 mt-2">{formatarMoeda(stats.falhados.valor)}</p>
            </div>
            <div className="text-red-500 opacity-20">
              <DollarSign size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por ID ou descrição..."
        filters={[
          {
            label: 'Status',
            name: 'status',
            value: statusFilter,
            options: [
              { label: 'Confirmado', value: 'confirmado' },
              { label: 'Pendente', value: 'pendente' },
              { label: 'Falhou', value: 'falhou' },
              { label: 'Reembolsado', value: 'reembolsado' },
            ],
            onChange: handleStatusFilter,
          },
        ]}
      />

      {/* Table */}
      <TableCard title={`Total de Pagamentos: ${totalPagamentos}`} actionLabel="Novo Pagamento">
        {pagamentosPaginados.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pagamentosPaginados.map((pagamento) => (
                  <tr key={pagamento.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-600">
                      {pagamento.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pagamento.descricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                      {formatarMoeda(pagamento.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        {pagamento.metodo.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={pagamento.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatarDataCurta(pagamento.criadoEm)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onView={() => console.log('Ver pagamento:', pagamento.id)}
                        onDelete={() => console.log('Deletar pagamento:', pagamento.id)}
                        compact
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
            <div className="text-5xl mb-4">💳</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pagamento encontrado</h3>
            <p className="text-gray-600">Registre suas primeiras transações</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
