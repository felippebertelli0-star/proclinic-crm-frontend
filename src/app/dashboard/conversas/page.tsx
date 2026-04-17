/**
 * Página: Conversas
 * Gerenciar conversas e atendimentos
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockConversas, filtrarConversas, paginar } from '@/lib/mockData';
import { MessageCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function ConversasPage() {
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

  const conversasFiltradas = useMemo(() => {
    return filtrarConversas(searchTerm, statusFilter || undefined);
  }, [searchTerm, statusFilter]);

  const { items: conversasPaginadas, total: totalConversas } = useMemo(() => {
    return paginar(conversasFiltradas, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [conversasFiltradas, currentPage]);

  const totalPages = Math.ceil(totalConversas / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Conversas</h1>
        <p className="text-gray-600 mt-2">Gerencie seus atendimentos e conversas</p>
      </div>

      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por título..."
        filters={[
          {
            label: 'Status',
            name: 'status',
            value: statusFilter,
            options: [
              { label: 'Ativa', value: 'ativa' },
              { label: 'Fechada', value: 'fechada' },
              { label: 'Aguardando', value: 'aguardando' },
            ],
            onChange: handleStatusFilter,
          },
        ]}
      />

      <TableCard title={`Total de Conversas: ${totalConversas}`} actionLabel="Nova Conversa">
        {conversasPaginadas.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Agente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Mensagens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Última Mensagem
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {conversasPaginadas.map((conversa) => (
                  <tr key={conversa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="text-blue-600" size={18} />
                        <span className="font-medium text-gray-900">{conversa.titulo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {conversa.agente || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={conversa.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                        {conversa.nMensagens}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {conversa.ultimaMensagem || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onView={() => console.log('Abrir conversa:', conversa.id)}
                        onDelete={() => console.log('Deletar conversa:', conversa.id)}
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
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma conversa encontrada</h3>
            <p className="text-gray-600">Comece uma nova conversa para atender seus pacientes</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
