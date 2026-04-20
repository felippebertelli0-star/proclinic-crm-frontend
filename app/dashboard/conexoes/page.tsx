/**
 * Página: Conexões
 * Gerenciar integrações com serviços terceirizados
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockConexoes, filtrarConexoes, paginar, formatarData } from '@/lib/mockData';
import { AlertTriangle, CheckCircle2, Plug, Clock } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function ConexoesPage() {
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
  const conexaoStats = useMemo(() => {
    return {
      total: mockConexoes.length,
      conectadas: mockConexoes.filter((c) => c.status === 'conectado').length,
      desconectadas: mockConexoes.filter((c) => c.status === 'desconectado').length,
      comErros: mockConexoes.filter((c) => c.erros !== null).length,
    };
  }, []);

  const conexoesFiltradas = useMemo(() => {
    return filtrarConexoes(searchTerm, statusFilter || undefined);
  }, [searchTerm, statusFilter]);

  const { items: conexoesPaginadas, total: totalConexoes } = useMemo(() => {
    return paginar(conexoesFiltradas, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [conexoesFiltradas, currentPage]);

  const totalPages = Math.ceil(totalConexoes / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Conexões</h1>
        <p className="text-gray-600 mt-2">Gerenciar integrações com serviços terceirizados</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Conexões</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{conexaoStats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Conectadas</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{conexaoStats.conectadas}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Desconectadas</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{conexaoStats.desconectadas}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Com Erros</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{conexaoStats.comErros}</p>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por nome ou descrição..."
        filters={[
          {
            label: 'Status',
            name: 'status',
            value: statusFilter,
            options: [
              { label: 'Conectado', value: 'conectado' },
              { label: 'Desconectado', value: 'desconectado' },
            ],
            onChange: handleStatusFilter,
          },
        ]}
      />

      {/* Tabela de Conexões */}
      <TableCard title={`Total de Conexões: ${totalConexoes}`} actionLabel="Nova Conexão">
        {conexoesPaginadas.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Configurado por
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Última Sincronização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Erros
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {conexoesPaginadas.map((conexao) => (
                  <tr key={conexao.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Plug className="text-blue-600" size={20} />
                        <div className="font-medium text-gray-900">{conexao.nome}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{conexao.descricao}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Chave: <code className="bg-gray-100 px-1 rounded">{conexao.chaveAPI}</code>
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {conexao.status === 'conectado' ? (
                          <CheckCircle2 className="text-green-600" size={18} />
                        ) : (
                          <AlertTriangle className="text-orange-600" size={18} />
                        )}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            conexao.status === 'conectado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {conexao.status === 'conectado' ? 'Conectado' : 'Desconectado'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {conexao.usuarioConfiguracao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {formatarData(conexao.ultimaSincronizacao)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {conexao.erros ? (
                        <div className="text-sm text-red-600 font-medium">{conexao.erros}</div>
                      ) : (
                        <span className="text-green-600 text-sm font-medium">✓ Sem erros</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onEdit={() => console.log('Editar conexão:', conexao.id)}
                        onDelete={() => console.log('Deletar conexão:', conexao.id)}
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
            <div className="text-5xl mb-4">🔌</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma conexão encontrada</h3>
            <p className="text-gray-600">Configure sua primeira integração</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
